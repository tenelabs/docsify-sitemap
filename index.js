let generatedXML = "";

// Toast
window.showToast = function (text, duration = 3000) {
  Toastify({
    text,
    duration,
    gravity: "bottom",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#333",
      color: "#fff",
      borderRadius: "5px",
    },
  }).showToast();
};

// Form Data
document.getElementById("sitemapForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = new FormData(form);

  const url = data.get("url")?.trim();
  const owner = data.get("owner")?.trim();
  const repo = data.get("repo")?.trim();
  const base = data.get("base")?.trim() || "";
  const branch = data.get("branch")?.trim() || "main";
  const pat = data.get("pat")?.trim();

  const output = document.querySelector(".output pre code");
  const downloadBtn = document.getElementById("downloadBtn");

  output.textContent = "Generating sitemap...";
  downloadBtn.disabled = true;
  document.getElementById("output").scrollIntoView({ behavior: "smooth" });

  try {
    showToast("Generating sitemap...");
    generatedXML = await generateSitemap({
      url,
      owner,
      repo,
      base,
      branch,
      pat,
    });
    output.textContent = generatedXML;
    Prism.highlightElement(output);
    showToast("Sitemap generated successfully");
    downloadBtn.disabled = false;
  } catch (err) {
    console.error(err);
    output.textContent = "Failed to generate sitemap. See console for details.";
    showToast("Failed to generate sitemap");
  }
});

// Generate Sitemap
export async function generateSitemap({ url, owner, repo, base, branch, pat }) {
  if (url.endsWith("/")) url = url.slice(0, -1);

  const headers = pat
    ? {
        Authorization: `token ${pat}`,
        Accept: "application/vnd.github.v3+json",
      }
    : { Accept: "application/vnd.github.v3+json" };

  const api = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;

  const res = await fetch(api, { headers });
  if (!res.ok)
    throw new Error(`Failed to fetch GitHub repo tree: ${res.statusText}`);

  const json = await res.json();
  console.log(json);

  if (!json.tree) throw new Error("Invalid response from GitHub API");

  let normalizedBase = (base || "").trim();
  if (
    normalizedBase === "." ||
    normalizedBase === "./" ||
    normalizedBase === "/" ||
    normalizedBase === ""
  ) {
    normalizedBase = "";
  } else {
    normalizedBase = normalizedBase.replace(/^\/|\/$/g, "");
  }

  const files = json.tree.filter(
    (item) =>
      item.type === "blob" &&
      item.path.endsWith(".md") &&
      (normalizedBase === "" || item.path.startsWith(normalizedBase + "/"))
  );

  const urls = files.map((file) => {
    let cleanPath = file.path.replace(/\.md$/, "");
    return `<url>\n  <loc>${url}/#/${cleanPath}</loc>\n  <priority>0.8</priority>\n</url>`;
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${url}/</loc>\n    <priority>1.0</priority>\n  </url>\n${urls.join(
    "\n"
  )}\n</urlset>`;

  return sitemap;
}

// Copy xml
window.copy = function () {
  if (!generatedXML) {
    showToast("Click 'Generate Sitemap' first.");
    return;
  }
  navigator.clipboard
    .writeText(generatedXML)
    .then(() => showToast("Sitemap copied to clipboard."))
    .catch((err) => {
      console.error("Failed to copy:", err);
      showToast("Failed to copy to clipboard.");
    });
};

// Download Sitemap
window.downloadSitemap = function () {
  if (!generatedXML) {
    showToast("No sitemap generated yet!");
    return;
  }

  const blob = new Blob([generatedXML], { type: "application/xml" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "sitemap.xml";
  link.click();
};
