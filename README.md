
<p align="center">
  <img src="./public/notion-graph-icon.png" width="96" alt="Notion Graph icon"><br><br>
  <b>🕸️  Notion Graph — turn any Notion database into an interactive knowledge map</b><br>
  <a href="https://notion-graph-gray.vercel.app/">Live Demo</a> ・
  <a href="#-quick-start">Quick Start</a> ・
  <a href="#-directory-structure">Directory Structure</a> ・
  <a href="#%EF%B8%8F-scripts">Scripts</a>
</p>

*A lightweight OSS app that turns any Notion database into an interactive graph of pages, keywords, and multi-select tags.*

| Release | CI  | License |
| --- | --- | -- |
| ![version](https://img.shields.io/github/v/tag/ackkerman/notion-graph?label=version) | ![build](https://img.shields.io/github/actions/workflow/status/ackkerman/notion-graph/ci.yml?label=build) | ![license](https://img.shields.io/github/license/ackkerman/notion-graph) |

## ✨ Features

| Features | Description  |
| --- | --- |
| 🔐 **OAuth 2.0 (PKCE)**                | One-click login with your own Notion integration — no server secrets.               |
| 🗂 **Dynamic property mapping**        | Select any *multi-select* / *select* property at runtime and see it as graph nodes. |
| 🧠 **Lindera WASM keyword extraction** | Japanese tokenisation powered by Rust/Lindera running in the browser.               |
| 🕸 **Cytoscape layouts**               | COSE, Dagre, Elk, Cola, … switchable with a single click.                           |
| 🎨 **Notion-like UI**                  | Tailwind CSS v4 + CSS-first theme tokens for colours, radius, shadows.              |
| 📦 **100 % client-side**               | No backend—runs on Vercel/Pages/S3 as static files.                                 |

## 📸 Demo

[Live demo (on Vercel)](https://notion-graph-gray.vercel.app/)

![](./assets/usage.gif)

## 🚀 Getting Started

```bash
git clone https://github.com/ackkerman/notion-graph
cd notion-graph
pnpm i
cp .env.example .env.local   # add NOTION_CLIENT_ID / NOTION_CLIENT_SECRET
pnpm dev
```

1. **Create a Notion integration** → copy the client ID (and secret for *internal* integrations).
2. Add `http://localhost:3000/oauth/callback` to the integration’s Redirect URI list.
3. Open `http://localhost:3000`, click **Login with Notion**, pick any workspace, choose a database, and enjoy the graph!


## 🛠 Tech Stack

| Layer          | Library / Tool                                     |
| -------------- | -------------------------------------------------- |
| UI & Routing   | **Next.js 14** (app router)                        |
| Styling        | **Tailwind CSS v4** + CSS-first `@theme`           |
| Graph          | **react-cytoscapejs** + multiple layout extensions |
| NLP            | **lindera-wasm** (IPADIC)                          |
| Auth           | **Notion OAuth 2.0 PKCE**                          |
| Build / Deploy | Vercel / Cloudflare Pages                          |


## 🗺️ Roadmap

* [ ] Graph Clustering
* [ ] Adding view of connections and cut-out function
* [ ] Jump to original page from graph
* [ ] Coloring by status or other property as hue

> PRs & discussions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md).


## 📄 License

Apache License V2.0 

Copyright 2025 Ackkerman

## 🙏 Acknowledgements

* **Notion** for the open API
* **Lindera Project** for blazing-fast WASM tokeniser
* **Cytoscape.js** & extension authors
* All OSS maintainers keeping the ecosystem alive ❤️
