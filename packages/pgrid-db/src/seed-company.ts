import 'dotenv/config';
import { prisma } from "./client";

const COMPANIES = [
    { name: 'OpenAI', website: 'https://openai.com' },
    { name: 'Anthropic', website: 'https://anthropic.com' },
    { name: 'Meta', website: 'https://meta.com' },
    { name: 'Google', website: 'https://google.com' },
    { name: 'Mistral AI', website: 'https://mistral.ai' },
];

const PROVIDERS = [
    { name: 'OpenAI', website: 'https://openai.com' },
    { name: 'Anthropic', website: 'https://anthropic.com' },
    { name: 'Google', website: 'https://google.com' },
    { name: 'Together AI', website: 'https://together.ai' },
    { name: 'Groq', website: 'https://groq.com' },
];

const MODELS = [
    { name: 'GPT-4o', slug: 'openai/gpt-4o', companyName: 'OpenAI' },
    { name: 'GPT-3.5 Turbo', slug: 'openai/gpt-3.5-turbo', companyName: 'OpenAI' },
    { name: 'Claude 3.5 Sonnet', slug: 'anthropic/claude-3.5-sonnet', companyName: 'Anthropic' },
    { name: 'Llama 3 8B Instruct', slug: 'meta-llama/llama-3-8b-instruct', companyName: 'Meta' },
    { name: 'Gemini 1.5 Pro', slug: 'google/gemini-1.5-pro', companyName: 'Google' },
    { name: 'Mistral Large', slug: 'mistralai/mistral-large', companyName: 'Mistral AI' },
];

const MAPPINGS = [
    { modelSlug: 'openai/gpt-4o', providerName: 'OpenAI', inputTokenCost: 500, outputTokenCost: 1500 },
    { modelSlug: 'openai/gpt-3.5-turbo', providerName: 'OpenAI', inputTokenCost: 50, outputTokenCost: 150 },
    { modelSlug: 'anthropic/claude-3.5-sonnet', providerName: 'Anthropic', inputTokenCost: 300, outputTokenCost: 1500 },
    { modelSlug: 'meta-llama/llama-3-8b-instruct', providerName: 'Together AI', inputTokenCost: 20, outputTokenCost: 20 },
    { modelSlug: 'meta-llama/llama-3-8b-instruct', providerName: 'Groq', inputTokenCost: 50, outputTokenCost: 80 },
    { modelSlug: 'google/gemini-1.5-pro', providerName: 'Google', inputTokenCost: 350, outputTokenCost: 1050 },
    { modelSlug: 'mistralai/mistral-large', providerName: 'Together AI', inputTokenCost: 400, outputTokenCost: 1200 },
];

(async () => {
    try {
        console.log("Seeding Companies...");
        for (const data of COMPANIES) {
            const existing = await prisma.company.findFirst({ where: { name: data.name } });
            if (!existing) {
                await prisma.company.create({ data });
            }
        }

        console.log("Seeding Providers...");
        for (const data of PROVIDERS) {
            const existing = await prisma.provider.findFirst({ where: { name: data.name } });
            if (!existing) {
                await prisma.provider.create({ data });
            }
        }

        console.log("Seeding Models...");
        for (const data of MODELS) {
            const company = await prisma.company.findFirst({ where: { name: data.companyName } });
            if (!company) {
                console.warn(`Company ${data.companyName} not found for model ${data.slug}. Skipping.`);
                continue;
            }

            const existing = await prisma.model.findFirst({ where: { slug: data.slug } });
            if (!existing) {
                await prisma.model.create({
                    data: {
                        name: data.name,
                        slug: data.slug,
                        companyId: company.id
                    }
                });
            }
        }

        console.log("Seeding Model/Provider Mappings...");
        for (const data of MAPPINGS) {
            const model = await prisma.model.findFirst({ where: { slug: data.modelSlug } });
            const provider = await prisma.provider.findFirst({ where: { name: data.providerName } });

            if (!model || !provider) {
                console.warn(`Model (${data.modelSlug}) or Provider (${data.providerName}) missing. Skipping mapping.`);
                continue;
            }

            const existing = await prisma.modelProviderMapping.findFirst({
                where: { modelId: model.id, providerId: provider.id }
            });

            if (!existing) {
                await prisma.modelProviderMapping.create({
                    data: {
                        modelId: model.id,
                        providerId: provider.id,
                        inputTokenCost: data.inputTokenCost,
                        outputTokenCost: data.outputTokenCost
                    }
                });
            } else {
                await prisma.modelProviderMapping.update({
                    where: { id: existing.id },
                    data: {
                        inputTokenCost: data.inputTokenCost,
                        outputTokenCost: data.outputTokenCost
                    }
                });
            }
        }

        console.log("Database seeded successfully with companies, providers, models, and mappings!");
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
})();
