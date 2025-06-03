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
  keywords?: string[];
  [key: string]: string | string[] | undefined;
}

export interface NotionRawPage  {
  id: string;
  created_time: string;
  last_edited_time: string;
  properties: {
    [key: string]: {
      type: string;
      title?: { plain_text: string }[];
    };
  };
};