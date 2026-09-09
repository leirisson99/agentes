import Fastify from "fastify"
import { HumanMessage } from "@langchain/core/messages"
import { buildGraph } from './graph/graph.ts'

export function createServer() {
    const app = Fastify({ logger: true })
    const graph = buildGraph()

    app.post('/chat', {
        schema: {
            body: {
                type: 'object',
                required: ['question'],
                properties: {
                    question: { type: 'string' }
                }
            }
        }
    }, async (request, reply) => {
        const { question } = request.body as { question: string }
        const result = await graph.invoke({
            messsages: [new HumanMessage(question)],
            output: "",
            command: "unknown"
        })

        return reply.send({
            answer: result.output,
            ticketId: result.ticketId ?? null
        })
    })


    return app
}