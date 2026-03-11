import { NextResponse } from "next/server";
import pg from "pg";

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
      const match = val.match(/@([^/]+)/);
      result[name] = match ? `...@${match[1]}/...` : `SET (${val.length} chars)`;
    } else if (name.startsWith("NEXT_PUBLIC_SUPABASE_URL")) {
      result[name] = val;
    } else if (name.startsWith("NEXT_PUBLIC_CLERK_SIGN")) {
      result[name] = val;
    } else {
      const preview =
        val.length > 16
          ? `${val.slice(0, 8)}...${val.slice(-4)}`
          : `SET (${val.length} chars)`;
      result[name] = preview;
    }
  }

  // Test database connection
  let dbStatus = "NOT TESTED";
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const pool = new pg.Pool({
        connectionString: dbUrl,
        connectionTimeoutMillis: 5000,
        ssl: { rejectUnauthorized: false },
      });
      const res = await pool.query("SELECT 1 as ok");
      dbStatus = res.rows[0]?.ok === 1 ? "CONNECTED" : "UNEXPECTED RESULT";
      await pool.end();
    } catch (err: unknown) {
      const e = err as Error & { code?: string };
      dbStatus = `ERROR: ${e.code || ""} ${e.message}`;
    }
  }

  return NextResponse.json(
    { ...result, DB_CONNECTION_TEST: dbStatus },
    { headers: { "Cache-Control": "no-store" } }
  );
}
