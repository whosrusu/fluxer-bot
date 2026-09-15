import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import {
  addWarn,
  removeWarn,
  resetWarns,
} from "../../handler/systems/guild.js";

const Warn: ICommand = {
  name: "warn",
  usage: "[member] [add | remove | reset] [reason]",
  example: "@member add spammer",
  category: "moderation",
  description: "commands.warn.description",
  permissions: ["Administrator", "BanMembers", "KickMembers", "ManageRoles"],
  run: async (client, message, args, lang) => {
    const member =
      message.mentions[0] || message.guild?.members.get(String(args[0]));
    const subCommand = args[1];
    const reason = args.splice(2).join(" ");

    if (!member) {
      await message.reply({
        content: t("missing_member", lang),
      });
      return;
    } else if (!subCommand) {
      await message.reply({
        content: t("commands:warn.missing_add_or_remove_or_reset", lang),
      });
      return;
    } else if (member.id == message.author.id) {
      await message.reply({
        content: t("commands:warn.response_yourself", lang),
      });
      return;
    } else if ((await message.guild?.fetchMember(member.id))?.user.bot) {
      await message.reply({
        content: t("commands:warn.response_bot", lang),
      });
      return;
    }

    if (subCommand == "add") {
      await addWarn(
        String(message.guild?.id),
        member.id,
        message.author.id,
        reason,
      );
      await message.reply({
        content: t("commands:warn.response_add", lang, {
          user: member,
          reason: reason,
        }),
      });
    } else if (subCommand == "remove" || subCommand == "rm") {
      await removeWarn(String(message.guild?.id), member.id, Number(reason));
      await message.reply({
        content: t("commands:warn.response_remove", lang, {
          user: member,
        }),
      });
    } else if (subCommand == "reset" || subCommand == "re") {
      await resetWarns(String(message.guild?.id), member.id);
      await message.reply({
        content: t("commands:warn.response_reset", lang, { user: member }),
      });
    }
  },
};

export default Warn;
