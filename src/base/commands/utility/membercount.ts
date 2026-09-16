import { EmbedBuilder } from "@fluxerjs/core";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import { config } from "../../config.js";
import { t } from "../../../i18n.js";

const Membercount: ICommand = {
  name: "membercount",
  aliases: ["members", "mc"],
  category: "utility",
  description: "commands:membercount.description",
  run: async (client, message, args, lang) => {
    if (!message.guild) return;
    const allCount = message.guild?.memberCount;
    let botsCount = 0;
    let humanCount = 0;

    for (const m of message.guild?.members.values()) {
      if (m.user.bot) {
        botsCount = botsCount + 1;
      } else {
        humanCount = humanCount + 1;
      }
    }

    const embed = new EmbedBuilder()
      .setColor(config.embed_color)
      .setTitle(t("commands:membercount.title", lang, { members: allCount }))
      .setThumbnail(String(message.guild?.iconURL()))
      .setAuthor({
        name: String(message.author.username),
        iconURL: String(message.author.avatarURL()),
      })
      .setDescription(`>>> ${t("commands:membercount.human_count", lang, { human_size: humanCount })}
${t("commands:membercount.bot_count", lang, { bot_size: botsCount })}`);

    await message.reply({
      embeds: [embed],
    });
  },
};

export default Membercount;
