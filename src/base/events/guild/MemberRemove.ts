import { Events, GuildMember } from "@fluxerjs/core";
import type { IEvent } from "../../../interfaces/interFluxer.js";
import { checkGuildGoodbye } from "../../handler/systems/guild.js";
import { MessageCustomer } from "../../handler/systems/customer.js";
import {
  getLogConfig,
  logEmbedBuilder,
} from "../../handler/systems/guildLogs.js";

const MemberRemove: IEvent = {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember, client) {
    if (!member.guild) return;
    const guild = member.guild;

    const row = await checkGuildGoodbye(guild.id);
    const rowLog = await getLogConfig(guild.id);

    // logs member leave
    if (rowLog) {
      const channel = guild.channels.get(String(rowLog.member_leave));
      if (channel && channel.isTextBased()) {
        const embedLog = logEmbedBuilder(
          guild,
          "Member Leave",
          `- Member: ${member.user.username} (ID: ${member.id})
- Joinend: **${member.joinedAt.getDay} days**
- Created: **${member.user.createdAt.getDay} days**`,
        );
        await channel.send({
          embeds: [embedLog],
        });
      }
    }
    // goodbye system
    if (row) {
      const channel = guild.channels.get(String(row.channel_id));
      if (channel && channel.isTextBased()) {
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
    }
  },
};

export default MemberRemove;
