import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import { memberHighRole } from "../../handler/systems/guild.js";

const Mute: ICommand = {
  name: "mute",
  aliases: ["timeout", "m"],
  usage: "[user] [time]",
  example: "@user 1h",
  category: "moderation",
  permissions: ["MuteMembers"],
  description: "commands:mute.description",
  run: async (client, message, args, lang) => {
    if (!client.user) return;
    const user =
      message.mentions[0] || message.guild?.members.get(String(args[0]));
    const time = args[1];
    const reason =
      args.slice(2).join(" ") ?? t("commands:mute.response_not_reason", lang);
    const allowChars = "1234567890smhd";
    if (!user) {
      await message.reply({
        content: t("missing_member", lang),
      });
      return;
    } else if (!time) {
      await message.reply({
        content: t("missing_time", lang),
      });
      return;
    } else if (![...time].every((c) => allowChars.includes(c))) {
      await message.reply({
        content: t("commands:mute.crazy_time", lang),
      });
      return;
    } else if (user.id == message.author.id) {
      await message.reply({
        content: t("commands:mute.response_selfmute", lang),
      });
      return;
    }

    const member = await message.guild?.fetchMember(user.id);
    const author = await message.guild?.fetchMember(message.author.id);
    const bot = await message.guild?.fetchMember(client.user.id);
    if (!author || !member || !bot) return;

    const authorRolePositionHigh = memberHighRole(author);
    const memberRolePositionHigh = memberHighRole(member);
    const botRolePossitionHigh = memberHighRole(bot);

    if (
      !authorRolePositionHigh ||
      !memberRolePositionHigh ||
      !botRolePossitionHigh
    )
      return;

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

    if (!member) {
      await message.reply({
        content: t("commands:mute.response_member_unknow", lang),
      });
      return;
    }

    const timerToMs = ($time: string) => {
      const chars = ["s", "m", "h", "d"];
      const strTime = [...$time];
      const number = strTime[0];
      const strChar = strTime[1];
      if (typeof number === "number") {
        throw new Error("Passed value is not a number");
      } else if (!strChar) {
        throw new Error("invalid strChar");
      } else if (!chars.includes(strChar)) {
        throw new Error(`${strChar} is invalid, try ${chars.join(", ")}`);
      }
      let ms = 0;
      if (strChar == "s") {
        ms = Number(number) * 1000;
      } else if (strChar == "m") {
        ms = Number(number) * 60000;
      } else if (strChar == "h") {
        ms = Number(number) * 3600000;
      } else if (strChar == "d") {
        ms = Number(number) * 86400000;
      }

      return ms;
    };

    const duration = timerToMs(String(time));
    await member.timeout(duration, reason);
    await message.reply({
      content: t("commands:mute.response", lang, {
        user: member?.user,
        time: time,
      }),
    });
  },
};

export default Mute;
