import Elysia from "elysia";
import { betterAuth } from "../../middlewares/auth.middleware";

export const app = new Elysia({ prefix: "/api-keys" })
    .use(betterAuth)
    .guard({ auth: true })
    .get("/", ({ user, session }) => {
        
    })
    .post("/", ({ user, session }) => {

    })
    .post("/disable", () => {

    })
    .delete("/:id", () => {

    })
