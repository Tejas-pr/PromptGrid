import { Elysia } from "elysia";
import { betterAuthView } from "./modules/auth";
import { cors } from '@elysiajs/cors'
import { app as apiKeysApp } from "./modules/apiKeys"
import { app as modelsApp } from "./modules/models"

export const app = new Elysia()
  .use(cors())
  .all("/api/auth/*", betterAuthView)
  .use(apiKeysApp)
  .use(modelsApp)

export type App = typeof app;