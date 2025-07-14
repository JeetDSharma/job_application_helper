import { NextRequest, NextResponse } from "next/server";
import { fetchCompany } from "@/lib/db/company";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const skip = Number(searchParams.get("skip")) || 0;
  const take = Number(searchParams.get("take")) || 20;

  const response = await fetchCompany({ skip, take });

  return NextResponse.json(response);
}
