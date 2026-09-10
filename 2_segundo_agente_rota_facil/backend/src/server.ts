import Fastify from "fastify"
import { chatRoutes } from './routes/chat.routes.ts'

export function createServer() {
    const app = Fastify({
        logger: true
    })

    app.register(chatRoutes)

    return app
}