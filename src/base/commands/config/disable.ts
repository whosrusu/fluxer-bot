import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import {
  checkGuildGoodbye,
  checkGuildWelcome,
  getGuildPrefix,
  removeGuildGoodbye,
  removeGuildWelcome,
} from "../../handler/systems/guild.js";

const Disable: ICommand = {
  name: "disable",
  aliases: ["off"],
  usage: "[welcome | goodbye]",
  example: "welcome",
  category: "config",
  description: "commands:disable.description",
  permissions: ["Administrator"],
  run: async (client, message, args, lang) => {
    const event = String(args[0]).toLocaleLowerCase();
    const guild = message.guild;
    if (!guild) return;
    const prefix = await getGuildPrefix(guild.id);

    if (event == "welcome" || event == "wlc") {
      const row = await checkGuildWelcome(guild.id);
      if (!row) {
        await message.reply({
          content: t("commands:disable.welcome_is_disable", lang),
        });
      } else if (row) {
        await removeGuildWelcome(guild.id);
        await message.reply({
          content: t("commands:disable.welcome_set_off", lang),
        });
      }
    } else if (event == "goodbye" || event == "bye") {
      const row = await checkGuildGoodbye(guild.id);
      if (!row) {
        await message.reply({
          content: t("commands:disable.goodbye_is_disable", lang),
        });
      } else if (row) {
        await removeGuildGoodbye(guild.id);
        await message.reply({
          content: t("commands:disable.goodbye_set_off", lang),
        });
      }
    } else {
      message.reply({
        content: t("missed_command_usge", lang, {
          prefix: prefix,
          command: "disable",
        }),
      });
    }
  },
};

export default Disable;
