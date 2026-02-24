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
    export const updateDisableApiKeySchema = t.Object({
        id: t.String(),
        disable: t.Boolean()
    });

    export type updateDisableApiKeySchema = typeof updateDisableApiKeySchema.static;

    export const updateDisableApiKeyResponse = t.Object({
        message: t.Literal("Update API key successfully!")
    });

    export type updateDisableApiKeyResponse = typeof updateDisableApiKeyResponse.static;

    export const updateDisableApiKeyFailedResponse = t.Object({
        message: t.Literal("Updating API key unsuccessfully!")
    });

    export type updateDisableApiKeyFailedResponse = typeof updateDisableApiKeyFailedResponse.static;

    // get api key
    export const getApiKeyResponseSchema = t.Object({
        apiKeys: t.Array(t.Object({
            id: t.String(),
            name: t.String(),
            apiKey: t.String(), // this should be some part of it not full api key.
            lastUsed: t.Nullable(t.Date()),
            creditsConsumed: t.Number(),
            disabled: t.Boolean(),
        }))
    });

    export type getApiKeyResponseSchema = typeof getApiKeyResponseSchema.static;

    // delete
    export const deleteApiKeyResponse = t.Object({
        message: t.Literal("deleted API key successfully!")
    });

    export type deleteApiKeyResponse = typeof deleteApiKeyResponse.static;

    export const deleteApiKeyFailedResponse = t.Object({
        message: t.Literal("deleting API key unsuccessfully!")
    });

    export type deleteApiKeyFailedResponse = typeof deleteApiKeyFailedResponse.static;
}