import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import { getChannel, getGuildPrefix } from "../../handler/systems/guild.js";
import {
  setLogChannels,
  type AuditLogType,
} from "../../handler/systems/guildLogs.js";

const Logs: ICommand = {
  name: "setlog",
  aliases: ["setlogs", "setl"],
  usage: "[channel] [member_join | member_leave | ban | kick | voice]",
  example: "#channel all",
  category: "config",
  description: "commands:setlog.description",
  permissions: ["Administrator"],
  run: async (client, message, args, lang) => {
    if (!message.guild) return;

    const prefix = await getGuildPrefix(message.guild.id);

    const rawChannel =
      getChannel(String(args[0])) ||
      message.guild?.channels.get(String(args[0]));
    const channel = message.guild?.channels.get(String(rawChannel?.id));
    if (!channel) {
      await message.reply({
        content: t("missed_command_usage", lang, {
          prefix: prefix,
          command: "setlog",
        }),
      });
      return;
    }

    const LOG_EVENTS: AuditLogType[] = [
      "member_join",
      "member_leave",
      "ban",
      "kick",
      "message_edit",
      "message_delete",
      "voice",
      "channel",
    ];

    const targers = args.splice(1) as AuditLogType[];

    const updates: Partial<Record<AuditLogType, string>> = {};
    for (const target of targers) {
      if (!LOG_EVENTS.includes(target)) {
        await message.reply({
          content: t("commands:setlog.invalid_event", lang, { event: target }),
        });
        return;
      }

      updates[target] = channel.id;
    }

    await setLogChannels(message.guild.id, updates);
    await message.reply({
      content: t("commands:setlog.response", lang, {
        channel: channel,
        events: targers.join(", "),
      }),
    });
  },
};

export default Logs;
