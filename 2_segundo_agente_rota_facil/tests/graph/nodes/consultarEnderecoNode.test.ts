import { test } from 'node:test'
import assert from 'node:assert/strict'
import { consultarEnderecoNode } from '../../../src/graph/nodes/consultarEnderecoNode.ts'
import type { GraphState } from '../../../src/graph/graph.ts'

function baseState(output: string): GraphState {
    return {
        messages: [],
        output,
        command: 'consultar_endereco'
    }
}

function mockFetchJson(t: any, data: unknown) {
    t.mock.method(globalThis, 'fetch', async () => ({
        json: async () => data
    }))
}

test('consultarEnderecoNode retorna mensagem de CEP inválido quando não há CEP no texto', async () => {
    const result = await consultarEnderecoNode(baseState('não tenho CEP nenhum aqui'))

    assert.equal(result.output, 'Esse CEP parece inválido, pode confirmar? Preciso de 8 números, ex.: 01310-100.')
})

test('consultarEnderecoNode retorna mensagem de não encontrado quando a API retorna erro', async (t) => {
    mockFetchJson(t, { erro: true })

    const result = await consultarEnderecoNode(baseState('qual o cep 00000-000'))

    assert.equal(result.output, 'Não encontrei nenhum endereço para o CEP 00000000.')
})

test('consultarEnderecoNode calcula frete sem acréscimo em dia de semana', async (t) => {
    t.mock.timers.enable({ apis: ['Date'] })
    t.mock.timers.setTime(new Date('2026-09-09T12:00:00').getTime()) // quarta-feira

    const endereco = {
        logradouro: 'Avenida Paulista',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP'
    }
    mockFetchJson(t, endereco)

    const result = await consultarEnderecoNode(baseState('meu cep é 01310-100'))

    assert.deepEqual(result.endereco, endereco)
    assert.equal(
        result.output,
        'Endereço encontrado: Avenida Paulista, Bela Vista, São Paulo - SP. Frete estimado: R$ 43.00'
    )
})

test('consultarEnderecoNode calcula frete com acréscimo de 20% em fim de semana', async (t) => {
    t.mock.timers.enable({ apis: ['Date'] })
    t.mock.timers.setTime(new Date('2026-09-13T12:00:00').getTime()) // domingo

    mockFetchJson(t, {
        logradouro: 'Avenida Paulista',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP'
    })

    const result = await consultarEnderecoNode(baseState('meu cep é 01310-100'))

    assert.equal(
        result.output,
        'Endereço encontrado: Avenida Paulista, Bela Vista, São Paulo - SP. Frete estimado: R$ 51.60 (com acréscimo de 20% por ser fim de semana).'
    )
})
