import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import { MessageCustomer } from "../../handler/systems/customer.js";
import {
  checkGuildGoodbye,
  checkGuildWelcome,
  getGuildPrefix,
} from "../../handler/systems/guild.js";

const Check: ICommand = {
  name: "check",
  usage: "[subcommand]",
  example: "[welcome | goodbye]",
  category: "config",
  description: "commands:check.description",
  permissions: ["Administrator"],
  run: async (client, message, args, lang) => {
    const subcommand = String(args[0]).toLocaleLowerCase();
    const guild = message.guild;
    const member = guild?.members.get(message.author.id);
    const channel = message.channel;
    if (!guild || !member || !channel) return;
    const prefix = await getGuildPrefix(guild.id);

    if (!args[0]) {
      await message.reply({
        content: t("missed_command_usge", lang, {
          prefix: prefix,
          command: "check",
        }),
      });
      return;
    }

    if (subcommand == "welcome" || subcommand == "wlc") {
      const row = await checkGuildWelcome(guild.id);
      if (!row) {
        await message.reply({
          content: t("commands:check.welcome_is_disable", lang),
        });
        return;
      } else if (row) {
        const em = MessageCustomer.EmBuilder(row.message, member, guild);
        if (em.content || em.embeds[0].description || em.embeds[0].title) {
          await channel.send({
            content: em.content ? em.content : "",
            embeds: em.embeds,
          });
        } else {
          await channel.send({
            content: String(
              MessageCustomer.replacePlaceholders(row.message, member, guild),
            ),
          });
        }
      }
    } else if (subcommand == "goodbye" || subcommand == "bye") {
      const row = await checkGuildGoodbye(guild.id);
      if (!row) {
        await message.reply({
          content: t("commands:check.goodbye_is_disable", lang),
        });
        return;
      } else if (row) {
        const em = MessageCustomer.EmBuilder(row.message, member, guild);
        if (em.content || em.embeds[0].description || em.embeds[0].title) {
          await channel.send({
            content: em.content ? em.content : "",
            embeds: em.embeds,
          });
        } else {
          await channel.send({
            content: String(
              MessageCustomer.replacePlaceholders(row.message, member, guild),
            ),
          });
        }
      }
    } else {
      await message.reply({
        content: t("missed_command_usge", lang),
      });
    }
  },
};

export default Check;
