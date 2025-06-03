/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */

/* -------------------------------------------------------------
 * lib/keyword.ts  ―  Lindera-wasm版キーワード抽出ユーティリティ
 * -------------------------------------------------------------
 * 変更点
 * 1.  tiny-segmenter  →  lindera-wasm（WASM 形態素解析器）
 * 2.  初期化は非同期なので、公開 API も Promise ベースに
 * 3.  既存呼び出しコードは `await` で包むだけで互換
 * ---------------------------------------------------------- */

import { removeStopwords, jpn } from "stopword";
import type { Tokenizer } from "lindera-wasm";

/* 追加で弾きたい語 */
const CUSTOM_STOP = new Set([
  "系",
  "x",
  "rt",
  "on",
  "|",
  "「",
  "」",
  "”",
  "“",
]);

/* ─────────── tokenizer singleton ─────────── */
let tokenizerPromise: Promise<Tokenizer> | null = null;

async function getTokenizer(): Promise<Tokenizer> {
  if (tokenizerPromise) return tokenizerPromise;

  tokenizerPromise = (async () => {
    const { TokenizerBuilder } = await import("lindera-wasm");

    const builder = new TokenizerBuilder();
    builder.setDictionaryKind("ipadic");
    builder.setMode("normal");
    builder.appendCharacterFilter("unicode_normalize", { kind: "nfkc" });
    builder.appendTokenFilter("japanese_compound_word", {
        "kind": "ipadic",
        "tags": [
            "名詞,数"
        ],
        "new_tag": "名詞,数"
    });

    return builder.build();
  })();

  return tokenizerPromise;
}

/* ─────────── 正規化 ─────────── */
function normalize(text: string): string {
  return (
    text
      .replace(/https?:\/\/\S+/g, "")
      .replace(/on\s+X:?/gi, "")
      .replace(/^[^:|]+[:|]\s*/, "")
      .replace(/\([^)]*\)$/g, "")
      .replace(/[「」“”"『』【】\[\](),.:|\/]/g, " ")
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0),
      )
      .trim()
  );
}

/* ─────────── 分かち書き ─────────── */
export async function tokenize(text: string): Promise<string[]> {
  const tokenizer = await getTokenizer();
  const tokens = tokenizer.tokenize(normalize(text));

  interface LinderaToken {
    get(key: string): string | undefined;
  }

  return (tokens as LinderaToken[])
    .map((t: LinderaToken) => String(t.get("text") || "").trim())
    .filter((t: string) => Boolean(t))
    .map((t: string) => (/^[A-Za-z]+$/.test(t) ? t.toLowerCase() : t));
}

/* ─────────── キーワード抽出 ─────────── */
export async function extractKeywords(
  title: string,
  topN = 5,
): Promise<string[]> {
  const tokens = await tokenize(title);

  const filtered = removeStopwords(tokens, jpn).filter((t) => {
    if (CUSTOM_STOP.has(t)) return false;
    if (/^[\p{P}\p{S}]+$/u.test(t)) return false;
    if (/^\d+$/.test(t)) return false;
    if (t.length === 1) return false;
    return true;
  });

  const score: Record<string, number> = {};
  filtered.forEach((w) => {
    score[w] = (score[w] ?? 0) + 1 + w.length * 0.2;
  });

  return Object.entries(score)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([w]) => w);
}

/* ─────────── ページに keywords を付与 ─────────── */
export async function addPageKeywords<
  T extends { id: string; title: string },
>(pages: T[], topN = 5): Promise<(T & { keywords: string[] })[]> {
  const enriched = await Promise.all(
    pages.map(async (p) => ({
      ...p,
      keywords: await extractKeywords(p.title, topN),
    })),
  );
  return enriched;
}
