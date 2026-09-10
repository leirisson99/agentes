import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chatService } from '../../src/services/chat.service.ts'
import { classifier } from '../../src/graph/nodes/identifyIntentNode.ts'

function mockClassifier(t: any, command: string) {
    t.mock.method(classifier, 'invoke', async () => ({ command }))
}

function mockFetchJson(t: any, data: unknown) {
    t.mock.method(globalThis, 'fetch', async () => ({
        json: async () => data
    }))
}

test('chatService.processMessage retorna answer e ticketId ao abrir chamado', async (t) => {
    mockClassifier(t, 'abrir_chamado')

    const result = await chatService.processMessage('meu sistema não funciona', 'thread-abrir-chamado')

    assert.match(result.ticketId ?? '', /^TCK-\d{4}$/)
    assert.ok(result.answer.includes(result.ticketId!))
})

test('chatService.processMessage retorna ticketId null quando a intenção não é reconhecida', async (t) => {
    mockClassifier(t, 'unknown')

    const result = await chatService.processMessage('bom dia', 'thread-fallback')

    assert.equal(result.ticketId, null)
    assert.equal(
        result.answer,
        'Não foi possivel identificar a sua inteção por favor tente novamente.'
    )
})

test('chatService.processMessage repassa o output do node de cotação e mantém ticketId null', async (t) => {
    mockClassifier(t, 'consultar_cotacao')
    mockFetchJson(t, { USDBRL: { bid: '5.10' } })

    const result = await chatService.processMessage('quanto tá o dólar?', 'thread-cotacao')

    assert.equal(result.ticketId, null)
    assert.match(result.answer, /A cotação atual do dólar é R\$ 5\.10\./)
})
