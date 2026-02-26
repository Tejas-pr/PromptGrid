import { Messages } from "..";

export type llmResponse = {
    completions: {
        choices: {
            message: {
                content: string
            }
        }[]
    },
    inputTokensConsumed: number,
    outputTokensConsumed: number,
}

export class BaseLLm {
    static async chat(model: string, message: Messages): Promise<llmResponse> {
        throw new Error("Not implemented chat function")
    }
}