import { NextResponse } from "next/server";

export async function GET() {
  const vars = [
    "DATABASE_URL",
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "OPENAI_API_KEY",
    "ANTHROPIC_API_KEY",
    "GOOGLE_AI_API_KEY",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    "CLERK_SECRET_KEY",
    "NEXT_PUBLIC_CLERK_SIGN_IN_URL",
    "NEXT_PUBLIC_CLERK_SIGN_UP_URL",
    "NEXT_PUBLIC_APP_URL",
  ];

  const result: Record<string, string> = {};

  for (const name of vars) {
    const val = process.env[name];
    if (!val) {
      result[name] = "NOT SET";
    } else if (name === "DATABASE_URL") {
      // Show host portion only
      const match = val.match(/@([^/]+)/);
      result[name] = match ? `...@${match[1]}/...` : `SET (${val.length} chars)`;
    } else if (name.startsWith("NEXT_PUBLIC_SUPABASE_URL")) {
      result[name] = val;
    } else if (name.startsWith("NEXT_PUBLIC_CLERK_SIGN")) {
      result[name] = val;
    } else {
      // Show first 8 and last 4 chars
      const preview =
        val.length > 16
          ? `${val.slice(0, 8)}...${val.slice(-4)}`
          : `SET (${val.length} chars)`;
      result[name] = preview;
    }
  }

  return NextResponse.json(result, {
    headers: { "Cache-Control": "no-store" },
  });
}
