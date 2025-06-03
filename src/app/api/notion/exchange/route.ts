import { NextRequest, NextResponse } from "next/server";

const redirectUri = process.env.NEXT_PUBLIC_NOTION_REDIRECT_URI! || "http://localhost:3000/oauth/callback";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  const basic = Buffer.from(
    `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://api.notion.com/v1/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${basic}`,   // ★ これが必須
    },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri
    }),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  return NextResponse.json({
    access_token: data.access_token,
    workspace_id: data.workspace_id,
    bot_id: data.bot_id,
  });
}
