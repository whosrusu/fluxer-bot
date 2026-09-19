import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import { getGuildPrefix, memberHighRole } from "../../handler/systems/guild.js";

const Ban: ICommand = {
  name: "ban",
  aliases: ["b"],
  usage: "[user]",
  example: "@user toxic",
  category: "moderation",
  description: "commands:ban.description",
  cooldown: 5,
  permissions: ["Administrator", "BanMembers"],
  run: async (client, message, args, lang) => {
    if (!client.user) return;

    const user =
      message.mentions[0] || message.guild?.members.get(String(args[0]));
    const reason = args.splice(1).join(" ");
    const prefix = await getGuildPrefix(String(message.guild?.id));
    if (!user) {
      await message.reply({
        content: t("missed_command_usge", lang, {
          prefix: prefix,
          command: "ban",
        }),
      });
      return;
    }

    const member = await message.guild?.fetchMember(user.id);
    const author = await message.guild?.fetchMember(message.author.id);
    const bot = await message.guild?.fetchMember(client.user?.id);
    if (!author || !member || !bot) return;

    const authorRolePositionHigh = memberHighRole(author);
    const memberRolePositionHigh = memberHighRole(member);
    const botRolePossitionHigh = memberHighRole(bot);

    if (botRolePossitionHigh < memberRolePositionHigh) {
      await message.reply({
        content: t("commands:mute.response_bot_low_role_position", lang),
      });
      return;
    } else if (authorRolePositionHigh < memberRolePositionHigh) {
      await message.reply({
        content: t("commands:mute.response_author_low_role_position", lang),
      });
    }

    await message.guild?.ban(member.id);
    await message.reply({
      content: t("commands:ban.response", lang, {
        user: member,
        reason: reason ?? "No reason",
      }),
    });
  },
};

export default Ban;
