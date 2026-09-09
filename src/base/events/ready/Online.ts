import { Events } from "@fluxerjs/core";
import type { IEvent } from "../../../interfaces/interFluxer.js";

const readyOnline: IEvent = {
  name: Events.Ready,
  once: true,
  execute: async (client) => {
    console.log(`${client.user?.username} is online`);
  },
};

export default readyOnline;
