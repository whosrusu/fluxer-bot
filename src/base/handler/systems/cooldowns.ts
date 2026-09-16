type Bucket = "user" | "guild" | "channel";

const cooldowns = new Map<string, number>();

function key(bucket: Bucket, id: string, command: string) {
  return `${bucket}:${id}:${command}`;
}

export function checkCooldown(opts: {
  command: string;
  userId: string;
  guildId?: string;
  channelId?: string;
  seconds: number;
  bucket?: Bucket;
}): { ok: true } | { ok: false; remainingMs: number } {
  const bucket = opts.bucket ?? "user";
  const id =
    bucket === "guild"
      ? (opts.guildId ?? opts.userId)
      : bucket === "channel"
        ? (opts.channelId ?? opts.userId)
        : opts.userId;

  const k = key(bucket, id, opts.command);
  const now = Date.now();
  const expires = cooldowns.get(k);

  if (expires && now < expires) {
    return { ok: false, remainingMs: expires - now };
  }

  const until = now + opts.seconds * 1000;
  cooldowns.set(k, until);
  setTimeout(() => cooldowns.delete(k), opts.seconds * 1000);
  return { ok: true };
}
