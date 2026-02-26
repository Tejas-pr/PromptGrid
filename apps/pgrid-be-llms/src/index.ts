import { Elysia, t } from "elysia";
import { bearer } from "@elysiajs/bearer";
import { validate } from "./validation";
import { Google } from "./llms/google";
import { prisma } from "@pgrid/database";
import { Claude } from "./llms/anthropic";
import { OpenAi } from "./llms/chatgpt";

export const Messages = t.Array(
  t.Object({
    role: t.Enum({
      user: "user",
      assistant: "assistant"
    }),
    content: t.String()
  })
);

export type Messages = typeof Messages.static;

export const Conversation = t.Object({
  model: t.String(),
  messages: Messages
});

const app = new Elysia()
  .use(bearer())
  .post("/api/v1/chat/completions", async ({ status, bearer: apiKey, body }) => {
    const model = body.model;

    if (!model) {
      return status(401, {
        message: "Missing model. Please provide model."
      });
    }

    if (!apiKey) {
      return status(401, {
        message: "Missing API key. Please provide it in the Authorization header."
      });
    }

    const result = await validate(apiKey, body.model);

    if (!result.ok) {
      return status(result.status, {
        message: result.message
      });
    }

    let llmResponse = null;
    if (result.provider.name === "Google") {
      llmResponse = await Google.chat(model, body.messages);
    }
    if (result.provider.name === "Anthropic") {
      llmResponse = await Claude.chat(model, body.messages);
    }
    if (result.provider.name === "OpenAI") {
      llmResponse = await OpenAi.chat(model, body.messages);
    }
    // if (result.provider.name === "Groq") {

    // }

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
  .listen(3002);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);