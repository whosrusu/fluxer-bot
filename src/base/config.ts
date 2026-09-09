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

interface interConfig {
  fileType: string;
  owners: string[];
  token: string;
  prefix: string;
}

export const config: interConfig = {
  fileType: ".ts",
  owners: ["1540330808391241728"],
  token: getEnv("TOKEN") || "",
  prefix: ".",
  // database
};
