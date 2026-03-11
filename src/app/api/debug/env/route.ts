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

  let parsed = "N/A";
  try {
    const u = new URL(dbUrl);
    parsed = `host=${u.hostname} port=${u.port} user=${u.username} db=${u.pathname} pw_len=${u.password.length}`;
  } catch {
    parsed = "INVALID URL";
  }

  // Test 1: Port 6543 (transaction pooler) with SSL
  const test1 = await testConnection(
    { connectionString: dbUrl, ssl: { rejectUnauthorized: false } },
    "port6543_ssl"
  );

  // Test 2: Port 5432 (session pooler) with SSL
  const url5432 = dbUrl.replace(":6543/", ":5432/");
  const test2 = await testConnection(
    { connectionString: url5432, ssl: { rejectUnauthorized: false } },
    "port5432_ssl"
  );

  // Test 3: Port 6543 with pgbouncer param
  const urlBouncer = dbUrl.includes("?")
    ? dbUrl + "&pgbouncer=true"
    : dbUrl + "?pgbouncer=true";
  const test3 = await testConnection(
    { connectionString: urlBouncer, ssl: { rejectUnauthorized: false } },
    "port6543_pgbouncer"
  );

  // Test 4: Port 5432 no SSL
  const test4 = await testConnection(
    { connectionString: url5432, ssl: false },
    "port5432_no_ssl"
  );

  return NextResponse.json(
    { parsed_url: parsed, test1, test2, test3, test4 },
    { headers: { "Cache-Control": "no-store" } }
  );
}
