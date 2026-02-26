import { prisma } from "@pgrid/database";

export const validate = async (
    apiKey: string,
    model: string
): Promise<any> => {
    try {
        const apiKeyRecord = await prisma.apiKey.findFirst({
            where: {
                apiKey,
                disabled: false,
                deleted: false
            },
            select: {
                user: {
                    select: {
                        id: true,
                        credits: true
                    }
                }
            }
        });

        if (!apiKeyRecord) {
            return {
                ok: false,
                status: 401,
                message: "Invalid API key. Please generate a new key from your dashboard."
            };
        }

        if (apiKeyRecord.user.credits <= 0) {
            return {
                ok: false,
                status: 402,
                message: "You’ve run out of credits. Please top up to continue."
            };
        }

        const modelRecord = await prisma.model.findFirst({
            where: { slug: model }
        });

        if (!modelRecord) {
            return {
                ok: false,
                status: 403,
                message: "The requested model is not supported."
            };
        }

        const providers = await prisma.modelProviderMapping.findMany({
            where: {
                modelId: modelRecord.id
            },
            include: {
                provider: true
            }
        });

        if (providers.length === 0) {
            return {
                ok: false,
                status: 503,
                message: "No providers available for this model right now."
            };
        }

        const provider = providers[Math.floor(Math.random() * providers.length)];

        return {
            ok: true,
            provider,
            apiKeyRecord
        };
    } catch (error) {
        console.error(error);
        return {
            ok: false,
            status: 500,
            message: "Something went wrong while validating the request."
        };
    }
};