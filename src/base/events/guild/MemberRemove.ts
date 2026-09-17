import { Events, GuildMember } from "@fluxerjs/core";
import type { IEvent } from "../../../interfaces/interFluxer.js";
import { checkGuildGoodbye } from "../../handler/systems/guild.js";
import { MessageCustomer } from "../../handler/systems/customer.js";

const MemberRemove: IEvent = {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember, client) {
    if (!member.guild) return;
    const guild = member.guild;

    const row = await checkGuildGoodbye(guild.id);
    if (!row) return;

    const channel = guild.channels.get(String(row.channel_id));
    if (!channel) return;

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
    } else {
      return;
    }
  },
};

export default MemberRemove;
