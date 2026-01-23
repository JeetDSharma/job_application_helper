import { NextResponse } from "next/server";
import { fetchCompanyCount } from "@/lib/db/company";

export async function GET() {
  const response = await fetchCompanyCount();
  return NextResponse.json(response);
}
