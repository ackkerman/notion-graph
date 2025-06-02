
## OAuth設定

| 項目 | 値  |
| --- | --- |
| **Auth URL**         | `https://api.notion.com/v1/oauth/authorize`                 |
| **Access Token URL** | `https://api.notion.com/v1/oauth/token` |
| **Client ID**        | `206d872b-594c-806f-b977-003773e7a2a2` |
| **Client Secret**    | `XX` |
| **Grant Type**       | `Authorization Code` |
| **Redirect URI**     | `http://localhost:3000/api/oauth/callback`） |

## Endpoints

- `https://api.notion.com/v1/databases/:id`
  - propertyの取得

- `https://api.notion.com/v1/databases/:id/query`
  - データベースのアイテム一覧を取得
