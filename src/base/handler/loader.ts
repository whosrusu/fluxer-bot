import type { Client } from "@fluxerjs/core";
import fs from "fs";
import path from "path";
import { config } from "../config.js";
import type { ICommand, IEventLoader } from "../../interfaces/interFluxer.js";

const base = path.join(process.cwd(), "src", "base");

const line = "=".repeat(19);
const title = "=".repeat(10);

export const loadCommands = async (client: Client) => {
  const commands = client.$commands;
  console.log(`${title} Loader commands ${title}`);

  const pathFolders = path.join(base, "commands");
  const folders = fs.readdirSync(pathFolders);
  for (const folder of folders) {
    const pathFolder = path.join(pathFolders, folder);
    const files = fs
      .readdirSync(pathFolder)
      .filter((f) => f.endsWith(config.fileType));
    for (const file of files) {
      const pathCommand = path.join(pathFolder, file);
      const rawCommand = await import(pathCommand);
      const command: ICommand = rawCommand.default as ICommand;

      if (command.name) {
        commands.set(command.name, command);
        console.log(
          `✔️ => \x1b[32mPrefix Command ${command.name} is being loaded\x1b[0m`,
        );
      } else {
        console.log(
          `❌ => \x1b[31mPrefix Command ${file} missing a help.name or help.name is not in string\x1b[0m`,
        );
      }
    }
  }

  console.log(line + line);
};

export const loadEvents = async (client: Client) => {
  const events = client.$events;
  console.log(`${title}  Loader Events  ${title}=`);

  const pathFolders = path.join(base, "events");
  const folders = fs.readdirSync(pathFolders);
  for (const folder of folders) {
    const pathFolder = path.join(pathFolders, folder);
    const files = fs
      .readdirSync(pathFolder)
      .filter((f) => f.endsWith(config.fileType));

    for (const file of files) {
      const pathFile = path.join(pathFolder, file);
      const rawEvent = await import(pathFile);
      const event = rawEvent.default as IEventLoader;

      if (event.name) {
        events.set(event.name, event);
        console.log(`✔️ => \x1b[32mEvent ${event.name} is being loaded\x1b[0m`);
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
      } else {
        console.log(
          `❌ => \x1b[31mEvent ${file} missing a help.name or help.name is not in string\x1b[0m`,
        );
      }
    }
  }

  console.log(line + line);
};
