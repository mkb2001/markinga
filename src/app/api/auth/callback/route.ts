import { NextResponse } from "next/server";

// With Clerk handling auth, this callback is no longer needed.
// Clerk manages OAuth callbacks internally.
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/dashboard`);
}
