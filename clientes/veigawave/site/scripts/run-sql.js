require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const fs = require("fs");
const { Pool } = require("pg");

const file = process.argv[2];
const sql = fs.readFileSync(file, "utf8");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool
  .query(sql)
  .then((res) => {
    console.log(`OK: ${file} executado.`);
    if (Array.isArray(res)) {
      res.forEach((r) => r.rowCount != null && console.log(`  rows affected: ${r.rowCount}`));
    } else if (res && res.rowCount != null) {
      console.log(`  rows affected: ${res.rowCount}`);
    }
  })
  .catch((err) => {
    console.error("ERRO:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
