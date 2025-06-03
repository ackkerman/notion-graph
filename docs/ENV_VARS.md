| Var | Example | Required | Notes |
|-----|---------|----------|-------|
| `NEXT_PUBLIC_NOTION_CLIENT_ID` | `206d872b-…` | ✅ | PKCEなので公開OK |
| `NOTION_CLIENT_SECRET`         | `***`        | ⬜ | **internal** integration時のみ |
| `NOTION_VERSION`               | `2022-06-28` | ✅ | 固定でAPI互換を担保 |
| `NEXT_PUBLIC_APP_URL`          | `http://localhost:3000` | ✅ | リダイレクトURI生成に使用 |

> **秘密鍵は API Route でのみ参照**—ブラウザへ流さない。