import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";

const Ping: ICommand = {
  name: "ping",
  category: "info",
  description: "commands:ping.description",
  run: async (client, message, args, lang) => {
    await message.reply({
      content: t("commands:ping.response", lang),
    });
  },
};

export default Ping;
