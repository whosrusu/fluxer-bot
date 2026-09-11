import type { ICommand } from "../../../interfaces/interFluxer.js";
import { loadCommands } from "../../handler/loader.js";

const Reload: ICommand = {
  name: "reload",
  dev: true,
  aliases: ["re"],
  category: "developer",
  description: "reload commands.",
  run: async (client, message, args, lang) => {
    try {
      const commands = client.$commands;
      commands.clear();
      loadCommands(client);
      await message.reply("reload commands done.");
    } catch (err) {
      console.log(err);
      await message.reply("erro check your console.");
    }
  },
};

export default Reload;
