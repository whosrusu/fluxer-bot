import { EmbedBuilder } from "@fluxerjs/core";
import { t } from "../../../i18n.js";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import { getWarns } from "../../handler/systems/guild.js";
import { config } from "../../config.js";
import { pages } from "../../handler/systems/pages.js";

const Warns: ICommand = {
  name: "warns",
  usage: "[member]",
  example: "@user",
  category: "moderation",
  description: "commands:warns.description",
  permissions: ["Administrator", "BanMembers", "KickMembers", "ManageRoles"],
  run: async (client, message, args, lang) => {
    const member =
      message.mentions[0] || message.guild?.members.get(String(args[0]));
    if (!member) {
      await message.reply({
        content: t("missing_member", lang),
      });
      return;
    }

    // member get warns
    const memberWarns = await getWarns(String(message.guild?.id), member.id);
    // member doesn't have warns
    if (!memberWarns || memberWarns.length == 0) {
      await message.reply({
        content: t("commands:warns.response_member_doesnt_warns", lang),
      });
      return;
    }

    // create list for warns
    let embeds: EmbedBuilder[] = [];
    let warns = [];
    let index = 0;
    let warnsIndex = 2;
    const user = await message.guild?.fetchMember(member.id);
    for (let memberWarn of memberWarns) {
      const mod =
        message.guild?.members.get(memberWarn.moderator_id) ||
        (await message.guild?.fetchMember(memberWarn.moderator_id));
      const createdAt = `<t:${Math.floor(new Date(memberWarn.created_at).getTime() / 1000)}:R>`;
      warns.push(
        `> Moderator: ${mod?.user}\n> ID: ${memberWarn.case_id} (${createdAt})\n> Reason: ${memberWarn.reason}`,
      );
      index = index + 1;
      if (index > warnsIndex) {
        const embed = new EmbedBuilder()
          .setColor(config.embed_color)
          .setThumbnail(String(message.guild?.iconURL()))
          .setAuthor({
            name: String(user?.user.username),
            iconURL: String(member.avatarURL()),
          })
          .setTitle(
            t("commands:warns.response", lang, { user: user ?? member }),
          )
          .setDescription(warns.join("\n\n"));

        // reset and create embed
        embeds.push(embed);
        warns = [];
        index = 0;
      }
    }
    // add embeds without full index
    if (warns.length > 0) {
      const embed = new EmbedBuilder()
        .setColor(config.embed_color)
        .setThumbnail(String(message.guild?.iconURL()))
        .setAuthor({
          name: String(member.client.user?.username),
          iconURL: String(member.avatarURL()),
        })
        .setTitle(t("commands:warns.response", lang, { user: user ?? member }))
        .setDescription(warns.join("\n\n"));
      embeds.push(embed);
    }

    await pages(client, message, embeds);
  },
};

export default Warns;
