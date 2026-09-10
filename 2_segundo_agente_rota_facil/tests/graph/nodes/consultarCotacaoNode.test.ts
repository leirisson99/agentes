import { test } from 'node:test'
import assert from 'node:assert/strict'
import { consultarCotacaoNode } from '../../../src/graph/nodes/consultarCotacaoNode.ts'
import type { GraphState } from '../../../src/graph/graph.ts'

function baseState(): GraphState {
    return {
        messages: [],
        output: '',
        command: 'consultar_cotacao'
    }
}

function mockFetchJson(t: any, data: unknown) {
    t.mock.method(globalThis, 'fetch', async () => ({
        json: async () => data
    }))
}

test('consultarCotacaoNode retorna cotação e alerta quando acima do teto', async (t) => {
    mockFetchJson(t, { USDBRL: { bid: '6.50' } })

    const result = await consultarCotacaoNode(baseState())

    assert.equal(result.cotacao, 6.5)
    assert.equal(
        result.output,
        'A cotação atual do dólar é R$ 6.50. Atenção: cotação acima do teto — o preço da importação pode sofrer reajuste.'
    )
})

test('consultarCotacaoNode retorna cotação sem alerta quando abaixo do teto', async (t) => {
    mockFetchJson(t, { USDBRL: { bid: '5.25' } })

    const result = await consultarCotacaoNode(baseState())

    assert.equal(result.cotacao, 5.25)
    assert.equal(result.output, 'A cotação atual do dólar é R$ 5.25.')
})

test('consultarCotacaoNode retorna mensagem de erro quando o bid não é um número', async (t) => {
    mockFetchJson(t, { USDBRL: { bid: 'not-a-number' } })

    const result = await consultarCotacaoNode(baseState())

    assert.equal(result.cotacao, undefined)
    assert.equal(result.output, 'Não consegui consultar a cotação agora, tenta novamente em instantes.')
})
