import Elysia from "elysia";
import { modelsService } from "./service";
import { modelModels } from "./models";

export const app = new Elysia({ prefix: "/models" })
    .get("/", async ({ status }) => {
        try {
            const models = await modelsService.getAllModels();
            return status(200, {
                models
            })
        } catch (e) {
            return status(411, {
                message: "Unable to get the Models, Please try again after sometimes!"
            })
        }
    }, {
        response: {
            200: modelModels.getModelsSchemaResponse,
            411: modelModels.getModelsFailedResponse
        }
    })
    .get("/providers", async ({ status }) => {
        try {
            const providers = await modelsService.getAllProviders();
            return status(200, {
                providers
            })
        } catch (e) {
            return status(411, {
                message: "Unable to get the Providers, Please try again after sometimes!"
            })
        }
    }, {
        response: {
            200: modelModels.getProvidersSchemaResponse,
            411: modelModels.getProvidersFailedResponse
        }
    })
    .get("/:id/provider", async ({ params: { id }, status }) => {
        try {
            const modelprovider = await modelsService.getModelProvider(id);

            if (!modelprovider) {
                return status(404, {
                    message: "Provider not found",
                });
            }

            return status(200, {
                modelprovider
            })
        } catch (e) {
            return status(411, {
                message: "Unable to get the Provider, Please try again after sometimes!"
            })
        }
    }, {
        response: {
            200: modelModels.getModelProviderSchemaResponse,
            404: modelModels.getModelProviderNotFoundResponse,
            411: modelModels.getModelProviderFailedResponse,
        }
    })