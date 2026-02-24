import { t } from "elysia";

export namespace modelModels {
    export const getModelsSchemaResponse = t.Object({
        models: t.Array(t.Object({
            id: t.String(),
            name: t.String(),
            slug: t.String(),
            company: t.Object({
                id: t.String(),
                name: t.String(),
                website: t.String(),
            })
        }))
    })

    export type getModelsSchemaResponse = typeof getModelsSchemaResponse.static;

    export const getModelsFailedResponse = t.Object({
        message: t.Literal("Unable to get the Models, Please try again after sometimes!")
    });

    export const getProvidersSchemaResponse = t.Object({
        providers: t.Array(t.Object({
            id: t.String(),
            name: t.String(),
            website: t.String(),
        }))
    });

    export const getProvidersFailedResponse = t.Object({
        message: t.Literal("Unable to get the Providers, Please try again after sometimes!")
    });

    export const getModelProviderSchemaResponse = t.Object({
        modelprovider: t.Object({
            id: t.String(),
            providerId: t.String(),
            provider: t.Object({
                id: t.String(),
                name: t.String(),
                website: t.String(),
            }),
            inputTokenCost: t.Integer(),
            outputTokenCost: t.Integer(),
        }),
    });

    export type getModelProviderSchemaResponse = typeof getModelProviderSchemaResponse.static;

    export const getModelProviderNotFoundResponse = t.Object({
        message: t.Literal("Provider not found")
    });

    export type getModelProviderNotFoundResponse = typeof getModelProviderNotFoundResponse.static;

    export const getModelProviderFailedResponse = t.Object({
        message: t.Literal("Unable to get the Provider, Please try again after sometimes!")
    });

    export type getModelProviderFailedResponse = typeof getModelProviderFailedResponse.static;
}

