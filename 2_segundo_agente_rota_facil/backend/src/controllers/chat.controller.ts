import type { FastifyRequest, FastifyReply } from "fastify"
import { chatService } from "../services/chat.service.ts"

interface ChatBody {
    question: string,
    conversationId?: string
}

export async function chatController(
    request: FastifyRequest<{ Body: ChatBody }>,
    reply: FastifyReply
) {
    const { question, conversationId } = request.body
    const result = await chatService.processMessage(question, conversationId ?? "default")

    return reply.send(result)
}