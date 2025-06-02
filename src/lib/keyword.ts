import TinySegmenter from "tiny-segmenter";
import { removeStopwords, jpn } from "stopword";

// 追加で弾きたい語
const CUSTOM_STOP = new Set([
  "系",
  "x",     // tweet の " / X" など
  "rt",
  "on",
  "|",
  "「",
  "」",
  "”",
  "“",
]);

const segmenter = new TinySegmenter();

/** 0) タイトル正規化 */
function normalize(text: string): string {
  return (
    text
      // ── URL・ツイッターの on X: ～ を除去
      .replace(/https?:\/\/\S+/g, "")
      .replace(/on\s+X:?/gi, "")
      // ── twitter の "ユーザー名 |肩書き:" を削る
      .replace(/^[^:|]+[:|]\s*/, "")
      // ── カッコ内の日付や絵文字を削る
      .replace(/\([^)]*\)$/g, "")
      // ── 記号をスペースに
      .replace(/[「」“”"『』【】\[\](),.:|\/]/g, " ")
      // ── 全角英数を半角に
      .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - 0xfee0)
      )
      .trim()
  );
}

/** 1) 分かち書き */
export function tokenize(text: string): string[] {
  const tokens = segmenter.segment(normalize(text));

  return tokens
    .map((t) => t.trim())
    .filter(Boolean)
    // アルファベットは小文字化
    .map((t) => (/^[A-Za-z]+$/.test(t) ? t.toLowerCase() : t));
}

/** 2) キーワード抽出 */
export function extractKeywords(title: string, topN = 5): string[] {
  const tokens = tokenize(title);

  // ストップワード & ヒューリスティック除去
  const filtered = removeStopwords(tokens, jpn).filter((t) => {
    if (CUSTOM_STOP.has(t)) return false;          // カスタム NG
    if (/^[\p{P}\p{S}]+$/u.test(t)) return false;  // 記号のみ
    if (/^\d+$/.test(t)) return false;             // 数字のみ
    if (t.length === 1) return false;              // 1 文字語
    return true;
  });

  // 頻度＋長さスコア
  const score: Record<string, number> = {};
  filtered.forEach((w) => {
    score[w] = (score[w] ?? 0) + 1 + w.length * 0.2; // 長い語を僅かに加点
  });

  return Object.entries(score)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([w]) => w);
}

/** 3) ページ配列に keywords を追加 */
export function addPageKeywords<
  T extends { id: string; title: string }
>(pages: T[], topN = 5): (T & { keywords: string[] })[] {
  return pages.map((p) => ({
    ...p,
    keywords: extractKeywords(p.title, topN),
  }));
}
