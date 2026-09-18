import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";

const Unban: ICommand = {
  name: "unban",
  aliases: ["unb"],
  usage: "[user_id]",
  example: "1540330808391241728",
  category: "moderation",
  description: "commands:unban.description",
  permissions: ["Administrator", "BanMemebers"],
  run: async (client, message, args, lang) => {
    const userId = args[0];
    if (!userId) {
      await message.reply({
        content: t("missed_command_usge", lang),
      });
      return;
    }

    const bans = await message.guild?.fetchBans();
    const hit = bans?.find((b) => b.user.id == userId);
    if (hit) {
      await hit.unban();
      await message.reply({
        content: t("commands:unban.response", lang),
      });
    } else if (!hit) {
      await message.reply({
        content: t("commands:unban.userid_unknow", lang),
      });
    }
  },
};

export default Unban;
