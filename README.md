# Bun-Turbo-Nextjs-BetterAuth-Prisma

A **production-ready starter template** for building modern, full-stack web applications with authentication baked in — powered by **Bun**, **Turborepo**, **Next.js**, **Better Auth**, **Prisma**, and **shadcn/ui**.

---

## ✨ Features

- ⚡ **Bun** — Ultra-fast JavaScript runtime and package manager
- 🏗️ **Turborepo** — High-performance monorepo build system with smart caching
- ⚛️ **Next.js 16** — React framework with App Router, Server Components, and Turbopack
- 🔐 **Better Auth** — Type-safe authentication with email/password, Google, and GitHub OAuth
- 🗃️ **Prisma ORM** — Type-safe database access with PostgreSQL
- 🎨 **shadcn/ui** — Beautiful, accessible UI components built on Radix UI
- 🌙 **Dark Mode** — Built-in theme switching with `next-themes`

---

## 📁 Project Structure

```
bun-turbo-nextjs-betterauth-prisma/
├── apps/
│   └── ion/                  # Next.js application
│       ├── app/              # App Router pages & layouts
│       ├── components/       # UI components (login, signup, theme toggle, etc.)
│       └── lib/              # Utility functions
├── packages/
│   ├── ion-auth/             # Authentication package (Better Auth config + client)
│   ├── ion-db/               # Database package (Prisma schema + client)
│   ├── ion-config-eslint/    # Shared ESLint configuration
│   └── ion-config-typescript/# Shared TypeScript configuration
├── turbo.json                # Turborepo pipeline configuration
├── docker-compose.yml        # PostgreSQL container setup
└── package.json              # Root workspace configuration
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.2+)
- [Docker](https://www.docker.com/) (for PostgreSQL)

### 1. Clone the repository

```bash
git clone https://github.com/Tejas-pr/bun-turbo-nextjs-betterauth-prisma.git
cd bun-turbo-nextjs-betterauth-prisma
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Then fill in your `.env` file with the required values:

```env
# Database
DATABASE_URL="postgresql://ion:ion@localhost:5432/ion"

# Authentication
BETTER_AUTH_SECRET=your-random-secret-key
BETTER_AUTH_URL=http://localhost:3000

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Trusted Origins (optional, for CORS in production)
MAINORIGINS2=
MAINORIGINS3=
```

#### Environment Variables Reference

| Variable               | Required    | Description                                                                                                    |
| ---------------------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`         | ✅ Yes      | PostgreSQL connection string. Default works with the Docker setup below.                                       |
| `BETTER_AUTH_SECRET`   | ✅ Yes      | A random secret key used to sign sessions and tokens. Generate one with `openssl rand -base64 32`.             |
| `BETTER_AUTH_URL`      | ✅ Yes      | The base URL of your application (e.g., `http://localhost:3000`).                                              |
| `GITHUB_CLIENT_ID`     | ⚙️ Optional | GitHub OAuth App Client ID. Get it from [GitHub Developer Settings](https://github.com/settings/developers).   |
| `GITHUB_CLIENT_SECRET` | ⚙️ Optional | GitHub OAuth App Client Secret.                                                                                |
| `GOOGLE_CLIENT_ID`     | ⚙️ Optional | Google OAuth Client ID. Get it from [Google Cloud Console](https://console.cloud.google.com/apis/credentials). |
| `GOOGLE_CLIENT_SECRET` | ⚙️ Optional | Google OAuth Client Secret.                                                                                    |
| `MAINORIGINS2`         | ⚙️ Optional | Additional trusted origin URL for CORS (e.g., a staging domain).                                               |
| `MAINORIGINS3`         | ⚙️ Optional | Additional trusted origin URL for CORS (e.g., a production domain).                                            |

> **Note:** GitHub and Google OAuth are optional. If you don't provide their credentials, the social login buttons will simply not work, but email/password authentication will still function.

### 4. Start the database

For local development, start a PostgreSQL container:

```bash
docker run -d \
  -p 5432:5432 \
  --name ion \
  -e POSTGRES_DB=ion \
  -e POSTGRES_USER=ion \
  -e POSTGRES_PASSWORD=ion \
  postgres
```

### 5. Set up the database schema

```bash
bun run db:push
```

### 6. Start the development server

```bash
bun run dev
```

Your app will be running at **[http://localhost:3000](http://localhost:3000)** 🎉

---

## 🐳 Docker Compose (One Command Setup)

Want to skip all the manual steps? Use Docker Compose to start **everything** — the PostgreSQL database and the Next.js app — with a single command.

### 1. Make sure your `.env` is configured

```bash
cp .env.example .env
# Fill in your BETTER_AUTH_SECRET and any OAuth credentials
```

### 2. Start all services

```bash
docker compose up -d
```

This will:

1. **Start PostgreSQL** — Spins up a `postgres:15-alpine` container with the `ion` database
2. **Wait for DB health** — The app container waits until PostgreSQL is ready to accept connections
3. **Build & start the app** — Builds the Next.js app using the multi-stage `Dockerfile` and starts it on port 3000

### 3. Push the database schema

On the first run, you'll need to push the Prisma schema to the database:

```bash
docker compose exec app sh -c "cd packages/ion-db && npx prisma db push"
```

Or from outside Docker (if Bun is installed locally):

```bash
DATABASE_URL="postgresql://ion:ion@localhost:5432/ion" bun run db:push
```

### Managing containers

```bash
# View logs
docker compose logs -f

# View app logs only
docker compose logs -f app

# Stop all services
docker compose down

# Stop and remove data (fresh start)
docker compose down -v

# Rebuild after code changes
docker compose up -d --build
```

### Architecture

```
┌──────────────────────────────────────────────┐
│              docker compose up               │
├─────────────────────┬────────────────────────┤
│     db (PostgreSQL) │     app (Next.js)      │
│     Port: 5432      │     Port: 3000         │
│     postgres:15     │     Bun + Standalone   │
│     ──────────────  │     ──────────────     │
│     Health checked  │     Waits for db       │
│     Data persisted  │     Env from .env      │
└─────────────────────┴────────────────────────┘
```

---

## 📜 Available Scripts

| Command                     | Description                                     |
| --------------------------- | ----------------------------------------------- |
| `bun run dev`               | Start all apps and packages in development mode |
| `bun run build`             | Build all apps and packages for production      |
| `bun run lint`              | Lint all packages                               |
| `bun run format`            | Format code with Prettier                       |
| `bun run db:push`           | Push Prisma schema to the database              |
| `bun run db:migrate:dev`    | Create and apply a new migration                |
| `bun run db:migrate:deploy` | Deploy pending migrations                       |
| `bun run db:seed`           | Seed the database                               |
| `bun run generate`          | Regenerate Prisma client                        |

---

## 🔐 Authentication

This template uses [Better Auth](https://www.better-auth.com/) for authentication, configured in `packages/ion-auth/`. The following providers are set up out of the box:

- **Email & Password** — Standard email/password sign-up and sign-in
- **GitHub OAuth** — Sign in with GitHub
- **Google OAuth** — Sign in with Google

Session management includes cookie caching for optimal performance.

---

## 🛠️ Customization

This template is meant to be a **starting point**. Feel free to customize it to fit your requirements:

- **Add new pages** — Create routes in `apps/ion/app/`
- **Add UI components** — Use `npx shadcn@latest add <component>` inside `apps/ion/`
- **Configure auth providers** — Edit `packages/ion-auth/src/auth.ts` to add or remove OAuth providers
- **Modify the database schema** — Edit `packages/ion-db/prisma/schema.prisma` and run `bun run db:push`
- **Add new packages** — Create a new directory under `packages/` for shared logic
- **Style the app** — Modify `apps/ion/app/globals.css` to customize the design system colors and tokens
- **Update Docker setup** — Modify the `Dockerfile` and `docker-compose.yml` to add services (Redis, etc.)

The entire codebase is yours to shape — no restrictions, no vendor lock-in.

---

## 👤 Author

**Tejas P R** — [@Tejas-pr](https://github.com/Tejas-pr)

---

## 📄 License

This project is open source and available for use. Feel free to fork, modify, and build upon it.
