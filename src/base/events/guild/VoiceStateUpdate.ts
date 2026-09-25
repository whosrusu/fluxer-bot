import { Events } from "@fluxerjs/core";
import type { IEvent } from "../../../interfaces/interFluxer.js";
import {
  getLogConfig,
  logEmbedBuilder,
} from "../../handler/systems/guildLogs.js";

const tmpDB = new Map<string, string>();

const MemberVoice: IEvent = {
  name: Events.VoiceStateUpdate,
  async execute(voice: any, client) {
    const log = await getLogConfig(voice.guild_id);
    const guild = client.guilds.get(voice.guild_id);
    if (!guild) return;

    if (log.voice) {
      const channelLog = guild.channels.get(log.voice);
      const member = await guild.fetchMember(voice.member.user.id);
      const channel = guild.channels.get(String(voice.channel_id));

      // when member leave from voice.
      if (!channel) {
        const oldChannel = tmpDB.get(member.id);
        const embed = logEmbedBuilder(
          guild,
          "Member Voice Leave",
          `- Member: ${member}
- Channel: <#${oldChannel}>`,
        );

        if (channelLog && channelLog.isTextBased()) {
          await channelLog.send({
            embeds: [embed],
          });
        }

        tmpDB.delete(member.id);
      } else if (channel) {
        if (tmpDB.get(member.id)) return;
        tmpDB.set(member.id, channel.id);
        const embed = logEmbedBuilder(
          guild,
          "Member Voice Join",
          `- Member: ${member}
- Channel: ${channel}`,
        );

        if (channelLog && channelLog.isTextBased()) {
          await channelLog.send({
            embeds: [embed],
          });
        }
      }
    }
  },
};

export default MemberVoice;
