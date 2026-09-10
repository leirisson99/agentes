import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chatController } from '../../src/controllers/chat.controller.ts'
import { chatService } from '../../src/services/chat.service.ts'

function fakeRequest(body: { question: string, conversationId?: string }) {
    return { body } as any
}

function fakeReply() {
    const reply: any = {
        sent: undefined as unknown,
        send(data: unknown) {
            reply.sent = data
            return reply
        }
    }
    return reply
}

test('chatController repassa question e conversationId para o chatService', async (t) => {
    const invokeArgs: unknown[] = []
    t.mock.method(chatService, 'processMessage', async (question: string, conversationId: string) => {
        invokeArgs.push([question, conversationId])
        return { answer: 'ok', ticketId: null }
    })

    const reply = fakeReply()
    await chatController(fakeRequest({ question: 'oi', conversationId: 'conv-1' }), reply)

    assert.deepEqual(invokeArgs[0], ['oi', 'conv-1'])
})

test('chatController usa "default" quando conversationId não é informado', async (t) => {
    const invokeArgs: unknown[] = []
    t.mock.method(chatService, 'processMessage', async (question: string, conversationId: string) => {
        invokeArgs.push([question, conversationId])
        return { answer: 'ok', ticketId: null }
    })

    const reply = fakeReply()
    await chatController(fakeRequest({ question: 'oi' }), reply)

    assert.deepEqual(invokeArgs[0], ['oi', 'default'])
})

test('chatController responde com o resultado retornado pelo chatService', async (t) => {
    t.mock.method(chatService, 'processMessage', async () => ({
        answer: 'Abri o chamado #TCK-1234.',
        ticketId: 'TCK-1234'
    }))

    const reply = fakeReply()
    await chatController(fakeRequest({ question: 'meu sistema não funciona' }), reply)

    assert.deepEqual(reply.sent, { answer: 'Abri o chamado #TCK-1234.', ticketId: 'TCK-1234' })
})
