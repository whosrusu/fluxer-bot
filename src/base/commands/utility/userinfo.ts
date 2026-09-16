import { EmbedBuilder } from "@fluxerjs/core";
import type { ICommand } from "../../../interfaces/interFluxer.js";
import { config } from "../../config.js";
import { t } from "../../../i18n.js";

const Userinfo: ICommand = {
  name: "userinfo",
  aliases: ["user", "about", "ui"],
  usage: "<member>",
  example: "@user",
  category: "utility",
  description: "commands:userinfo.description",
  run: async (client, message, args, lang) => {
    const member =
      message.mentions[0] ||
      message.guild?.members.get(String(args[0])) ||
      message.author;

    const user =
      client.users.get(member.id) || (await client.users.fetch(member.id));
    const guildMember = await message.guild?.fetchMember(member.id);

    const userCreated = Math.floor((user?.createdAt.getTime() ?? 0) / 1000);
    const userAvatarURL = String(user?.avatarURL());

    const memberJoined = Math.floor(
      (guildMember?.joinedAt.getTime() ?? 0) / 1000,
    );
    const memberAvatarURL = String(member.displayAvatarURL());
    const memberRoles = guildMember?.roles.cache.size ?? "-";
    const memberBio = guildMember?.bio ?? "-";

    const embed = new EmbedBuilder()
      .setColor(config.embed_color)
      .setThumbnail(memberAvatarURL)
      .setAuthor({
        name: message.author.username,
        iconURL: userAvatarURL,
      })
      .setTitle(
        t("commands:userinfo.title", lang, {
          user: guildMember?.user.username,
        }),
      )
      .setDescription(
        `>>> ${t("commands:userinfo.created", lang, { user_created_at: userCreated })}
${t("commands:userinfo.member_joined_at", lang, { member_joined_at: memberJoined })}
${t("commands:userinfo.roles", lang, { roles: memberRoles })}
${t("commands:userinfo.bio", lang, { bio_string: memberBio })}`,
      )
      .setFooter({ text: `ID: ${member.id}` });

    await message.reply({
      embeds: [embed],
    });
  },
};

export default Userinfo;
