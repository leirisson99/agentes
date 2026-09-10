import { test } from 'node:test'
import assert from 'node:assert/strict'
import { AIMessage, HumanMessage } from 'langchain'
import { chatResponseNode } from '../../../src/graph/nodes/chatResponseNode.ts'
import type { GraphState } from '../../../src/graph/graph.ts'

function baseState(): GraphState {
    return {
        messages: [new HumanMessage('como funciona o suporte?')],
        output: 'O suporte funciona 24h.',
        command: 'unknown'
    }
}

test('chatResponseNode adiciona uma AIMessage com o output ao histórico', () => {
    const input = baseState()
    const result = chatResponseNode(input)

    assert.equal(result.messages.length, 2)
    assert.ok(result.messages.at(-1) instanceof AIMessage)
    assert.equal(result.messages.at(-1)?.text, input.output)
})

test('chatResponseNode mantém as mensagens anteriores intactas', () => {
    const input = baseState()
    const result = chatResponseNode(input)

    assert.equal(result.messages[0], input.messages[0])
})

test('chatResponseNode preserva as demais propriedades do estado', () => {
    const input = baseState()
    const result = chatResponseNode(input)

    assert.equal(result.output, input.output)
    assert.equal(result.command, input.command)
})
