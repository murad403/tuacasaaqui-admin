import { clearTokens } from "@/utils/auth";
import { NextResponse } from "next/server";

export async function POST() {
  await clearTokens();
  return NextResponse.json({ message: "Logged out successfully" });
}
