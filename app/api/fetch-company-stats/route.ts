import { NextRequest, NextResponse } from "next/server";
import { fetchCompanyCount } from "@/lib/db/company";

export async function GET(req: NextRequest) {
  const response = await fetchCompanyCount();
  return NextResponse.json(response);
}
