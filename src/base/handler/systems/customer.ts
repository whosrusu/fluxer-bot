import { Message, EmbedBuilder, GuildMember, Guild } from "@fluxerjs/core";

class MessageCustomer {
  static replacePlaceholders(content: string, user: GuildMember, guild: Guild) {
    const regexGuildName = RegExp(/\[guild\]/g);
    const regexGuildIconURL = RegExp(/\[guild\.icon\]/g);
    const regexUserDisplayName = RegExp(/\[user\.name\]/g);
    const regexUserAvatar = RegExp(/\[user\.avatar\]/g);
    const regexUserCreated = RegExp(/\[user\.created_at\]/g);
    let msgBuilder;
    msgBuilder = content
      .replace(/\[user\]/g, String(user))
      .replace(regexUserDisplayName, String(user?.displayName))
      .replace(regexUserAvatar, String(user?.displayAvatarURL({ size: 2048 })))
      .replace(
        regexUserCreated,
        String(
          `<t:${Math.floor(
            user?.user.createdAt.getTime()
              ? user?.user.createdAt.getTime()
              : 1000 / 1000,
          )}:R>`,
        ),
      )
      .replace(regexGuildName, String(guild?.name))
      .replace(regexGuildIconURL, String(guild?.iconURL({ size: 2048 })));
    return msgBuilder;
  }

  static parseSections(template: string) {
    return template
      .replace("(embed)", "")
      .split("++")
      .map((section) => section.slice(1, -1).trim());
  }

  static EmBuilder(rawTemplate: string, user: GuildMember, guild: Guild) {
    const template = this.replacePlaceholders(rawTemplate, user, guild);
    const sections = this.parseSections(template);

    let embedData: any = {};
    let fields = [];
    let content = null;

    for (let section of sections) {
      if (section.startsWith("title:")) {
        embedData.title = section.slice(6).trim();
      } else if (section.startsWith("description:")) {
        embedData.description = section.slice(12).trim();
      } else if (section.startsWith("color:")) {
        embedData.color = parseInt(section.slice(6).replace("#", ""), 16);
      } else if (section.startsWith("thumbnail:")) {
        embedData.thumbnail = { url: section.slice(10).trim() };
      } else if (section.startsWith("image:")) {
        embedData.image = { url: section.slice(6).trim() };
      } else if (section.startsWith("author:")) {
        let [name, iconURL] = section.slice(7).split(" && ");
        embedData.author = {
          name: name,
          icon_url: iconURL || null,
          url: null,
        };
      } else if (section.startsWith("footer:")) {
        let [text, iconURL] = section.slice(7).split(" && ");
        embedData.footer = {
          text: text,
          icon_url: iconURL || null,
        };
      }
    }

    const embed = embedData;
    return { content: content, embeds: [embed] };
  }
}

export { MessageCustomer };
