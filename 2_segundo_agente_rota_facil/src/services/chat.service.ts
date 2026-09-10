import { HumanMessage } from "@langchain/core/messages"
import { buildGraph } from "../graph/graph.ts"


// compilado uma vez só, reaproveitado em toda requisição
const graph = buildGraph()


export class ChatService {
    async processMessage(question: string, conversationId: string) {
        const result = await graph.invoke(
            { messages: [new HumanMessage(question)], output: "", command: "unknown" },
            { configurable: { thread_id: conversationId } }
        )

        return {
            answer: result.output,
            ticketId: result.ticketId ?? null
        }
    }
}

export const chatService = new ChatService();