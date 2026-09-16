import type { Client as BaseClient, Message } from "@fluxerjs/core";

export interface ExtendedClient extends BaseClient {
  $commands: Map<string, ICommand>;
  $events: Map<string, IEvent>;
}

export interface ICommand {
  dev?: boolean;
  name: string;
  aliases?: string[];
  usage?: string;
  example?: string;
  category: string;
  description: string;
  cooldown?: number;
  permissions?: string[];
  run: (
    client: ExtendedClient,
    message: Message,
    args: string[],
    lang: string,
  ) => void | Promise<void>;
}

export interface IEvent<T = any> {
  name: string;
  once?: boolean;
  execute: (arg: T, client: ExtendedClient) => void | Promise<void>;
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
