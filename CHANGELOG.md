# Changelog

## [1.1.0](https://github.com/tenelabs/docsify-sitemap/compare/v1.0.1...v1.1.0) (2025-05-29)

### Features

* **cli:** add --ignore-dot-underscore flag and remove interactive mode ([#3](https://github.com/tenelabs/docsify-sitemap/issues/3)) ([e55a5a6](https://github.com/tenelabs/docsify-sitemap/commit/e55a5a6b87b4f828a40d87068947e8bfdeeac64b))

### Bug Fixes

* update OG and Twitter image URL for proper social media previews ([a58d50c](https://github.com/tenelabs/docsify-sitemap/commit/a58d50c5770625dec7bef78cdec544dc9deca3dd))

## [1.0.1](https://github.com/tenelabs/docsify-sitemap/compare/v1.0.0...v1.0.1) (2025-05-19)

## 1.0.0 (2025-05-19)

### ⚠ BREAKING CHANGES

* release initial stable version of Docsify Sitemap Generator

### Features

- **GitHub Repo Crawler**: Automatically fetches all `.md` files from a GitHub repo.
- **Local Mode**: Generate sitemap from local markdown files without GitHub.
- **Standards-compliant `sitemap.xml`**: Fully SEO-friendly and valid.
- **Interactive CLI**: Prompt-based user input for easy use.
- **Support for GitHub PAT**: Avoid API rate limits with personal tokens.
- **Branch + Base Support**: Target specific branches and subdirectories.
- **Configurable Output Path**: Write sitemap anywhere (`./public/sitemap.xml` by default).
- **GitHub Workflow Ready**: Easily integrate into CI/CD pipelines.
- **Web UI (Demo)**: Generate sitemap in the browser – no install needed.

* release initial stable version of Docsify Sitemap Generator ([8bc274a](https://github.com/tenelabs/docsify-sitemap/commit/8bc274aafd53ccd5a4d8b577c48c88d4ef657f0a))
