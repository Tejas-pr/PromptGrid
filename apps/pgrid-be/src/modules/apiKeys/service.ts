import { prisma } from "@pgrid/database";
import crypto from "crypto";

// const PREFIX = "sk-or-v1";
const PREFIX = "pg-or-v1";

export abstract class ApiKeyService {
    static createRandomApiKey(): string {
        // 32 bytes = 256 bits of entropy
        const randomPart = crypto
            .randomBytes(32)
            .toString("base64url");

        return `${PREFIX}-${randomPart}`;
    }

    static async createApiKey(name: string, userId: string): Promise<{
        id: string,
        apiKey: string
    }> {
        const apiKey = ApiKeyService.createRandomApiKey();
        const apiKeyResponse = await prisma.apiKey.create({
            data: {
                name,
                apiKey,
                userId
            }
        });

        return {
            id: apiKeyResponse.id,
            apiKey
        }
    }

    static async getApiKey(userId: string) {
        const apikeys = await prisma.apiKey.findMany({
            where: {
                userId,
                deleted: false
            },
            select: {
                id: true,
                apiKey: true,
                name: true,
                creditsConsumed: true,
                lastUsed: true
            }
        });

        return apikeys;
    }

    static async updateDisableApiKey(id: string, userId: string, disabled: boolean) {
        await prisma.apiKey.update({
            where: {
                id,
                userId
            },
            data: {
                disabled
            }
        });
    }

    static async deleteApiKey(id: string, userId: string) {
        await prisma.apiKey.update({
            where: {
                id,
                userId
            },
            data: {
                deleted: true
            }
        })
    }
}