import type { GuildMember } from "@fluxerjs/core";
import { config } from "../../config.js";
import { pool } from "../db.js";

export const getWarns = async (guildId: string, memberId: string) => {
  const result = await pool.query(
    `
    SELECT * FROM warns
    WHERE guild_id = $1 AND member_id = $2
    `,
    [guildId, memberId],
  );

  return result.rows ?? 0;
};

export const resetWarns = async (guildId: string, memberId: string) => {
  const { rowCount } = await pool.query(
    `
    DELETE FROM warns 
    WHERE guild_id = $1 AND member_id = $2
    `,
    [guildId, memberId],
  );

  return (rowCount ?? 0) > 0;
};

export const removeWarn = async (
  guildId: string,
  memberId: string,
  caseId: number,
) => {
  const { rowCount } = await pool.query(
    `
    DELETE FROM warns 
    WHERE guild_id = $1 AND member_id = $2 AND case_id = $3
    `,
    [guildId, memberId, caseId],
  );

  return (rowCount ?? 0) > 0;
};

export const addWarn = async (
  guildId: string,
  memberId: string,
  moderatorId: string,
  reason: string,
) => {
  const result = await pool.query(
    `
    INSERT INTO warns (guild_id, member_id, case_id, reason, moderator_id)
    VALUES (
      $1,
      $2,
      COALESCE(
        (SELECT MAX(case_id) FROM warns WHERE guild_id = $1 AND member_id = $2),
        0
      ) + 1,
      $3,
      $4
    )
    RETURNING case_id
    `,
    [guildId, memberId, reason, moderatorId],
  );

  return result.rows[0]?.case_id as number;
};

export const memberHighRole = (member: GuildMember) => {
  let rolePositionHigh = 0;
  if (!member) return null;
  if (!member.roles) return null;
  for (const role of member.roles.cache.values()) {
    if (role.position > rolePositionHigh) {
      rolePositionHigh = role.position;
    }
  }

  return rolePositionHigh;
};

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
