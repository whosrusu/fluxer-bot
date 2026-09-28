import { Events } from "@fluxerjs/core";
import type { IEvent } from "../../../interfaces/interFluxer.js";
import {
  getLogConfig,
  logEmbedBuilder,
} from "../../handler/systems/guildLogs.js";
import { t } from "../../../i18n.js";
import { getGuildLanguage } from "../../handler/systems/guild.js";

type LogType = {
  id: string;
  actionType: number;
  userId: string;
  targetId: string;
  reason?: string;
  options: any[];
  changes: any[];
  guildId: string;
};

const AuditLogEntryCreate: IEvent = {
  name: Events.GuildAuditLogEntryCreate,
  async execute(log: LogType, client) {
    // console.log(log);

    const guild = client.guilds.get(String(log.guildId));
    if (!guild) return;
    const lang = await getGuildLanguage(guild.id);

    const row = await getLogConfig(guild.id);
    // channel delete
    if (log.actionType === 12) {
      const channelForLogChannel = guild.channels.get(String(row.channel));
      const changeChannel = log.changes[0];
      const eventChannel = changeChannel.key;
      if (eventChannel == "channel_id") {
        if (channelForLogChannel && channelForLogChannel.isTextBased()) {
          const embedForLogChannel = logEmbedBuilder(
            guild,
            t("event-channel-del", lang),
            `- ${t("event-moderator", lang)}: <@${log.userId}>
- ${t("event-channel", lang)}: ${log.changes[2].oldValue}`,
          );

          await channelForLogChannel.send({
            embeds: [embedForLogChannel],
          });
        }
      }
    }
    // channel create
    if (log.actionType === 10) {
      const channelForLogChannel = guild.channels.get(String(row.channel));
      const changeChannel = log.changes[0];
      let eventChannel = changeChannel.key;
      if (channelForLogChannel && channelForLogChannel.isTextBased()) {
        if (eventChannel == "channel_id") {
          const embedForLogChannel = logEmbedBuilder(
            guild,
            t("event-channel-create", lang),
            `- ${t("event-moderator", lang)}: <@${log.userId}>
- ${t("event-channel", lang)}: <#${log.targetId}>`,
          );

          await channelForLogChannel.send({
            embeds: [embedForLogChannel],
          });
        }
      }
    }
    // channel update
    if (log.actionType === 11) {
      if (row.channel) {
        const channelForLogChannel = guild.channels.get(String(row.channel));
        const changeChannel = log.changes[0];
        let eventChannel = changeChannel.key;

        let embedForLogChannel;

        // channel update name.
        if (eventChannel == "name") {
          embedForLogChannel = logEmbedBuilder(
            guild,
            t("event-channel-update", lang),
            `- ${t("event-moderator", lang)}: <@${log.userId}>
- ${t("event-channel", lang)}: <#${log.targetId}>
- Name: ${changeChannel.oldValue} > ${changeChannel.newValue}`,
          );
        }

        if (!embedForLogChannel) return;

        if (channelForLogChannel && channelForLogChannel.isTextBased()) {
          channelForLogChannel.send({
            embeds: [embedForLogChannel],
          });
        }
      }
    }
    // voice mute | def comunity
    if (log.actionType === 24) {
      if (row.voice) {
        const channelForLogVoiceMuted = guild.channels.get(String(row.voice));
        if (channelForLogVoiceMuted && channelForLogVoiceMuted.isTextBased()) {
          const resultVc = [];
          for (let change of log.changes) {
            resultVc.push(`${change.key}: ${change.newValue}`);
          }

          const embedForLogVoiceMuted = logEmbedBuilder(
            guild,
            t("event-voice", lang),
            `- ${t("event-moderator", lang)}: <@${log.userId}>
- ${t("event-member", lang)}: <@${log.targetId}>
- ${resultVc.join("\n")}`,
          );

          await channelForLogVoiceMuted.send({
            embeds: [embedForLogVoiceMuted],
          });
        }
      }
    }
    // kick log
    if (log.actionType === 20) {
      if (row.kick) {
        const channelForLogKick = guild.channels.get(String(row.kick));
        if (channelForLogKick && channelForLogKick.isTextBased()) {
          const embedForLogKick = logEmbedBuilder(
            guild,
            t("event-kick-member", lang),
            `- ${t("event-moderator", lang)}: <@${log.userId}>
- ${t("event-member", lang)}: <@${log.targetId}>
- ${t("event-reason", lang)}: <@${log.reason ?? "-"}`,
          );

          await channelForLogKick.send({
            embeds: [embedForLogKick],
          });
        }
      }
    }
    // unban logs
    if (log.actionType === 23) {
      if (row.ban) {
        const channelForLogUnban = guild.channels.get(String(row.ban));
        if (channelForLogUnban && channelForLogUnban.isTextBased()) {
          const embedForLogUnban = logEmbedBuilder(
            guild,
            t("event-unban-member", lang),
            `- ${t("event-moderator", lang)}: <@${log.userId}>
- ${t("event-member", lang)}: <@${log.targetId}>`,
          );

          await channelForLogUnban.send({
            embeds: [embedForLogUnban],
          });
        }
      }
    }
    // ban logs
    if (log.actionType === 22) {
      if (row.ban) {
        const channelForLogBan = guild.channels.get(String(row.ban));
        if (channelForLogBan && channelForLogBan.isTextBased()) {
          const embedForLogBan = logEmbedBuilder(
            guild,
            t("event-ban-member", lang),
            `- ${t("event-moderator", lang)}: <@${log.userId}>
- ${t("event-member", lang)}: <@${log.targetId}>
- ${t("event-reason", lang)}: ${log.reason ?? "-"}`,
          );

          await channelForLogBan.send({
            embeds: [embedForLogBan],
          });
        }
      }
    }
  },
};

export default AuditLogEntryCreate;
