import { Client } from "@fluxerjs/core";

import { config } from "./config.js";
import { loadCommands, loadEvents } from "./handler/loader.js";

const client = new Client({
  defaultAllowedMentions: { repliedUser: false },
});

client.$events = new Map();
client.$commands = new Map();

await loadEvents(client);
await loadCommands(client);

await client.login(config.token);
