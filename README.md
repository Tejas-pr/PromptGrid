# 🚀 PromptGrid

![PromptGrid Banner](https://img.shields.io/badge/Status-Active-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=flat&logo=bun&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-%23EF4444.svg?style=flat&logo=turborepo&logoColor=white)
![ElysiaJS](https://img.shields.io/badge/ElysiaJS-FF69B4?style=flat&logo=elysia&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)

**PromptGrid** is a unified AI proxy and platform, heavily inspired by [OpenRouter](https://openrouter.ai/). It provides a single, standardized API endpoint (`/api/v1/chat/completions`) to route chat requests to multiple Large Language Model (LLM) providers like **OpenAI**, **Anthropic**, and **Google Gemini**.

By centralizing LLM access, PromptGrid handles seamless API key management, real-time token tracking, and unified billing/credits.

---

## ✨ Features

- **🌐 Unified API Interface:** Hit a single endpoint `POST /api/v1/chat/completions` with the standard OpenAI format to interact with _any_ supported model.
- **🔑 API Key & Access Management:** Generate and manage API keys tied to your account.
- **💰 Credit & Token Tracking:** Automatically track input/output token usage, calculate model cost dynamically (depending on the provider and model), and deduct credits in real time.
- **🔐 Built-in Authentication:** Utilizing `better-auth` for secure, seamless user authentication and session management.
- **🎨 Modern Dashboard:** A beautiful, responsive frontend built with React, Vite, TailwindCSS, and shadcn/ui to manage models, keys, and view usage metrics.
- **⚡ High Performance:** Powered by the incredible speeds of **Bun**, **ElysiaJS**, and the structural scalability of **Turborepo**.

---

## 🏗️ Architecture

PromptGrid is structured as a **Turborepo Monorepo** ensuring modularity and blazingly fast builds.

### 📦 Apps (`/apps`)

- **`pgrid` (Frontend):** A stylish React SPA built on Vite, enriched with `TailwindCSS` and `shadcn/ui`. Consumes backend services type-safely using `@elysiajs/eden`.
- **`pgrid-be` (Main API):** Core ElysiaJS backend governing user authentication, API key provisioning, available models, dashboard metrics, and payments/credits management.
- **`pgrid-be-llms` (AI Gateway API):** Dedicated, high-throughput ElysiaJS service that validates proxy API keys and routes standard LLM payloads to respective providers (OpenAI, Anthropic, Google) utilizing their official SDKs. It automatically charges the user's credit balance based dynamically on tokens consumed.

### 📦 Packages (`/packages`)

- **`@pgrid/db`:** Centralized Prisma schema (`schema.prisma`) and generated client interacting with **PostgreSQL**. The database models Users, API Keys, Models, Providers, and their respective cost mappings.
- **`@pgrid/auth`:** Preconfigured authentication logic abstracting `better-auth` and integrating smoothly with the unified database.
- **`@pgrid/config-*`:** Shared configurations for TypeScript and ESLint ensuring standard code quality and developer experience.

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- [Docker](https://www.docker.com/) & Docker Compose (for PostgreSQL)

### 1. Repository Setup

Clone the repository and install the monorepo dependencies:

```bash
git clone https://github.com/your-username/PromptGrid.git
cd PromptGrid

bun install
```

### 2. Environment & Database setup

Copy over the `.env.example` file to create your local `.env`. Ensure your required LLM API Keys (OpenAI, Anthropic, Google) are populated if testing the generation gateway.

```bash
cp .env.example .env
```

Start the local PostgreSQL database using Docker Compose:

```bash
docker-compose up -d
```

Push the database schema up and generate the Prisma Client:

```bash
bun run db:push
bun run generate
```

_(Optional)_ Seed your database with default providers and mapped models:

```bash
bun run db:seed
```

### 3. Spin it up!

Start the entire monorepo in development mode using Turborepo:

```bash
bun run dev
```

You can now access:

- **Frontend Dashboard:** `http://localhost:5173` (default Vite port)
- **Main API Server:** `http://localhost:3000` (default Elysia)
- **AI Gateway Proxy:** `http://localhost:3002`

---

## 🤖 API Gateway Example

PromptGrid exposes an OpenAI-compatible interface regardless of the model chosen. Here is an example request you can make locally via `cURL`:

```bash
curl -X POST http://localhost:3002/api/v1/chat/completions \
  -H "Authorization: Bearer YOUR_PROMPTGRID_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-3-opus-20240229",
    "messages": [
      {
        "role": "user",
        "content": "Why is the sky blue?"
      }
    ]
  }'
```

---

## 🛠️ Tech Stack overview

- **Package Manager:** Bun `v1.2`
- **Monorepo:** Turborepo `v2`
- **Backend Framework:** ElysiaJS
- **Frontend Framework:** React 19 / Vite
- **Styling:** Tailwind CSS v4 / shadcn/ui
- **Database ORM:** Prisma
- **Database Engine:** PostgreSQL
- **Authentication:** better-auth

## 📝 License

This project is licensed under the [MIT License](LICENSE).
