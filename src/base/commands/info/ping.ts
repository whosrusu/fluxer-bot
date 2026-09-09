import type { ICommand } from "../../../interfaces/interFluxer.js";

const Ping: ICommand = {
  name: "ping",
  category: "info",
  description: "pong",
  run: async (client, message, args) => {
    await message.reply("pong");
  },
};

export default Ping;
