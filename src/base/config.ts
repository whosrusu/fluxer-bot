import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

export const getEnv = (name: string) => {
  const result = process.env[name];
  if (!result) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return result;
};

export const config = {
  fileType: ".ts", // when u use pnpm build or npm build change in ".js".
  owners: ["1540330808391241728"],
  token: getEnv("TOKEN") || "",
  prefix: ".",
  defaultLocale: "en",
  embed_color: 0xffffff,

  // emoji config
  emoji: {
    next: "➡️",
    last: "⬅️",
  },

  // database
  database: {
    host: getEnv("DB_HOST"),
    port: Number(getEnv("DB_PORT")),
    user: getEnv("DB_USER"),
    password: getEnv("DB_PASSWORD"),
    name: getEnv("DB_NAME"),
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  },
};
