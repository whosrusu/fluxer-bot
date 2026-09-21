import { Events, Message } from "@fluxerjs/core";
import type { IEvent } from "../../../interfaces/interFluxer.js";
import {
  getLogConfig,
  logEmbedBuilder,
} from "../../handler/systems/guildLogs.js";

const MessageUpdate: IEvent = {
  name: Events.MessageUpdate,
  async execute(old: Message, now: Message, client) {
    const guild = old.guild;
    if (!guild) return;
    if (!old.member) return;

    const row = await getLogConfig(guild.id);
    if (row.message_edit) {
      if (old.member.user.bot) return;
      if (old.content === now.content) return;
      const channel = guild.channels.get(String(row.message_edit));
      if (channel && channel.isTextBased()) {
        const embedLog = logEmbedBuilder(
          guild,
          "Message Edit",
          `- Author: ${old.author}
- Old: ${old.content}
- New: ${now.content}`,
        );
        await channel.send({
          embeds: [embedLog],
        });
      }
    }
  },
};

export default MessageUpdate;
