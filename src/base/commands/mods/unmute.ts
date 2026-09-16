import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";

const unMute: ICommand = {
  name: "unmute",
  aliases: ["untimeout", "unm"],
  usage: "[user] [time]",
  example: "@user",
  category: "moderation",
  permissions: ["MuteMembers"],
  description: "commands:unmute.description",
  run: async (client, message, args, lang) => {
    const member =
      message.mentions[0] || message.guild?.members.get(String(args[0]));
    if (!member) {
      await message.reply({
        content: t("missing_member", lang),
      });
      return;
    }

    const guildMember = await message.guild?.fetchMember(member.id);
    guildMember?.timeout(null);
    await message.reply({
      content: t("commands:unmute.response", lang, { user: guildMember }),
    });
  },
};

export default unMute;
