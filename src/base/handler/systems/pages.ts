import {
  Client,
  EmbedBuilder,
  Events,
  Message,
  MessageReaction,
} from "@fluxerjs/core";
import { config } from "../../config.js";

export const pages = async (
  client: Client,
  message: Message,
  embeds: EmbedBuilder[],
) => {
  let page: number = 0;
  const embedIndex = embeds.length - 1;
  let embed = embeds[page] as EmbedBuilder;

  if (embedIndex == 0) {
    await message.reply({
      embeds: [embed],
    });
  } else if (embedIndex > 0) {
    // send first page
    const msg = await message.reply({
      embeds: [embed],
    });

    await msg.react(config.emoji.last);
    await msg.react(config.emoji.next);

    async function emojiInteraction(payload: any) {
      if (payload.message.id != msg.id) return;
      if (message.author.id != payload.user.id) return;
      const name = payload.emoji.name;

      if (name == config.emoji.next) {
        if (page == embedIndex) {
          page = 0;
        } else {
          page = page + 1;
        }
      } else if (name == config.emoji.last) {
        if (page == 0) {
          page = embedIndex;
        } else {
          page = page - 1;
        }
      }

      await msg.removeReaction(payload.emoji, message.author.id);

      await msg.edit({
        embeds: [embeds[page] as EmbedBuilder],
      });
    }

    // create event for reaction add
    client.on(Events.MessageReactionAdd, emojiInteraction);

    // remove event (timeout)
    setTimeout(async () => {
      await msg.edit({
        content: "timeout",
      });
      client.removeListener(Events.MessageReactionAdd, emojiInteraction);
    }, 30_000);
  }
};
