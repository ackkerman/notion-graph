# Contributing to **Notion Graph**

Thank you for helping make **Notion Graph** better!  
We welcome issues, feature requests, pull-requests, docs — even tiny typo fixes.

---

## 📋 Table of Contents
1. [Code of Conduct](#-code-of-conduct)
2. [Prerequisites](#-prerequisites)
3. [Project Setup](#-project-setup)
4. [Branch & Commit Convention](#-branch--commit-convention)
5. [Pull-Request Checklist](#-pull-request-checklist)
6. [Issue Guidelines](#-issue-guidelines)
7. [Testing & Coverage](#-testing--coverage)
8. [Release Flow](#-release-flow)


## 🌟 Code of Conduct
Be kind, inclusive, and respectful. We follow the
[Contributor Covenant v2.1](https://www.contributor-covenant.org/).


## 🚀 Prerequisites
| Tool | Version | Purpose |
|------|---------|---------|
| **Node** | ≥ 18 LTS | Runtime |
| **pnpm** | ≥ 8 | Package manager |
| **Rust** | ≥ 1.74 | Needed by `lindera-wasm` (build-time) |
| **Wasm-pack** | latest | Packs WASM dependencies |
| **bunx** | optional | Faster cx lint/test (CI uses bun) |

> On macOS you can install Rust & wasm-pack with `brew install rust wasm-pack`.


## 🛠 Project Setup

```bash
# 1. Clone
git clone https://github.com/your-org/notion-graph && cd notion-graph

# 2. Install deps
pnpm i

# 3. Env
cp .env.example .env.local            # fill NOTION_* variables

# 4. Dev server
pnpm dev
```

## 🌳 Branch & Commit Convention

* **main** – always deployable
* **feat/**\<topic>, **fix/**\<bug>, **docs/**, **chore/**
* Use [Conventional Commits](https://www.conventionalcommits.org/):

  ```
  feat(graph): support multi-db merge
  fix(ui): collapse panel flicker
  docs(readme): fix broken badge
  ```

## ✅ Pull-Request Checklist

| Item                   | Command / Tool                   |
| ---------------------- | -------------------------------- |
| Type-check             | `pnpm lint:types` (tsc --noEmit) |
| ESLint                 | `pnpm lint`                      |
| Formatting             | `pnpm format` (Prettier)         |
| Unit tests             | `pnpm test`                      |
| E2E preview (optional) | `pnpm build && pnpm start`       |

> All checks run in GitHub Actions — a red check means your PR can’t be merged.


## 🐛 Issue Guidelines

1. **Search first.** Avoid duplicates.
2. Use one of the templates: `Bug Report`, `Feature Request`, `Question`.
3. Provide:

   * Notion Graph version (`npm run info`)
   * Browser / OS
   * Reproduction steps or minimal repo / screenshot / network log.

## 🧪 Testing & Coverage

* Unit tests — **Vitest** (`/tests/unit`)
* Component tests — **@testing-library/react** (`/tests/components`)
* Coverage report (`pnpm coverage`) must stay **> 90 %** for core utils.

CI will fail if coverage dips below threshold.

## 🚚 Release Flow

1. Merge PRs → `main`
2. Maintainer runs `pnpm version [patch|minor|major]`
3. GitHub Action builds & publishes:

   * **Git tag** (`v1.2.3`)
   * **Docker image** (`ghcr.io/your-org/notion-graph`)
   * **Vercel production deploy**

---

## 🤝 Thanks!

Every PR, star, or typo fix is appreciated.
Let’s build the best “Notion-to-Graph” visualiser together!
Happy hacking 💜