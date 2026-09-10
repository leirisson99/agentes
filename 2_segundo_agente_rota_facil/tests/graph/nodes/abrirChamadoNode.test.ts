import { test } from 'node:test'
import assert from 'node:assert/strict'
import { abrirChamadoNode } from '../../../src/graph/nodes/abrirChamadoNode.ts'
import type { GraphState } from '../../../src/graph/graph.ts'

function baseState(overrides: Partial<GraphState> = {}): GraphState {
    return {
        messages: [],
        output: '',
        command: 'abrir_chamado',
        ...overrides
    }
}

test('abrirChamadoNode gera um ticketId no formato TCK-XXXX', () => {
    const result = abrirChamadoNode(baseState())

    assert.match(result.ticketId ?? '', /^TCK-\d{4}$/)
})

test('abrirChamadoNode inclui o ticketId gerado na mensagem de output', () => {
    const result = abrirChamadoNode(baseState())

    assert.ok(result.output.includes(result.ticketId!))
    assert.equal(
        result.output,
        `Abri o chamado #${result.ticketId}. Nosso time vai te retornar em breve.`
    )
})

test('abrirChamadoNode não adiciona contexto quando não há previousCommand', () => {
    const result = abrirChamadoNode(baseState())

    assert.ok(!result.output.includes('relacionado a'))
})

test('abrirChamadoNode não adiciona contexto quando previousCommand já era abrir_chamado', () => {
    const result = abrirChamadoNode(baseState({ previousCommand: 'abrir_chamado' }))

    assert.ok(!result.output.includes('relacionado a'))
})

test('abrirChamadoNode adiciona contexto de consulta de cotação quando vem de consultar_cotacao', () => {
    const result = abrirChamadoNode(baseState({ previousCommand: 'consultar_cotacao' }))

    assert.equal(
        result.output,
        `Abri o chamado #${result.ticketId} (relacionado a uma consulta de cotação). Nosso time vai te retornar em breve.`
    )
})

test('abrirChamadoNode adiciona contexto de consulta de endereço quando vem de consultar_endereco', () => {
    const result = abrirChamadoNode(baseState({ previousCommand: 'consultar_endereco' }))

    assert.equal(
        result.output,
        `Abri o chamado #${result.ticketId} (relacionado a uma consulta de endereço). Nosso time vai te retornar em breve.`
    )
})

test('abrirChamadoNode adiciona contexto de mensagem não identificada quando vem de unknown', () => {
    const result = abrirChamadoNode(baseState({ previousCommand: 'unknown' }))

    assert.equal(
        result.output,
        `Abri o chamado #${result.ticketId} (relacionado a uma mensagem não identificada). Nosso time vai te retornar em breve.`
    )
})

test('abrirChamadoNode preserva as demais propriedades do estado', () => {
    const input = baseState({ cotacao: 5.5 })
    const result = abrirChamadoNode(input)

    assert.equal(result.messages, input.messages)
    assert.equal(result.command, 'abrir_chamado')
    assert.equal(result.cotacao, 5.5)
})
