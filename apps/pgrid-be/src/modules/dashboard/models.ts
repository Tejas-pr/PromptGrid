import { t } from "elysia";


export namespace dashboardModels {
    export const getDashbardDetailsResponse = t.Object({
        response: t.Object({
            balance_creadits: t.Nullable(t.Integer()),
            total_api_count: t.Integer(),
            total_models: t.Integer(),
            total_providers: t.Integer(),
        })
    });

    export type getDashbardDetailsResponse = typeof getDashbardDetailsResponse.static;

    export const getDashbardDetailsFailedResponse = t.Object({
        message: t.Literal("Unable to get the dashboard details, Please try again after some time!!")
    });

    export type getDashbardDetailsFailedResponse = typeof getDashbardDetailsFailedResponse.static;
}