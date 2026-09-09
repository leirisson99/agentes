import { test } from "node:test"
import assert from "node:assert/strict"
import { HumanMessage } from "langchain"
import { abrirChamadoNode } from "../src/graph/nodes/abrirChamadoNode.ts"
import { type GraphState } from "../src/graph/graph.ts"

function baseState(): GraphState {
    return {
        messsages: [new HumanMessage("meu sistema não funciona")],
        output: "",
        command: "abrirChamado"
    }
}

test("gera um ticketId no formato TCK-XXXX", () => {
    const state = abrirChamadoNode(baseState())
    assert.match(state.ticketId ?? "", /^TCK-\d{4}$/)
})

test("inclui o ticketId gerado na mensagem de output", () => {
    const state = abrirChamadoNode(baseState())
    assert.ok(state.output.includes(state.ticketId!))
})

test("preserva as demais propriedades do estado", () => {
    const input = baseState()
    const state = abrirChamadoNode(input)
    assert.equal(state.messsages, input.messsages)
    assert.equal(state.command, "abrirChamado")
})
