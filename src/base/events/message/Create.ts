import { Events, Message } from "@fluxerjs/core";
import { config } from "../../config.js";
import type { IEvent } from "../../../interfaces/interFluxer.js";

const MessageCreate: IEvent = {
  name: Events.MessageCreate,
  async execute(message: Message, client) {
    if (message.author.bot || !message.guild) return;
    const content = message.content;
    let prefix = config.prefix;

    // get prefix
    const metion = new RegExp(`^<@!?${client.user?.id}>( |)$`);
    if (content.match(metion)) {
      await message.reply(`prefix: ${prefix}`);
      return;
    }

    if (!content.startsWith(prefix)) return;

    const [cmd, ...args]: any[] = content.slice(prefix.length).split(" ");
    const command =
      client.$commands.get(cmd.toLocaleLowerCase()) ||
      [...client.$commands.values()].find(
        (c) => c.aliases && c.aliases.includes(cmd.toLocaleLowerCase()),
      );

    if (!command) return;
    if (command.dev) {
      if (!config.owners.includes(message.author.id)) return; // ignore if author isn't owner
    }

    await command.run(client, message, args);
  },
};

export default MessageCreate;
