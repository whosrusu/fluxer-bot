import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import {
  getChannel,
  getGuildPrefix,
  setGuildWelcome,
} from "../../handler/systems/guild.js";

const Welcome: ICommand = {
  name: "welcome",
  aliases: ["wlc"],
  usage: "[channel] <message>",
  example: "#channel {user}, welcome",
  category: "config",
  description: "commands:welcome.description",
  permissions: ["Administrator"],
  run: async (client, message, args, lang) => {
    const channel =
      getChannel(String(args[0])) ||
      message.guild?.channels.get(String(args[0]));
    const msg = args.splice(1).join(" ");
    const guild = message.guild;
    if (!guild) return;
    const prefix = await getGuildPrefix(guild.id);

    if (!channel) {
      await message.reply({
        content: t("missed_command_usge", lang, {
          prefix: prefix,
          command: "welcome",
        }),
      });
    } else if (channel && !msg) {
      await setGuildWelcome(String(guild?.id), String(channel.id));
      await message.reply({
        content: t("commands:welcome.response", lang, {
          channel: `<#${channel.id}>`,
        }),
      });
    } else if (channel && msg) {
      await setGuildWelcome(String(guild?.id), String(channel.id), msg);
      await message.reply({
        content: t("commands:welcome.response", lang, {
          channel: `<#${channel.id}>`,
        }),
      });
    }
  },
};

export default Welcome;
