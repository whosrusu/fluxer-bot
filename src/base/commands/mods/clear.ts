import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import { getGuildPrefix } from "../../handler/systems/guild.js";

const Clear: ICommand = {
  name: "clear",
  aliases: ["cls"],
  usage: "[number]",
  example: "100",
  category: "moderation",
  description: "commands:clear.description",
  permissions: ["Administrator"],
  run: async (client, message, args, lang) => {
    const guild = message.guild;
    if (!guild) return;
    const prefix = getGuildPrefix(guild.id);
    const input = args[0];
    const amount = Math.floor(Number(input));

    if (isNaN(amount)) {
      await message.reply({
        content: t("missed_command_usage", lang, {
          prefix: prefix,
          command: "clear",
        }),
      });
      return;
    } else if (amount > 100) {
      await message.reply({
        content: t("commands:clear.response_sum_so_big", lang),
      });
      return;
    } else if (amount < 1) {
      await message.reply({
        content: t("commands:clear.response_sum_so_small", lang),
      });
      return;
    }

    const channel = message.channel;

    if (channel && channel.isTextBased()) {
      await channel.bulkDelete(amount);

      await channel.send({
        content: t("commands:clear.response", lang, { sum: amount }),
      });
    } else {
      await message.reply({
        content: t("commands:clear.not_text_channel", lang),
      });
    }
  },
};

export default Clear;
