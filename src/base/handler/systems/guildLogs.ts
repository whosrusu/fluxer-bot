import { EmbedBuilder, Guild } from "@fluxerjs/core";
import { pool } from "../db.js";
import { config } from "../../config.js";

export type AuditLogType =
  | "member_join"
  | "member_leave"
  | "channel"
  | "voice"
  | "ban"
  | "kick"
  | "message_edit"
  | "message_delete";

export const logEmbedBuilder = (
  guild: Guild,
  event_type: string,
  event_input: string,
) => {
  const embed = new EmbedBuilder()
    .setColor(config.embed_color)
    .setTitle(event_type)
    .setAuthor({ name: guild.name, iconURL: String(guild.iconURL()) })
    .setThumbnail(String(guild.iconURL()))
    .setDescription(event_input)
    .setTimestamp(new Date());

  return embed;
};

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
