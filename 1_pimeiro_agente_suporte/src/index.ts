import { createServer } from './server.ts'

const app = createServer()
await app.listen({
    port: 3535,
    host: '0.0.0.0'
})

console.log("Agente de suporte rodando em http://localhost:3535");