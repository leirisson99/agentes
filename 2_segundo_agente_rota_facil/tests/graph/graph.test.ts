import { test } from 'node:test'
import assert from 'node:assert/strict'
import { AIMessage, HumanMessage } from 'langchain'
import { buildGraph } from '../../src/graph/graph.ts'
import { classifier } from '../../src/graph/nodes/identifyIntentNode.ts'

function mockClassifier(t: any, command: string) {
    t.mock.method(classifier, 'invoke', async () => ({ command }))
}

function mockFetchJson(t: any, data: unknown) {
    t.mock.method(globalThis, 'fetch', async () => ({
        json: async () => data
    }))
}

function invokeConfig(threadId: string) {
    return { configurable: { thread_id: threadId } }
}

test('fluxo completo: consulta de cotação', async (t) => {
    mockClassifier(t, 'consultar_cotacao')
    mockFetchJson(t, { USDBRL: { bid: '5.10' } })

    const graph = buildGraph()
    const result = await graph.invoke(
        { messages: [new HumanMessage('quanto tá o dólar hoje?')], output: '', command: 'unknown' },
        invokeConfig('cotacao')
    )

    assert.equal(result.command, 'consultar_cotacao')
    assert.equal(result.cotacao, 5.1)
    assert.match(result.output, /A cotação atual do dólar é R\$ 5\.10\./)
    assert.ok(result.messages.at(-1) instanceof AIMessage)
    assert.equal(result.messages.at(-1)?.text, result.output)
})

test('fluxo completo: consulta de endereço', async (t) => {
    mockClassifier(t, 'consultar_endereco')
    mockFetchJson(t, {
        logradouro: 'Avenida Paulista',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP'
    })

    const graph = buildGraph()
    const result = await graph.invoke(
        { messages: [new HumanMessage('qual o endereço do cep 01310-100?')], output: '', command: 'unknown' },
        invokeConfig('endereco')
    )

    assert.equal(result.command, 'consultar_endereco')
    assert.equal(result.endereco?.localidade, 'São Paulo')
    assert.match(result.output, /^Endereço encontrado: Avenida Paulista, Bela Vista, São Paulo - SP\./)
    assert.ok(result.messages.at(-1) instanceof AIMessage)
    assert.equal(result.messages.at(-1)?.text, result.output)
})

test('fluxo completo: abertura de chamado', async (t) => {
    mockClassifier(t, 'abrir_chamado')

    const graph = buildGraph()
    const result = await graph.invoke(
        { messages: [new HumanMessage('meu sistema não funciona')], output: '', command: 'unknown' },
        invokeConfig('chamado')
    )

    assert.equal(result.command, 'abrir_chamado')
    assert.match(result.ticketId ?? '', /^TCK-\d{4}$/)
    assert.ok(result.output.includes(result.ticketId!))
    assert.ok(result.messages.at(-1) instanceof AIMessage)
    assert.equal(result.messages.at(-1)?.text, result.output)
})

test('fluxo completo: intenção não reconhecida cai no fallback', async (t) => {
    mockClassifier(t, 'unknown')

    const graph = buildGraph()
    const result = await graph.invoke(
        { messages: [new HumanMessage('bom dia')], output: '', command: 'unknown' },
        invokeConfig('fallback')
    )

    assert.equal(result.command, 'unknown')
    assert.equal(result.ticketId, undefined)
    assert.equal(
        result.output,
        'Não foi possivel identificar a sua inteção por favor tente novamente.'
    )
    assert.ok(result.messages.at(-1) instanceof AIMessage)
})
