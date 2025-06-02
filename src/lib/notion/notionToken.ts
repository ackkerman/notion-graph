const STORAGE_KEY = "notion_token";

/**
 * Notion アクセストークンを localStorage に保存
 */
export function saveNotionToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, token);
}

/**
 * 保存された Notion アクセストークンを取得
 */
export function getNotionToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

/**
 * トークンがない場合はエラーを投げる
 */
export function requireNotionToken(): string {
  const token = getNotionToken();
  if (!token) throw new Error("Notion トークンが存在しません。OAuth 認証を実行してください。");
  return token;
}

/**
 * トークンを削除する（ログアウト等に使用）
 */
export function clearNotionToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
