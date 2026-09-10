import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HumanMessage } from '@langchain/core/messages'
import { buildSystemPrompt, classifier, identifyIntent } from '../../../src/graph/nodes/identifyIntentNode.ts'
import type { GraphState } from '../../../src/graph/graph.ts'

test('buildSystemPrompt monta o prompt com categorias e exemplos do JSON', () => {
    const prompt = buildSystemPrompt()

    assert.match(prompt, /Categorias possíveis:/)
    assert.match(prompt, /consultar_endereco: Usuário quer saber o endereço a partir de um CEP/)
    assert.match(prompt, /Exemplos:/)
    assert.match(prompt, /qual o cep 01310-100/)
})

test('identifyIntent retorna o command identificado pelo classifier', async (t) => {
    t.mock.method(classifier, 'invoke', async () => ({ command: 'consultar_cotacao' as const }))

    const state: GraphState = {
        messages: [new HumanMessage('quanto tá o dólar hoje')],
        output: '',
        command: 'unknown'
    }

    const result = await identifyIntent(state)

    assert.equal(result.command, 'consultar_cotacao')
    assert.equal(result.output, 'quanto tá o dólar hoje')
})

test('identifyIntent usa string vazia quando não há mensagens no estado', async (t) => {
    t.mock.method(classifier, 'invoke', async (messages: any[]) => {
        assert.equal(messages[1].content, '')
        return { command: 'unknown' as const }
    })

    const state: GraphState = {
        messages: [],
        output: '',
        command: 'unknown'
    }

    const result = await identifyIntent(state)

    assert.equal(result.command, 'unknown')
    assert.equal(result.output, '')
})
