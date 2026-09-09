# fluxer-bot

A modular, TypeScript-based bot for the [Fluxer](https://fluxer.app) platform. Built with [Fluxer.js](https://www.npmjs.com/package/@fluxerjs/core), it features a typed event handler system and a dynamic command loader, backed by PostgreSQL for persistent storage.

## 🚧 Work in Progress

> **This project is under active development.** APIs, project structure, and features may change frequently and without notice. Things will break between commits. It is **not** ready for production use.

<!-- badges: start -->
<!-- badges: end -->

## ⚙️ Tech Stack

| Component       | Technology                                                        |
| --------------- | ----------------------------------------------------------------- |
| Language        | TypeScript 7                                                      |
| Runtime         | Node.js 22.13+                                                    |
| Package Manager | pnpm                                                              |
| Platform        | Fluxer                                                            |
| SDK / Library   | [@fluxerjs/core](https://www.npmjs.com/package/@fluxerjs/core) v3 |
| Database        | PostgreSQL                                                        |

## ✨ Features

- Typed event handler system (`IEvent` interface, dynamically loaded from `src/base/events/`)
- Dynamic command handler with aliases, cooldowns, and permission support (`ICommand` interface, loaded from `src/base/commands/`)
- Module augmentation on the Fluxer.js `Client` for type-safe `$events` and `$commands` maps
- Automatic gateway reconnection and resume handled by `@fluxerjs/core`
- Command categories and dev-only command flags
- _More features planned as the project matures_

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) **26.8.1** or later
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- A Fluxer bot token (obtain one from the Fluxer Applications)

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/whosrusu/fluxer-bot.git
cd fluxer-bot

# Install dependencies
pnpm install

# If prompted, approve build scripts
pnpm approve-builds
```

## 🔑 Environment Variables

```env
FLUXER_BOT_TOKEN=your-bot-token-here
PREFIX=.

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=fluxer-bot
```

| Variable      | Description                             |
| ------------- | --------------------------------------- |
| `TOKEN`       | Authentication token for the Fluxer bot |
| `PREFIX`      | Command prefix (default: `.`)           |
| `DB_HOST`     | PostgreSQL host                         |
| `DB_PORT`     | PostgreSQL port                         |
| `DB_USER`     | PostgreSQL username                     |
| `DB_PASSWORD` | PostgreSQL password                     |
| `DB_NAME`     | PostgreSQL database name                |

## 🛠️ Scripts

| Command          | Description                             |
| ---------------- | --------------------------------------- |
| `pnpm dev`       | Start the bot in development mode (tsx) |
| `pnpm build`     | Compile TypeScript to JavaScript (tsc)  |
| `pnpm start`     | Run the compiled production build       |
| `pnpm typecheck` | Type-check without emitting output      |

## 📂 Project Structure

```
src/
├── base/
│   ├── index.ts            # Entry point — creates Client, loads handlers, logs in
│   ├── config.ts           # Environment config and helper utilities
│   ├── commands/
│   │   └── info/           # Info-category commands
│   ├── events/
│   │   ├── message/        # MessageCreate event handler(s)
│   │   └── ready/          # Ready event handler(s)
│   └── handler/
│       └── loader.ts       # Dynamic event and command loader
└── interfaces/
    └── interFluxer.ts      # ICommand, IEvent, IEventLoader interfaces + Client augmentation
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

Keep in mind that this project is still in early development — the structure, conventions, and APIs are subject to change. Please check existing code style before contributing and be prepared for refactors.

## 📄 License

This project is licensed under the [MIT License](LICENSE) — to be confirmed.
