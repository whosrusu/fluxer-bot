import { Client } from "@fluxerjs/core";

import { config } from "./config.js";
import { loadCommands, loadEvents } from "./handler/loader.js";
import { initSchema } from "./handler/schema.js";

const client = new Client({
  defaultAllowedMentions: { repliedUser: false },
});

client.$events = new Map();
client.$commands = new Map();

async function start(client: Client) {
  await initSchema(); // create tables for database (posgresql).
  await loadEvents(client); // load events from ./events/
  await loadCommands(client); // load commands from ./commands/

  await client.login(config.token); // client login
}

await start(client);
