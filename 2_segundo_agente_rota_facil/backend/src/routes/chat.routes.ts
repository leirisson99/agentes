import type { FastifyInstance } from "fastify";
import { chatController } from "../controllers/chat.controller.ts";



export function chatRoutes(app: FastifyInstance) {
    app.post('/chat', {
        schema: {
            body: {
                type: 'object',
                required: ['question'],
                properties: {
                    question: { type: 'string' },
                    conversationId: { type: 'string' }
                }
            }
        }
    }, chatController);
}