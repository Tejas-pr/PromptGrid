import { Elysia } from "elysia";
import { betterAuthView } from "./modules/auth";
import { cors } from '@elysiajs/cors'
import { app as apiKeysApp } from "./modules/apiKeys"
import { app as modelsApp } from "./modules/models"
import { app as dashboardApp } from "./modules/dashboard"

export const app = new Elysia()
  .use(cors())
  .all("/api/auth/*", betterAuthView)
  .use(apiKeysApp)
  .use(modelsApp)
  .use(dashboardApp)

export type App = typeof app;