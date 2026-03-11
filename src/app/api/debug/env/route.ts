import { NextResponse } from "next/server";
import pg from "pg";

async function testConnection(config: pg.PoolConfig, label: string) {
  try {
    const pool = new pg.Pool({ ...config, connectionTimeoutMillis: 8000 });
    const res = await pool.query("SELECT 1 as ok");
    await pool.end();
    return `${label}: CONNECTED`;
  } catch (err: unknown) {
    const e = err as Error & { code?: string };
    return `${label}: ${e.code || ""} ${e.message}`;
  }
}

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "";

  // Parse the URL to show what pg sees
  let parsed = "N/A";
  try {
    const u = new URL(dbUrl);
    parsed = `host=${u.hostname} port=${u.port} user=${u.username} db=${u.pathname} password_length=${u.password.length}`;
  } catch {
    parsed = "INVALID URL";
  }

  // Test 1: Connection string as-is
  const test1 = await testConnection(
    { connectionString: dbUrl },
    "raw_string"
  );

  // Test 2: With SSL disabled
  const test2 = await testConnection(
    { connectionString: dbUrl, ssl: false },
    "no_ssl"
  );

  // Test 3: With SSL rejectUnauthorized false
  const test3 = await testConnection(
    { connectionString: dbUrl, ssl: { rejectUnauthorized: false } },
    "ssl_no_verify"
  );

  // Test 4: Explicit params (bypasses URL parsing issues)
  let test4 = "skipped";
  try {
    const u = new URL(dbUrl);
    test4 = await testConnection(
      {
        host: u.hostname,
        port: parseInt(u.port) || 5432,
        database: u.pathname.slice(1),
        user: u.username,
        password: decodeURIComponent(u.password),
        ssl: { rejectUnauthorized: false },
      },
      "explicit_params"
    );
  } catch {
    test4 = "URL parse failed";
  }

  return NextResponse.json(
    {
      parsed_url: parsed,
      test1_raw: test1,
      test2_no_ssl: test2,
      test3_ssl_loose: test3,
      test4_explicit: test4,
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
