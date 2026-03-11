import pg from "pg";

const url = process.argv[2];
if (!url) {
  console.log("Usage: node scripts/test-db.mjs <DATABASE_URL>");
  console.log('Example: node scripts/test-db.mjs "postgresql://postgres.ref:password@host:6543/postgres"');
  process.exit(1);
}

console.log("Testing connection...");
try {
  const u = new URL(url);
  console.log(`  Host: ${u.hostname}`);
  console.log(`  Port: ${u.port}`);
  console.log(`  User: ${u.username}`);
  console.log(`  Password length: ${u.password}`);
  console.log(`  Database: ${u.pathname.slice(1)}`);
} catch {
  console.log("  Invalid URL format");
}

const configs = [
  { label: "Port 6543 + SSL", connectionString: url, ssl: { rejectUnauthorized: false } },
  { label: "Port 5432 + SSL", connectionString: url.replace(":6543/", ":5432/"), ssl: { rejectUnauthorized: false } },
  { label: "Port 6543 no SSL", connectionString: url, ssl: false },
  { label: "Port 5432 no SSL", connectionString: url.replace(":6543/", ":5432/"), ssl: false },
];

for (const { label, ...config } of configs) {
  try {
    const pool = new pg.Pool({ ...config, connectionTimeoutMillis: 10000 });
    const res = await pool.query("SELECT 1 as ok");
    console.log(`  ${label}: CONNECTED`);
    await pool.end();
  } catch (e) {
    console.log(`  ${label}: ${e.code || ""} ${e.message}`);
  }
}
