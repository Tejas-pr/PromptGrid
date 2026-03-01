import axios from "axios";

const LLM_BACKEND_API = import.meta.env.VITE_LLM_BACKEND_API;

if (!LLM_BACKEND_API) {
    throw new Error("LLM_BACKEND_API is missing! check you env file");
}

export interface ChatRequestBody {
    slug: string;
    messages: { content: string }[];
}

export const chatWithLLM = async (apikey: string, body: ChatRequestBody) => {
    try {
        const response = await axios.post(`${LLM_BACKEND_API}/chat/completions`, body, {
            headers: {
                'Authorization': `Bearer ${apikey}`
            }
        });
        return response.data;
    } catch (e) {
        console.error('Chat with LLM failed:', e);
        throw e;
    }
}