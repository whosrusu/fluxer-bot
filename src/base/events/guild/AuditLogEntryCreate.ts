import { Events } from "@fluxerjs/core";
import type { IEvent } from "../../../interfaces/interFluxer.js";
import {
  getLogConfig,
  logEmbedBuilder,
} from "../../handler/systems/guildLogs.js";

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
    console.log(log);

    const guild = client.guilds.get(String(log.guildId));
    if (!guild) return;

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
            "Channel Delete",
            `- Moderator: <@${log.userId}>
- Channel: ${log.changes[2].oldValue}`,
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
            "Channel Create",
            `- Moderator: <@${log.userId}>
- Channel: <#${log.targetId}>`,
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
            "Channel Update",
            `- Moderator: <@${log.userId}>
- Channel: <#${log.targetId}>
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
            "Member voice",
            `- Moderator: <@${log.userId}>
- Member: <@${log.targetId}>
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
            "Member kicked.",
            `- Moderator: <@${log.userId}>
- Member: <@${log.targetId}>
- Reason: <@${log.reason ?? "No reason"}`,
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
            "Member unbanned",
            `- Moderator: <@${log.userId}>
- Member: <@${log.targetId}>`,
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
            "Member Banned.",
            `- Moderator: <@${log.userId}>
- Member: <@${log.targetId}>
- Reason: ${log.reason ?? "No reason."}`,
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
