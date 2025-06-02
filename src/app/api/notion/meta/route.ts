// app/api/notion/meta/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { databaseId, token } = await req.json();

  const res = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}`,
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
