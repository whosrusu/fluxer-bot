import { Pool } from "pg";
import { config } from "../config.js";

export const pool = new Pool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  database: config.database.name,
  password: config.database.password,
  max: config.database.max,
  idleTimeoutMillis: config.database.idleTimeoutMillis,
  connectionTimeoutMillis: config.database.connectionTimeoutMillis,
});

process.on("SIGINT", async () => {
  await pool.end();
  console.log("PostgreSQL pool closed.");
  process.exit(0);
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err);
});
