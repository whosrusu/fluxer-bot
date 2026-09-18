import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import { getGuildPrefix, memberHighRole } from "../../handler/systems/guild.js";

const Kick: ICommand = {
  name: "kick",
  aliases: ["k"],
  usage: "[user] <reason>",
  example: "@user spammer",
  category: "moderation",
  description: "commands:kick.description",
  permissions: ["Administrator", "KickMembers"],
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
          command: "kick",
        }),
      });
      return;
    }

    const member = await message.guild?.fetchMember(user?.id);
    const author = await message.guild?.fetchMember(message.author.id);
    const bot = await message.guild?.fetchMember(client.user?.id);
    if (!member || !author || !bot) return;

    const authorRolePositionHigh = memberHighRole(author);
    const memberRolePositionHigh = memberHighRole(member);
    const botRolePossitionHigh = memberHighRole(bot);

    if (botRolePossitionHigh < memberRolePositionHigh) {
      await message.reply({
        content: t("commands:kick.response_bot_low_role_position", lang),
      });
      return;
    } else if (authorRolePositionHigh < memberRolePositionHigh) {
      await message.reply({
        content: t("commands:kick.response_author_low_role_position", lang),
      });
    }

    await message.guild?.kick(member.id);
    await message.reply({
      content: t("commands:kick.response", lang, {
        user: member,
        reason: reason ?? "No reason",
      }),
    });
  },
};

export default Kick;
