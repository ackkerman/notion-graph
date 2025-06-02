/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import GraphPanel from "@/components/GraphPanel";

import { getNotionToken } from "@/lib/notion/notionToken";

import type { PageKW } from "@/lib/graph";
import { fetchDatabasePages, NotionPage } from "@/lib/notion/notionDatabase";
import { fetchDatabaseProperties, DbProperty } from "@/lib/notion/notionMeta";
import { addPageKeywords } from "@/lib/keyword";
import { listDatabases, DbInfo } from "@/lib/notion/notionDbList";

const clientId = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID!;
const redirectUri = "http://localhost:3000/oauth/callback";

export default function Page() {
  /* ───── state ─────────────────────────────── */
  const [authenticated, setAuthenticated] = useState(false);
  const [dbList, setDbList] = useState<DbInfo[]>([]);
  const [selectedDbId, setSelectedDbId] = useState<string | null>(null);

  const [items, setItems] = useState<NotionPage[]>([]);
  const [itemsKW, setItemsKW] = useState<PageKW[] | null>(null);
  const [props, setProps] = useState<DbProperty[]>([]);
  const [error, setError] = useState<string | null>(null);

  /* ───── OAuth 認可 ───────────────────────── */
  const authorize = async () => {
    const codeVerifier = generateRandomString(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem("code_verifier", codeVerifier);

    const url = new URL("https://api.notion.com/v1/oauth/authorize");
    url.searchParams.set("owner", "user");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("redirect_uri", redirectUri);
    url.searchParams.set("code_challenge_method", "S256");
    url.searchParams.set("code_challenge", codeChallenge);

    window.location.href = url.toString();
  };

  /* ───── DB 一覧取得 ─────────────────────── */
  const loadDatabaseList = async () => {
    try {
      const list = await listDatabases();
      setDbList(list);
    } catch (e: any) {
      setError(e.message);
    }
  };

  /* ───── ページ／プロパティ取得 ───────────── */
  const fetchItems = async (dbId: string) => {
    try {
      // プロパティ
      const meta = await fetchDatabaseProperties(dbId);
      setProps(meta.filter((p) => p.type === "multi_select" || p.type === "select"));

      // ページ
      const pages = await fetchDatabasePages(dbId);
      setItems(pages);
      setItemsKW(null); // リセット
    } catch (e: any) {
      setError(e.message);
    }
  };

  /* ───── 認証後の初期処理 ───────────────── */
  useEffect(() => {
    const token = getNotionToken();
    if (!token) return;
    setAuthenticated(true);
    loadDatabaseList();
  }, []);

  /* ───── DB 選択変更時にページ取得 ───────── */
  useEffect(() => {
    if (selectedDbId) fetchItems(selectedDbId);
  }, [selectedDbId]);

  /* ───── キーワード抽出ボタン ───────────── */
  const handleExtract = () => {
    const enriched = addPageKeywords(items, 10);
    setItemsKW(enriched);
  };

  /* ───── JSX ───────────────────────────── */
  return (
    <main className="mx-auto max-w-5xl space-y-6 bg-n-bg p-6 text-n-black">
      {/* ── Header ────────────────────────── */}
      <header className="flex items-center gap-3">
        <Image
          src="/notion-graph-icon.png"
          alt="Notion Logo"
          width={36}
          height={36}
          className="rounded-[var(--radius-btn)]"
        />
        <h1 className="text-2xl font-semibold tracking-tight">Notion Graph</h1>
      </header>

      {/* ── Auth button ───────────────────── */}
      {!authenticated && (
        <button
          onClick={authorize}
          className="rounded-[var(--radius-btn)] bg-n-blue px-4 py-2 text-sm font-medium text-white hover:bg-n-blue/80"
        >
          Notion にログイン
        </button>
      )}

      {/* ── Main UI ───────────────────────── */}
      {authenticated && (
        <section className="space-y-6">
          {/* DB selector + extract button in one line */}
          <div className="flex flex-wrap items-end gap-4">
            <label className="text-sm font-medium">
              Database
              <select
                value={selectedDbId ?? ""}
                onChange={(e) => setSelectedDbId(e.target.value)}
                className="ml-2 rounded-[var(--radius-btn)] border border-n-gray bg-white px-3 py-1 text-sm"
              >
                <option value="" disabled>
                  -- 選択 --
                </option>
                {dbList.map((db) => (
                  <option key={db.id} value={db.id}>
                    {db.title || "(無題)"} — {db.id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </label>

            <button
              onClick={handleExtract}
              disabled={items.length === 0}
              className="rounded-[var(--radius-btn)] bg-n-blue px-4 py-2 text-sm font-medium text-white enabled:hover:bg-n-blue/80 disabled:opacity-40"
            >
              キーワード抽出
            </button>
          </div>

          {/* Graph */}
          {itemsKW && <GraphPanel pages={itemsKW} />}

          {/* Property list */}
          <details open className="rounded-lg border border-n-gray bg-white p-4 shadow-[var(--shadow-card)]">
            <summary className="cursor-pointer select-none text-sm font-semibold">
              📄 プロパティ ({props.length})
            </summary>
            <ul className="ml-5 list-disc space-y-0.5 pt-2 text-sm">
              {props.map((p) => (
                <li key={p.id}>
                  {p.name} — <code>{p.type}</code>
                </li>
              ))}
            </ul>
          </details>

          {/* Page list */}
          <details open className="rounded-lg border border-n-gray bg-white p-4 shadow-[var(--shadow-card)]">
            <summary className="cursor-pointer select-none text-sm font-semibold">
              📝 ページ ({items.length})
            </summary>

            <ul className="ml-6 mt-3 list-disc space-y-3 text-sm">
              {(itemsKW ?? items).map((p: any) => (
                <li key={p.id} className="space-y-1">
                  <div className="font-medium">{p.title}</div>

                  {/* キーワードバッジ */}
                  {"keywords" in p && (
                    <div className="flex flex-wrap gap-1">
                      {p.keywords.map((kw: string) => (
                        <span
                          key={kw}
                          className="rounded-[var(--radius-btn)] bg-n-yellow-bg px-2 py-0.5 text-xs font-medium text-n-black"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="text-xs text-n-gray-600">
                    {new Date(p.createdTime).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </details>
        </section>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </main>
  );
}

/* ─── utils: PKCE ────────────────────────── */
function generateRandomString(length: number) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array).map((b) => b.toString(36)).join("").slice(0, length);
}
async function generateCodeChallenge(verifier: string) {
  const data = new TextEncoder().encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}
