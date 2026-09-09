import { ChatOpenAI } from '@langchain/openai'
import { type GraphState } from '../graph.ts'

const model = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    }
})


export async function duvidaGeralNode(state: GraphState): Promise<GraphState> {
    const response = await model.invoke(state.messsages)
    return {
        ...state,
        output: response.text
    }
}