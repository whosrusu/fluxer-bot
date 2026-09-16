import { Events, Message, PermissionFlags } from "@fluxerjs/core";
import type { IEvent } from "../../../interfaces/interFluxer.js";
import {
  getGuildLanguage,
  getGuildPrefix,
} from "../../handler/systems/guild.js";
import { t } from "../../../i18n.js";
import { config } from "../../config.js";
import { checkCooldown } from "../../handler/systems/cooldowns.js";

const MessageCreate: IEvent = {
  name: Events.MessageCreate,
  async execute(message: Message, client) {
    if (message.author.bot || !message.guild || !message.channel) return;
    const content = message.content;
    const guild = message.guild;
    let prefix = await getGuildPrefix(String(guild.id));

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

    const lang = await getGuildLanguage(String(guild.id));

    if (!command) return;
    if (command.dev) {
      if (!config.owners.includes(message.author.id)) return; // ignore if author isn't owner
    }
    // system for permissions member in guild.
    if (!command.permissions || command.permissions.length == 0) {
    } else if (command.permissions?.length > 0) {
      let memberHasPermission = false;
      for (const permission of command.permissions) {
        const $permission = permission as keyof typeof PermissionFlags;
        const perm = PermissionFlags[$permission];
        const member =
          message.guild.members.get(message.author.id) ||
          (await message.guild.fetchMember(message.author.id));
        if (!member) return;
        if (member.permissions.has(perm)) {
          memberHasPermission = true;
          break;
        }
      }

      if (!memberHasPermission) {
        await message.reply({
          content: t("not_permission", lang, {
            user: message.author,
            permissions: command.permissions.join(", "),
          }),
        });
        return;
      }
    }

    // cooldown system
    const seconds = command.cooldown ?? 3;
    const result = checkCooldown({
      command: command.name,
      userId: message.author.id,
      guildId: message.guild?.id,
      channelId: message.channel.id,
      seconds,
      bucket: "user",
    });

    if (!result.ok) {
      const s = (result.remainingMs / 1000).toFixed(1);
      await message.reply({
        content: t("cooldown", lang, { seconds: s, command: command.name }),
      });
      return;
    }

    await command.run(client, message, args, lang);
  },
};

export default MessageCreate;
