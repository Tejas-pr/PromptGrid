import { t } from "elysia";

export namespace ApiKeyModel {
    // createApiKeySchema
    export const createApiKeySchema = t.Object({
        name: t.String()
    })

    export type createApiKeySchema = typeof createApiKeySchema.static;

    export const createApiKeyResponse = t.Object({
        id: t.String(),
        apiKey: t.String()
    })

    export type createApiKeyResponse = typeof createApiKeyResponse.static;

    // disableApiKeySchema
    export const disableApiKeySchema = t.Object({
        id: t.String()
    });

    export type disableApiKeySchema = typeof disableApiKeySchema.static;

    export const disableApiKeyResponse = t.Object({
        message: t.Literal("Disabled API key successfully!")
    });

    export type disableApiKeyResponse = typeof disableApiKeyResponse.static;

    // get api key
    export const getApiKeyResponse = t.Object({
        name: t.String(),
        apiKey: t.String(), // this should be some part of it not full api key.
        lastUsed: t.String(),
        creditsConsumed: t.String(),
    });

    export type getApiKeyResponse = typeof getApiKeyResponse.static;

    // delete
    export const deleteApiKeyResponse = t.Object({
        message: t.Literal("deleted API key successfully!")
    });

    export type deleteApiKeyResponse = typeof deleteApiKeyResponse.static;
}