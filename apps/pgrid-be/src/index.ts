import { Elysia } from "elysia";
import { betterAuthView } from "./modules/auth";
import { cors } from '@elysiajs/cors'
import { betterAuth } from "./middlewares/auth.middleware";

const PORT = Number(process.env.BACKEND_PORT) || 3001;

const app = new Elysia()
  .use(cors())
  .use(betterAuth)
  .all("/api/auth/*", betterAuthView)
  .listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);