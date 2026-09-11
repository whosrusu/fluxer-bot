import { config } from "../../config.js";
import { pool } from "../db.js";

const ensureGuildLanguage = async (guildId: string) => {
  await pool.query(
    "INSERT INTO guild_language (guild_id, lang)  VALUES ($1, $2) ON CONFLICT (guild_id) DO NOTHING",
    [guildId, config.defaultLocale],
  );
};

export const setGuildLanguage = async (guildId: string, lang: string) => {
  await ensureGuildLanguage(guildId);
  const result = await pool.query(
    "UPDATE guild_language SET lang = $1 WHERE guild_id = $2 RETURNING lang",
    [lang, guildId],
  );
  return result.rows[0]?.lang;
};

export const getGuildLanguage = async (guildId: string): Promise<string> => {
  await ensureGuildLanguage(guildId);
  const result = await pool.query(
    "SELECT lang FROM guild_language WHERE guild_id = $1",
    [guildId],
  );

  return result.rows[0]?.lang;
};

const ensureGuildPrefix = async (guildId: string) => {
  await pool.query(
    `
        INSERT INTO guild_prefix (guild_id, prefix) VALUES ($1, $2)
        ON CONFLICT (guild_id) DO NOTHING
    `,
    [guildId, config.prefix],
  );
};
export const getGuildPrefix = async (guildId: string) => {
  await ensureGuildPrefix(guildId);
  const result = await pool.query(
    `
        SELECT prefix FROM guild_prefix WHERE guild_id = $1
    `,
    [guildId],
  );

  return result.rows[0]?.prefix;
};

export const setGuildPrefix = async (
  guildId: string,
  prefix: string,
): Promise<string> => {
  await ensureGuildPrefix(guildId);
  const updateResult = await pool.query(
    `
        UPDATE guild_prefix SET prefix = $1 WHERE guild_id = $2 RETURNING prefix
    `,
    [prefix, guildId],
  );

  const newPrefix = updateResult.rows[0]?.prefix;

  return newPrefix;
};
