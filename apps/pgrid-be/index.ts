import { app } from "./src/app"

const PORT = Number(process.env.BACKEND_PORT) || 3001;
app.listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);