/**
 * Utility helpers around Intl.DateTimeFormat
 *
 * @packageDocumentation
 */

export const ISO_LIKE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;

/** 共通オプション ― Notion が採用している `YYYY-MM-DD HH:mm` に寄せる */
const BASE_FMT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,     // 24h 表記
};

/**
 * ISO っぽい文字列を `YYYY-MM-DD HH:mm` で返す。
 * それ以外は入力をそのまま返す安全設計。
 *
 * @example
 * formatIso('2025-05-03T15:31:00.000Z') //=> '2025-05-03 15:31'
 */
export function formatIso(
  iso: string,
  locale: string | string[] = 'ja-JP',
  opts: Intl.DateTimeFormatOptions = BASE_FMT,
): string {
  if (!ISO_LIKE.test(iso)) return iso;

  const dt = new Date(iso);
  const fmt = new Intl.DateTimeFormat(locale, opts);
  // 例: 2025/05/03 15:31 → - に置換して完成
  return fmt.format(dt).replace(/\//g, '-');
}

/**
 * Date | number | string を受け取り指定フォーマットで返す便利関数。
 * `Intl.DateTimeFormat` 渡し替えも可。
 */
export function formatDate(
  date: string | number | Date,
  locale: string | string[] = 'ja-JP',
  opts: Intl.DateTimeFormatOptions = BASE_FMT,
): string {
  const dt = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;
  const fmt = new Intl.DateTimeFormat(locale, opts);
  return fmt.format(dt).replace(/\//g, '-');
}
