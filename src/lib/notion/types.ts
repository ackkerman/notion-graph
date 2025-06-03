export interface DbProperty {
  id: string;
  name: string;
  type: string;
}

export type DbInfo = { id: string; title: string };


export interface NotionPage {
  id: string;
  title: string;
  createdTime: string;
  lastEditedTime: string;
  url: string;
  keywords?: string[];
  [key: string]: string | string[] | undefined;
}

export interface NotionProperty {
  type: string;
  [key: string]: unknown;
}

export interface NotionRawPage {
  id: string;
  created_time: string;
  last_edited_time: string;
  url: string;
  properties: Record<string, NotionProperty>;
}
