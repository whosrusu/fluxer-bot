import { Events, Message } from "@fluxerjs/core";
import type { IEvent } from "../../../interfaces/interFluxer.js";
import {
  getLogConfig,
  logEmbedBuilder,
} from "../../handler/systems/guildLogs.js";
import { t } from "../../../i18n.js";
import { getGuildLanguage } from "../../handler/systems/guild.js";

const MessageUpdate: IEvent = {
  name: Events.MessageUpdate,
  async execute(old: Message, now: Message, client) {
    const guild = old.guild;
    if (!guild) return;
    if (!old.member) return;
    const lang = await getGuildLanguage(guild.id);

    const row = await getLogConfig(guild.id);
    if (row.message_edit) {
      if (old.member.user.bot) return;
      if (old.content === now.content) return;
      if (!old.content && !now.content) return;
      const channel = guild.channels.get(String(row.message_edit));
      if (channel && channel.isTextBased()) {
        const embedLog = logEmbedBuilder(
          guild,
          t("event-message-edit", lang),
          `- ${t("event-member", lang)}: ${old.author}
- ${t("event-message", lang)}: ${old.content} > ${now.content}`,
        );
        await channel.send({
          embeds: [embedLog],
        });
      }
    }
  },
};

export default MessageUpdate;
