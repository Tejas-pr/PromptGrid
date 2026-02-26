
import OpenAI from "openai";
import { BaseLLm, llmResponse } from "./Base";
import { Messages } from "..";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export class OpenAi extends BaseLLm {
    static async chat(model: string, messages: Messages): Promise<llmResponse> {
        const response = await client.responses.create({
            model: model,
            input:  messages.map(message => ({
                role: message.role,
                content: message.content
            }))
        });

        return {
            inputTokensConsumed: response.usage?.input_tokens!,
            outputTokensConsumed: response.usage?.output_tokens!,
            completions: {
                choices: [{
                    message: {
                        content: response.output_text
                    }
                }]
            }
        }
    }
}