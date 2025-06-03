import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { databaseId, token } = await req.json();     // token を body で受け取る

  const res = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({ 
        page_size: 5,
        sorts: [{ property: "Stacked at", direction: "ascending" }],
      }),
    }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
