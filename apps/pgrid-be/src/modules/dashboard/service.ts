import { prisma } from "@pgrid/database";

export abstract class dashboardService {
    static async getDashbardDetails(userId: string) {
        const total_api_count = await prisma.apiKey.count({
            where: { userId }
        });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { credits: true }
        });

        const total_models = await prisma.model.count();
        const total_providers = await prisma.provider.count();

        return {
            balance_creadits: user?.credits ?? null,
            total_api_count,
            total_models,
            total_providers
        };
    }
}