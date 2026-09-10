import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from '../src/server.ts'
import { chatService } from '../src/services/chat.service.ts'

test('createServer registra a rota /chat e responde a uma requisição válida', async (t) => {
    t.mock.method(chatService, 'processMessage', async () => ({
        answer: 'Entendi, vou te ajudar.',
        ticketId: null
    }))

    const app = createServer()
    t.after(() => app.close())
    await app.ready()

    const res = await app.inject({
        method: 'POST',
        url: '/chat',
        payload: { question: 'oi' }
    })

    assert.equal(res.statusCode, 200)
    assert.deepEqual(res.json(), { answer: 'Entendi, vou te ajudar.', ticketId: null })
})

test('createServer devolve 404 para rotas não registradas', async (t) => {
    const app = createServer()
    t.after(() => app.close())
    await app.ready()

    const res = await app.inject({ method: 'GET', url: '/rota-inexistente' })

    assert.equal(res.statusCode, 404)
})
