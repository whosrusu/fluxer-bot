import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import { getGuildPrefix, setGuildPrefix } from "../../handler/systems/guild.js";

const SetPrefix: ICommand = {
  name: "setprefix",
  aliases: ["prefix", "setp"],
  usage: "[prefix]",
  example: "!",
  category: "config",
  description: "commands:setprefix.description",
  permissions: ["Administrator"],
  run: async (client, message, args, lang) => {
    const prefix = args[0];
    const oldPrefix = await getGuildPrefix(String(message.guild?.id));
    const prefixChars =
      "1234567890-=!@#$%^&*()_+qwertyuiopQWERTYUIOPasdfghjklASDFGHJKLzxcvbnmZXCVBNM[{}];:'\",<.>/?|\`~";
    if (!prefix) {
      return await message.reply({
        content: t("missed_command_usge", lang, {
          prefix: oldPrefix,
          command: "setprefix",
        }),
      });
    } else if (
      ![...prefix].every((prefixChar) => prefixChars.includes(prefixChar))
    ) {
      return await message.reply({
        content: t("commands:setprefix.response_crazy_prefix", lang),
      });
    } else if (prefix.length > 3) {
      return await message.reply({
        content: t("commands:setprefix.response_prefix_max_3char", lang),
      });
    }

    const newPrefix = await setGuildPrefix(String(message.guild?.id), prefix);
    await message.reply(
      `The prefix has been successfully changed to \`${newPrefix}\`. You can try ${newPrefix}help`,
    );
  },
};

export default SetPrefix;
