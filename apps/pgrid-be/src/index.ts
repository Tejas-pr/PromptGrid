import { Elysia } from "elysia";
import { betterAuthView } from "./modules/auth";
import { cors } from '@elysiajs/cors'
import { app as apiKeysApp } from "./modules/apiKeys"
import { app as modelsApp } from "./modules/models"

const PORT = Number(process.env.BACKEND_PORT) || 3001;

const app = new Elysia()
  .use(cors())
  .all("/api/auth/*", betterAuthView)
  .use(apiKeysApp)
  .use(modelsApp)
  .listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);