# Docsify Sitemap Generator

Generate an SEO friendly `sitemap.xml` for your Docsify site in seconds.

This tool supports both local filesystem crawling and GitHub repository integration, giving you maximum flexibility.

## Features

- **Local & GitHub**: Crawl Markdown files locally or fetch from a GitHub repo.
- **Sitemap Standards**: Generates a fully compliant `sitemap.xml` for optimal search engine indexing.
- **Rate Limit Friendly**: Support for GitHub Personal Access Tokens (PAT) to avoid API throttling.
- **Customizable**: Configure base directories, branches, output paths, and more.
- **Flexible Workflows**: Use via CLI or Web UI choose what fits your pipeline.

## Live Demo

Try it now without installing: [Docsify Sitemap Generator Web UI](https://tenelabs.github.io/docsify-sitemap)

## Installation

Install as a development dependency:

```bash
npm install --save-dev docsify-sitemap
# or
yarn add --dev docsify-sitemap
```

Or globally:

```bash
npm install -g docsify-sitemap
# or
yarn global add docsify-sitemap
```

## Quick Start

Run the CLI and follow prompts:

```bash
npx docsify-sitemap
```

You’ll be asked for your site URL, GitHub repo details (if applicable), and output location. A `sitemap.xml` file will be generated in your project.

## CLI Usage

```bash
docsify-sitemap [command] [options]
```

### Commands

| Command | Description                                |
| ------- | ------------------------------------------ |
| `local` | Generate sitemap from local Markdown files |

### Global Options

| Flag                | Description                                                         |
| ------------------- | ------------------------------------------------------------------- |
| `-u, --url <url>`   | **(required)** Website URL (e.g. `https://user.github.io/repo`)     |
| `-o, --owner <o>`   | GitHub owner or organization (required for repo mode)               |
| `-r, --repo <r>`    | GitHub repository name (required for repo mode)                     |
| `-b, --base <dir>`  | Base directory within repo or local path (default: `.`)             |
| `-B, --branch <b>`  | Git branch (default: `main`)                                        |
| `-p, --pat <token>` | GitHub Personal Access Token for private repos or higher rate limit |
| `-f, --output <f>`  | Output path and filename (default: `./public/sitemap.xml`)          |
| `-h, --help`        | Display help for commands                                           |
| `-V, --version`     | Output the current version                                          |

### Examples

#### Basic use

```bash
npx docsify-sitemap \
  -u https://user.github.io/repo \
  -o user \
  -r repo \
  -b docs \
  -p YOUR_GH_PAT \
  -f ./docs/sitemap.xml
```

#### Automated GitHub Action

```yaml
name: Generate Sitemap

on:
  push:
    paths:
      - "**/*.md"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Generate sitemap
        run: npx docsify-sitemap local -u WEBSITE_URL
      - name: Commit sitemap
        run: |
          git config user.name 'github-actions[bot]'
          git config user.email '41898282+github-actions[bot]@users.noreply.github.com'
          git add .
          git diff --cached --quiet || git commit -m 'chore: update sitemap.xml'
          git push
```

<!-- ## Configuration File (Optional)

Create a `docsify-sitemap.config.json` in your project root:

```json
{
  "url": "https://user.github.io/repo",
  "owner": "user",
  "repo": "repo",
  "branch": "main",
  "pat": "YOUR_PAT",
  "output": "./public/sitemap.xml",
  "base": "docs"
}
```

Then run:

```bash
npx docsify-sitemap --config docsify-sitemap.config.json
``` -->

## 🔧 API & Options Reference

| Option   | Type     | Default                | Description                                |
| -------- | -------- | ---------------------- | ------------------------------------------ |
| `url`    | `string` | —                      | **Required.** Site URL or GitHub Pages URL |
| `owner`  | `string` | —                      | GitHub owner/org (for repo mode)           |
| `repo`   | `string` | —                      | Repository name (for repo mode)            |
| `branch` | `string` | `main`                 | Branch containing your Docsify site        |
| `base`   | `string` | `.`                    | Base folder in repo or local filesystem    |
| `pat`    | `string` | —                      | GitHub PAT to increase rate limit          |
| `output` | `string` | `./public/sitemap.xml` | Output file path                           |

<!-- s| `config` | `string` | —                      | Path to JSON config file                   | -->

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes and test
4. Submit a pull request

We welcome enhancements, bug fixes, and documentation improvements. Please follow existing code style and conventions.

## License

This project is licensed under the [MIT License](./LICENSE).
