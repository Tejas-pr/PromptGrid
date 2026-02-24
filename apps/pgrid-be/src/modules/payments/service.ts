import { prisma } from "@pgrid/database";

const ONRAMP_AMOUNT = 1000;

export abstract class PaymentService {

    static async onRamp(userId: string) {
        const [ user ] = await prisma.$transaction([
            prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    credits: {
                        increment: ONRAMP_AMOUNT
                    }
                }
            }),
            prisma.onrampTransactions.create({
                data: {
                    userId,
                    amount: ONRAMP_AMOUNT,
                    status: "complete"
                }
            })
        ])

        return user.credits
    }
}