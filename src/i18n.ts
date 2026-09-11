import i18next, { createInstance } from "i18next";
import Backend from "i18next-fs-backend";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const loadPath = path.join(__dirname, "locales");

await i18next.use(Backend).init(
  {
    fallbackLng: "en",
    preload: ["en", "it"],
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: loadPath + "/{{lng}}/{{ns}}.json",
    },
    ns: ["common", "commands"],
    defaultNS: "common",
    debug: true,
  },
  (err, t) => {
    if (err) return console.log(err);
  },
);

export function t(
  key: string,
  lng: string,
  options?: Record<string, unknown>,
): string {
  return i18next.t(key, { lng, ...options });
}
