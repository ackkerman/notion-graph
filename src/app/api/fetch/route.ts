import { getNotionPages } from "@/lib/notion";
import { NextResponse } from "next/server";

export async function GET() {
  const pages = await getNotionPages(process.env.DATABASE_ID!);
  return NextResponse.json(pages);
}
