import { prisma } from "@pgrid/database";


export abstract class modelsService {

    static async getAllModels() {
        const models = await prisma.model.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                company: {
                    select: {
                        id: true,
                        name: true,
                        website: true
                    }
                }
            }
        });

        return models
    }

    static async getAllProviders() {
        const providers = await prisma.provider.findMany();
        return providers;
    }

    static async getModelProvider(modelId: string) {
        const modelprovider = await prisma.modelProviderMapping.findFirst({
            where: {
                modelId
            },
            select: {
                id: true,
                providerId: true,
                provider: {
                    select: {
                        id: true,
                        name: true,
                        website: true
                    }
                },
                inputTokenCost: true,
                outputTokenCost: true
            }
        });
        return modelprovider;
    }
}