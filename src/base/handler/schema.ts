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
    createTable("warns", [
      "id BIGSERIAL PRIMARY KEY",
      "guild_id TEXT NOT NULL",
      "member_id TEXT NOT NULL",
      "case_id INT NOT NULL",
      "reason TEXT",
      "moderator_id TEXT NOT NULL",
      "created_at TIMESTAMPTZ DEFAULT NOW()",
      "UNIQUE (guild_id, member_id, case_id)",
    ]),
    createTable("guild_welcome", [
      "guild_id BIGINT PRIMARY KEY",
      "channel_id BIGINT NOT NULL",
      "message TEXT NOT NULL DEFAULT 'welcome {user}'",
    ]),
    createTable("guild_goodbye", [
      "guild_id BIGINT PRIMARY KEY",
      "channel_id BIGINT NOT NULL",
      "message TEXT NOT NULL DEFAULT 'goodbye {user}'",
    ]),
    createTable("guild_audit_log", [
      "guild_id BIGINT PRIMARY KEY",
      "channels JSONB NOT NULL DEFAULT '{}'::jsonb",
    ]),
  ];

  await pool.query(tables.join("\n"));
}
