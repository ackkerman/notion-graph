const KEY = "notion_pages";

export function savePages(pages: any[]) {
  localStorage.setItem(KEY, JSON.stringify(pages));
}

export function loadPages(): any[] {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}
