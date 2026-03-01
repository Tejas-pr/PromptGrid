import { Elysia, t } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { validate } from "./validation";
import { Google } from "./llms/google";
import { prisma } from "@pgrid/database";
import { Claude } from "./llms/anthropic";
import { OpenAi } from "./llms/chatgpt";
import { cors } from '@elysiajs/cors'

export const Messages = t.Array(
  t.Object({
    content: t.String()
  })
);

export type Messages = typeof Messages.static;

export const Conversation = t.Object({
  slug: t.String(),
  messages: Messages
});

const app = new Elysia()
  .use(bearer())
  .use(cors())
  .post("/api/v1/chat/completions", async ({ status, bearer: apiKey, body }) => {
    const slug = body.slug;

    if (!slug) {
      return status(401, {
        message: "Missing slug. Please provide slug."
      });
    }

    if (!apiKey) {
      return status(401, {
        message: "Missing API key. Please provide it in the Authorization header."
      });
    }

    const result = await validate(apiKey, body.slug);

    if (!result.ok) {
      return status(result.status, {
        message: result.message
      });
    }

    const providerName = result.provider.provider.name;

    let llmResponse = null;
    if (providerName === "Google") {
      llmResponse = await Google.chat(result.model, body.messages);
    }
    if (providerName === "Anthropic") {
      llmResponse = await Claude.chat(result.model, body.messages);
    }
    if (providerName === "OpenAI") {
      llmResponse = await OpenAi.chat(result.model, body.messages);
    }

    if (!llmResponse) {
      return status(403, {
        message: "No provider found for this model"
      })
    }

    const creditsUsed = (llmResponse.inputTokensConsumed * result.provider.inputTokenCost + llmResponse.outputTokensConsumed * result.provider.outputTokenCost) / 10;

    // decrease the credits
    const res = await prisma.user.update({
      where: {
        id: result.apiKeyRecord.user.id
      },
      data: {
        credits: {
          decrement: creditsUsed
        }
      }
    });

    // increase the useage value
    const res2 = await prisma.apiKey.update({
      where: {
        apiKey: apiKey
      },
      data: {
        creditsConsumed: {
          increment: creditsUsed
        }
      }
    })

    return llmResponse;

  },
    {
      body: Conversation
    }
  )

const PORT = Number(process.env.LLM_BACKEND_PORT) || 3002;
app.listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);