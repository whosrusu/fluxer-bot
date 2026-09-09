import type { Client, Message } from "@fluxerjs/core";

export interface ICommand {
  dev?: boolean;
  name: string;
  aliases?: string[];
  usage?: string;
  category: string;
  description: string;
  cooldown?: string;
  permissions?: string[];
  run: (
    client: Client,
    message: Message,
    args: string[],
  ) => void | Promise<void>;
}

export interface IEvent<T = any> {
  name: string;
  once?: boolean;
  execute: (arg: T, client: Client) => void | Promise<void>;
}

export interface IEventLoader {
  name: string;
  once: boolean;
  execute: (...args: any[]) => void;
}

declare module "@fluxerjs/core" {
  interface Client {
    $commands: Map<string, ICommand>;
    $events: Map<string, IEvent>;
  }
}
