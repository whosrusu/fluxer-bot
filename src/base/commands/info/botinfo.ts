import { EmbedBuilder } from "@fluxerjs/core";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import { config } from "../../config.js";
import { t } from "../../../i18n.js";

const Botinfo: ICommand = {
  name: "botinfo",
  aliases: ["bi", "bot"],
  category: "info",
  description: "commands:botinfo.description",
  run: async (client, message, args, lang) => {
    const guildsCount = client.guilds.size;
    const usersCount = client.users.size;
    const developer = `<@${config.owners[0]}>`;
    const commandsCount = client.$commands.size;

    const embed = new EmbedBuilder()
      .setColor(config.embed_color)
      .setTitle(t("commands:botinfo.title", lang))
      .setThumbnail(String(client.user?.avatarURL()))
      .setAuthor({
        name: String(client.user?.username),
        iconURL: String(client.user?.avatarURL()),
      })
      .setDescription(`>>> ${t("commands:botinfo.status_guilds", lang, { guilds: guildsCount })}
${t("commands:botinfo.status_users", lang, { users: usersCount })}
${t("commands:botinfo.developer", lang, { developer: developer })}
${t("commands:botinfo.status_commands", lang, { commands: commandsCount })}`);

    await message.reply({
      embeds: [embed],
    });
  },
};

export default Botinfo;
