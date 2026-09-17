import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import { getChannel, setGuildGoodBye } from "../../handler/systems/guild.js";

const GoodBye: ICommand = {
  name: "goodbye",
  aliases: ["bye"],
  usage: "[channel] <message>",
  example: "#channel {user}, goodbye",
  category: "config",
  description: "commands:goodbye.description",
  permissions: ["Administrator"],
  run: async (client, message, args, lang) => {
    const channel =
      getChannel(String(args[0])) ||
      message.guild?.channels.get(String(args[0]));
    const msg = args.splice(1).join(" ");
    const guild = message.guild;

    if (!channel) {
      await message.reply({
        content: t("missed_command_usge", lang),
      });
    } else if (channel && !msg) {
      await setGuildGoodBye(String(guild?.id), String(channel.id));
      await message.reply({
        content: t("commands:goodbye.response", lang, {
          channel: `<#${channel.id}>`,
        }),
      });
    } else if (channel && msg) {
      await setGuildGoodBye(String(guild?.id), String(channel.id), msg);
      await message.reply({
        content: t("commands:goodbye.response", lang, {
          channel: `<#${channel.id}>`,
        }),
      });
    }
  },
};

export default GoodBye;
