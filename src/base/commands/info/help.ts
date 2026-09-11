import { EmbedBuilder } from "@fluxerjs/core";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import { config } from "../../config.js";
import { t } from "../../../i18n.js";
import { getGuildPrefix } from "../../handler/systems/guild.js";

const Help: ICommand = {
  name: "help",
  aliases: ["h"],
  usage: "<command>",
  example: "help ping",
  category: "info",
  description: "commands:help.description",
  run: async (client, message, args, lang) => {
    const member = message.author;
    const guild = message?.guild;
    const prefix = await getGuildPrefix(String(guild?.id));

    const rawCommand = args[0];
    if (rawCommand) {
      const command = client.$commands.get(rawCommand);
      if (!command) {
        await message.reply("invalid command");
        return;
      }

      let getPermissions = "";
      let getAliases = "";
      if (!command.aliases || command.aliases.length == 0) {
        getAliases = t("commands:help.response_no_aliases", lang);
      } else if (command.aliases) {
        getAliases = command.aliases.join(", ");
      } else {
        getAliases = "error aliases";
      }

      if (!command.permissions || command.permissions.length == 0) {
        getPermissions = t("commands:help.response_no_permissions", lang);
      } else if (command.permissions) {
        getPermissions = command.permissions.join(", ");
      } else {
        getPermissions = "erro permissions";
      }

      const embedCommandInfo = new EmbedBuilder()
        .setColor(config.embed_color)
        .setThumbnail(String(guild?.iconURL()))
        .setAuthor({
          name: member.username,
          iconURL: String(member.avatarURL()),
        })
        .setTitle(`${command.name} (${command.category})`)
        .setDescription(
          `>>> ${t("commands:help.response_aliases", lang)}: ${getAliases}
${t("commands:help.response_usage", lang)}: ${command.usage ? command.usage : t("commands:help.response_no_usage", lang)}
${t("commands:help.response_example", lang)}: ${prefix}${command.example ? command.name + " " + command.example : command.name}
${t("commands:help.response_permissions", lang)}: ${getPermissions}
${t("commands:help.response_description", lang)}: ${t(command.description, lang)}`,
        );
      await message.reply({ embeds: [embedCommandInfo] });
      return;
    }

    const commands: { [category: string]: string[] } = {};
    client.$commands.forEach((value, key) => {
      if (value.category != "developer") {
        if (!commands[value.category]) {
          commands[value.category] = [];
        }
        commands[value.category]?.push(key);
      }
    });

    type EmbedField = { name: string; value: string; inline?: boolean };
    const fields: EmbedField[] = [];

    for (const category in commands) {
      fields.push({
        name: category,
        value: `>>> ${commands[category]?.join(", ") ?? ""}`,
        inline: false,
      });
    }

    const embedHome = new EmbedBuilder()
      .setColor(config.embed_color)
      .setAuthor({ name: member.username, iconURL: String(member.avatarURL()) })
      .setThumbnail(String(guild?.iconURL()))
      .setTitle(t("commands:help.title", lang))
      .addFields(...fields);

    await message.reply({ embeds: [embedHome] });
  },
};

export default Help;
