import { Events, Message } from "@fluxerjs/core";
import type { IEvent } from "../../../interfaces/interFluxer.js";
import {
  getLogConfig,
  logEmbedBuilder,
} from "../../handler/systems/guildLogs.js";

const Delete: IEvent = {
  name: Events.MessageDelete,
  async execute(message: Message, client) {
    if (!message.guild) return;
    const member = await message.guild.members.get(message.author.id);

    const logCfg = await getLogConfig(message.guild.id);

    console.log(message.guild, logCfg, member);

    if (logCfg.message_delete) {
      const channel = message.guild.channels.get(logCfg.message_delete);
      if (channel && channel.isTextBased()) {
        const embed = logEmbedBuilder(
          message.guild,
          "Message Delete",
          `- Author: ${member}
- Content: ${message.content}`,
        );
        await channel.send({
          embeds: [embed],
        });
      }
    }
  },
};

export default Delete;
