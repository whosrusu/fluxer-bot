import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import {
  getLogConfig,
  remLogChannels,
  type AuditLogType,
} from "../../handler/systems/guildLogs.js";

const Remlog: ICommand = {
  name: "remlog",
  aliases: ["removelog"],
  category: "config",
  description: "commands:remlog.description",
  permissions: ["Administrator"],
  run: async (client, message, args, lang) => {
    if (!message.guild) return;

    const targets = args as AuditLogType[];

    const cfg = await getLogConfig(message.guild.id);

    const LOG_EVENTS: AuditLogType[] = [
      "member_join",
      "member_leave",
      "ban",
      "kick",
    ];

    for (const target of targets) {
      if (!LOG_EVENTS.includes(target)) {
        await message.reply({
          content: t("commands:remlog.invalid_event", lang, { event: target }),
        });
        return;
      }
      if (!cfg[target]) {
        await message.reply({
          content: t("commands:remlog.this_event_is_off", lang),
        });
        return;
      }
      delete cfg[target];
    }

    await remLogChannels(message.guild.id, cfg);

    await message.reply({
      content: t("commands:remlog.response", lang, { events: targets }),
    });
  },
};

export default Remlog;
