import { test } from 'node:test'
import assert from 'node:assert/strict'
import Fastify from 'fastify'
import { chatRoutes } from '../../src/routes/chat.routes.ts'
import { chatService } from '../../src/services/chat.service.ts'

async function buildApp() {
    const app = Fastify({ logger: false })
    app.register(chatRoutes)
    await app.ready()
    return app
}

test('POST /chat retorna 200 e o resultado do chatService quando question é informado', async (t) => {
    t.mock.method(chatService, 'processMessage', async (question: string, conversationId: string) => ({
        answer: `resposta para: ${question} (${conversationId})`,
        ticketId: null
    }))

    const app = await buildApp()
    t.after(() => app.close())

    const res = await app.inject({
        method: 'POST',
        url: '/chat',
        payload: { question: 'quanto tá o dólar?', conversationId: 'conv-1' }
    })

    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.json(), { answer: 'resposta para: quanto tá o dólar? (conv-1)', ticketId: null })
})

test('POST /chat retorna 400 quando question não é informado', async (t) => {
    const app = await buildApp()
    t.after(() => app.close())

    const res = await app.inject({
        method: 'POST',
        url: '/chat',
        payload: {}
    })

    assert.equal(res.statusCode, 400)
})

test('POST /chat retorna 400 quando question não é um tipo compatível com string', async (t) => {
    const app = await buildApp()
    t.after(() => app.close())

    const res = await app.inject({
        method: 'POST',
        url: '/chat',
        payload: { question: { nested: true } }
    })

    assert.equal(res.statusCode, 400)
})
