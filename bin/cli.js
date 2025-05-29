#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import pkg from "../package.json";
import fs from "fs";
import path from "path";

console.log(chalk.cyan(pkg.displayName || "Docsify Sitemap Generator"));

const program = new Command();
program
  .name(pkg.displayName)
  .version(pkg.version)
  .description(pkg.description)
  .enablePositionalOptions();

function saveSitemap(xml, out = "./public/sitemap.xml") {
  const dir = path.dirname(out);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(out, xml, "utf-8");
}

function getMarkdownFilesFromLocal(baseDir = ".", ignoreDotUnderscore = false) {
  const root = path.resolve(baseDir);
  function walk(dir) {
    return fs.readdirSync(dir).flatMap((name) => {
      if (ignoreDotUnderscore && /^[._]/.test(name)) return [];
      const full = path.join(dir, name);
      return fs.statSync(full).isDirectory()
        ? walk(full)
        : name.endsWith(".md")
        ? [path.relative(root, full).replace(/\\/g, "/")]
        : [];
    });
  }
  return walk(root);
}

async function generateSitemap({
  url,
  owner,
  repo,
  base = "",
  branch = "main",
  pat,
  local,
  ignoreDotUnderscore = false,
}) {
  url = url.replace(/\/$/, "");
  let paths = [];

  const normBase = base.trim().replace(/^\/|\/$/g, "");

  if (local) {
    paths = getMarkdownFilesFromLocal(normBase, ignoreDotUnderscore);
  } else {
    if (!owner || !repo) throw new Error("Missing GitHub owner or repo.");

    const headers = pat
      ? {
          Authorization: `token ${pat}`,
          Accept: "application/vnd.github.v3+json",
        }
      : { Accept: "application/vnd.github.v3+json" };

    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      { headers }
    );
    if (!res.ok) throw new Error(`GitHub API: ${res.statusText}`);
    const json = await res.json();
    if (!json.tree) throw new Error("Invalid response from GitHub API");

    paths = json.tree
      .filter(
        (item) =>
          item.type === "blob" &&
          item.path.endsWith(".md") &&
          (normBase === "" || item.path.startsWith(normBase + "/")) &&
          (!ignoreDotUnderscore || !/[\/\\][._]/.test("/" + item.path))
      )
      .map((item) => item.path);
  }

  const urls = paths.map((p) => {
    const clean = p.replace(/\.md$/, "");
    return `<url>\n  <loc>${url}/#/${clean}</loc>\n  <priority>0.8</priority>\n</url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${url}/</loc>\n    <priority>1.0</priority>\n  </url>\n${urls.join(
    "\n"
  )}\n</urlset>`;
}

async function promptOrCancel(fn) {
  const r = await fn();
  if (isCancel(r)) {
    outro("Cancelled.");
    process.exit(0);
  }
  return r;
}

program
  .command("local")
  .description("Generate sitemap from local markdown files")
  .requiredOption("-u, --url <url>", "Website URL")
  .option("-b, --base <base>", "Base directory", "")
  .option("-f, --output <file>", "Output path", "./public/sitemap.xml")
  .option("-i, --ignore-dot-underscore", "Ignore files starting with . or _")
  .action(async (opts) => {
    try {
      const xml = await generateSitemap({
        url: opts.url,
        base: opts.base || "",
        local: true,
        ignoreDotUnderscore: opts.ignoreDotUnderscore || false,
      });
      saveSitemap(xml, opts.output);
      console.log(chalk.green(`Sitemap saved to ${opts.output}`));
    } catch (err) {
      console.error(chalk.red("Error:"), err.message);
      process.exit(1);
    }
  });

program
  .option("-u, --url <url>", "Site URL")
  .option("-o, --owner <owner>", "GitHub owner")
  .option("-r, --repo <repo>", "GitHub repo name")
  .option("-b, --base <base>", "Base directory", "")
  .option("-B, --branch <branch>", "Branch", "main")
  .option("-p, --pat <pat>", "GitHub PAT")
  .option("-f, --output <file>", "Output path", "./public/sitemap.xml")
  .option("-i, --ignore-dot-underscore", "Ignore files starting with . or _");

program.parseAsync(process.argv).catch((err) => {
  console.error(chalk.red("Unhandled Error:"), err.message);
  process.exit(1);
});
