import Elysia from "elysia";
import { betterAuth } from "../../middlewares/auth.middleware";
import { dashboardModels } from "./models";
import { dashboardService } from "./service";

export const app = new Elysia({ prefix: "/dashboard" })
    .use(betterAuth)
    .guard({ auth: true })
    .get("/", async ({ user, status }) => {
        try {
            const response = await dashboardService.getDashbardDetails(user.id);

            return status(200, {
                response
            })
        } catch (e) {
            return status(411, {
                message: "Unable to get the dashboard details, Please try again after some time!!"
            })
        }
    }, {
        response: {
            200: dashboardModels.getDashbardDetailsResponse,
            411: dashboardModels.getDashbardDetailsFailedResponse
        }
    })