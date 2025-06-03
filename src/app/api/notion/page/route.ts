import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { pageId, token } = await req.json();

  const res = await fetch(
    `https://api.notion.com/v1/blocks/${pageId}/children?page_size=100`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
      },
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
