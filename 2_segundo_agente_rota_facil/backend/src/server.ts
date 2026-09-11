import Fastify from "fastify"
import cors from "@fastify/cors"
import { chatRoutes } from './routes/chat.routes.ts'
import { config } from './config/index.ts'

export function createServer() {
    const app = Fastify({
        logger: true
    })

    app.register(cors, { origin: config.cors.allowedOrigin })
    app.register(chatRoutes)

    return app
}