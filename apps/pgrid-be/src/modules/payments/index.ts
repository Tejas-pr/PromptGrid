import Elysia from "elysia";
import { betterAuth } from "../../middlewares/auth.middleware";
import { PaymentService } from "./service";
import { PaymentModel } from "./model";

export const app = new Elysia({ prefix: "payments" })
    .use(betterAuth)
    .guard({ auth: true })
    .post("/onramp", async ({ user, status }) => {
        try {
            const credits = await PaymentService.onRamp(user.id);
            return {
                message: "Onramp successful" as const,
                credits
            }
        } catch (e) {
            return status(411, {
                message: "Onramp failed" as const
            })
        }
    }, {
        response: {
            200: PaymentModel.onrampResponseSchema,
            411: PaymentModel.onrampFailedResponseSchema
        }
    })