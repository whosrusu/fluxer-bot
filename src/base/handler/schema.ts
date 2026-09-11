import { config } from "../config.js";
import { pool } from "./db.js";

const createTable = (name: string, values: string[]) => {
  return `CREATE TABLE IF NOT EXISTS ${name}(${values.join(",")});`;
};

export async function initSchema() {
  const tables = [
    createTable("guild_language", [
      "guild_id BIGINT PRIMARY KEY",
      "lang TEXT NOT NULL DEFAULT 'en'",
    ]),
    createTable("guild_prefix", [
      "guild_id BIGINT PRIMARY KEY",
      `prefix TEXT NOT NULL DEFAULT '${config.prefix}'`,
    ]),
  ];

  await pool.query(tables.join("\n"));
}
