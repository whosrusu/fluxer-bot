import type { ICommand } from "../../../interfaces/interFluxer.js";
import {
  getGuildLanguage,
  getGuildPrefix,
  setGuildLanguage,
} from "../../handler/systems/guild.js";
import { t } from "../../../i18n.js";

const Language: ICommand = {
  name: "language",
  aliases: ["lang", "l"],
  usage: "<lang>",
  example: "it",
  category: "config",
  description: "commands:language.description",
  run: async (client, message, args, lang) => {
    const guild = message.guild;
    const getLang = await getGuildLanguage(String(guild?.id));
    const newLang = args[0];
    const prefix = await getGuildPrefix(String(guild?.id));

    if (!newLang) {
      await message.reply({
        content: t("missed_command_usge", lang, {
          prefix: prefix,
          command: "language",
        }),
      });
      return;
    }

    const listLanguage = ["en", "it"];

    if (!listLanguage.includes(newLang)) {
      await message.reply({
        content: t("commands:language.unknown", lang, {
          langs: listLanguage.join(", "),
        }),
      });
      return;
    } else if (newLang == getLang) {
      await message.reply({
        content: t("commands:language.same_lang", lang),
      });
      return;
    }

    await setGuildLanguage(String(guild?.id), newLang);

    await message.reply({
      content: t("commands:language.changed", newLang, { lang: newLang }),
    });
  },
};

export default Language;
