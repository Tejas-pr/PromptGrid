import Elysia from "elysia";
import { betterAuth } from "../../middlewares/auth.middleware";
import { ApiKeyService } from "./service";
import { ApiKeyModel } from "./models";

export const app = new Elysia({ prefix: "/api-keys" })
    .use(betterAuth)
    .guard({ auth: true })
    .get("/", async ({ user }) => {
        const apiKeys = await ApiKeyService.getApiKey(user.id);

        return {
            apiKeys
        }
    }, {
        response: {
            200: ApiKeyModel.getApiKeyResponseSchema
        }
    })
    .post("/", async ({ user, body }) => {
        const { apiKey, id } = await ApiKeyService.createApiKey(body.name, user.id);

        return {
            id,
            apiKey
        }
    }, {
        body: ApiKeyModel.createApiKeySchema,
        response: {
            200: ApiKeyModel.createApiKeyResponse
        }
    })
    .put("/", async ({ user, body, status }) => {
        try {
            await ApiKeyService.updateDisableApiKey(body.id, user.id, body.disable);

            return status(200, {
                message: "Update API key successfully!"
            })
        } catch (e) {
            return status(411, {
                message: "Updating API key unsuccessfully!"
            })
        }
    }, {
        body: ApiKeyModel.updateDisableApiKeySchema,
        response: {
            200: ApiKeyModel.updateDisableApiKeyResponse,
            411: ApiKeyModel.updateDisableApiKeyFailedResponse
        }
    })
    .delete("/:id", async ({ user, params: { id }, status }) => {
        try {
            await ApiKeyService.deleteApiKey(id, user.id)

            return status(200, {
                message: "deleted API key successfully!"
            })
        } catch (e) {
            return status(411, {
                message: "deleting API key unsuccessfully!"
            })
        }
    }, {
        response: {
            200: ApiKeyModel.deleteApiKeyResponse,
            411: ApiKeyModel.deleteApiKeyFailedResponse
        }
    })
