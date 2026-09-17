import type { GuildMember } from "@fluxerjs/core";
import { config } from "../../config.js";
import { pool } from "../db.js";

export const getChannel = (text: string) => {
  const match = text.match(/<#([^>]+)>/);
  return match ? { id: match[1] } : null;
};

// goodbye system
export const removeGuildGoodbye = async (guildId: string) => {
  const row = await checkGuildWelcome(guildId);
  if (!row) {
    return false;
  } else if (row) {
    await pool.query(
      `
      DELETE FROM guild_goodbye WHERE guild_id = $1
      `,
      [guildId],
    );
    return true;
  }
};

export const ensureGuildGoodBye = async (
  guildId: string,
  channelId: string,
  message?: string,
) => {
  if (message) {
    await pool.query(
      `
        INSERT INTO guild_goodbye (guild_id, channel_id, message) VALUES ($1, $2, $3)
        ON CONFLICT (guild_id) DO NOTHING
    `,
      [guildId, channelId, message],
    );
  } else if (!message) {
    await pool.query(
      `
        INSERT INTO guild_goodbye (guild_id, channel_id) VALUES ($1, $2)
        ON CONFLICT (guild_id) DO NOTHING
    `,
      [guildId, channelId],
    );
  }
};

export const checkGuildGoodbye = async (guildId: string) => {
  const result = await pool.query(
    "SELECT * FROM guild_goodbye WHERE guild_id = $1",
    [guildId],
  );
  const row = result.rows[0];
  return row
    ? {
        guild_id: row.guild_id,
        channel_id: row.channel_id,
        message: row.message,
      }
    : null;
};

export const setGuildGoodBye = async (
  guildId: string,
  channelId: string,
  message?: string,
) => {
  const row = await checkGuildGoodbye(guildId);

  if (!row) {
    await ensureGuildGoodBye(guildId, channelId, message);
  } else if (row.channel_id != channelId && !message) {
    await pool.query(
      `
      UPDATE guild_goodbye SET channel_id = $1 WHERE guild_id = $2
      `,
      [channelId, guildId],
    );
  } else if (row.channel_id == channelId && message) {
    await pool.query(
      `
      UPDATE guild_goodbye SET message = $1 WHERE guild_id = $2
      `,
      [message, guildId],
    );
  } else if (row.channel_id != channelId && message) {
    await pool.query(
      `
      UPDATE guild_goodbye SET channel_id = $1, message = $2 WHERE guild_id =  $3
      `,
      [channelId, message, guildId],
    );
  }
};

// welcome system
export const removeGuildWelcome = async (guildId: string) => {
  const row = await checkGuildWelcome(guildId);
  if (!row) {
    return false;
  } else if (row) {
    await pool.query(
      `
      DELETE FROM guild_welcome WHERE guild_id = $1
      `,
      [guildId],
    );
    return true;
  }
};

export const ensureGuildWelcome = async (
  guildId: string,
  channelId: string,
  message?: string,
) => {
  if (message) {
    await pool.query(
      `
        INSERT INTO guild_welcome (guild_id, channel_id, message) VALUES ($1, $2, $3)
        ON CONFLICT (guild_id) DO NOTHING
    `,
      [guildId, channelId, message],
    );
  } else if (!message) {
    await pool.query(
      `
        INSERT INTO guild_welcome (guild_id, channel_id) VALUES ($1, $2)
        ON CONFLICT (guild_id) DO NOTHING
    `,
      [guildId, channelId],
    );
  }
};

export const checkGuildWelcome = async (guildId: string) => {
  const result = await pool.query(
    "SELECT * FROM guild_welcome WHERE guild_id = $1",
    [guildId],
  );
  const row = result.rows[0];
  return row
    ? {
        guild_id: row.guild_id,
        channel_id: row.channel_id,
        message: row.message,
      }
    : null;
};

export const setGuildWelcome = async (
  guildId: string,
  channelId: string,
  message?: string,
) => {
  const row = await checkGuildWelcome(guildId);

  if (!row) {
    await ensureGuildWelcome(guildId, channelId, message);
  } else if (row.channel_id != channelId && !message) {
    await pool.query(
      `
      UPDATE guild_welcome SET channel_id = $1 WHERE guild_id = $2
      `,
      [channelId, guildId],
    );
  } else if (row.channel_id == channelId && message) {
    await pool.query(
      `
      UPDATE guild_welcome SET message = $1 WHERE guild_id = $2
      `,
      [message, guildId],
    );
  } else if (row.channel_id != channelId && message) {
    await pool.query(
      `
      UPDATE guild_welcome SET channel_id = $1, message = $2 WHERE guild_id =  $3
      `,
      [channelId, message, guildId],
    );
  }
};

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
