import { pool } from "../db.js";

export type AuditLogType =
  "member_join" | "member_leave" | "voice" | "ban" | "kick";

export const getLogConfig = async (guildId: string) => {
  const result = await pool.query(
    `
    SELECT channels FROM guild_audit_log WHERE guild_id = $1
    `,
    [guildId],
  );

  if (result.rows.length === 0) {
    return {} as Record<AuditLogType, string>;
  }

  return result.rows[0].channels as Record<AuditLogType, string>;
};

export const remLogChannels = async (
  guildId: string,
  event: Partial<Record<AuditLogType, string>>,
) => {
  const merged = { ...event };
  await pool.query(
    `
    INSERT INTO guild_audit_log (guild_id, channels)
    VALUES ($1, $2)
    ON CONFLICT (guild_id) DO UPDATE SET channels = $2
    `,
    [guildId, merged],
  );
};

export const setLogChannels = async (
  guildId: string,
  channelIdByEvent: Partial<Record<AuditLogType, string>>,
) => {
  const current = await getLogConfig(guildId);
  const merged = { ...current, ...channelIdByEvent };

  await pool.query(
    `
    INSERT INTO guild_audit_log (guild_id, channels)
    VALUES ($1, $2)
    ON CONFLICT (guild_id) DO UPDATE SET channels = $2
    `,
    [guildId, merged],
  );
};
