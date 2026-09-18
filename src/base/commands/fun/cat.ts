import { EmbedBuilder } from "@fluxerjs/core";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import { config } from "../../config.js";
import { t } from "../../../i18n.js";

const Cat: ICommand = {
  name: "cat",
  aliases: ["kitty"],
  category: "fun",
  description: "commands:cat.description",
  run: async (client, message, args, lang) => {
    const api = "https://nekos.life/api/v2/img/meow";

    const req = await fetch(api, {
      method: "GET",
    });
    const res = await req.json();
    const imageURL = res["url"];

    const embed = new EmbedBuilder()
      .setColor(config.embed_color)
      .setTitle(t("commands:cat.title", lang))
      .setImage(imageURL);

    await message.reply({
      embeds: [embed],
    });
  },
};

export default Cat;
