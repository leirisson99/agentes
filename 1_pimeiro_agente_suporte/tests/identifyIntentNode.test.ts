import { test } from "node:test"
import assert from "node:assert/strict"
import { HumanMessage } from "langchain"
import { identifyIntentNode } from "../src/graph/nodes/identifyIntentNode.ts"
import { type GraphState } from "../src/graph/graph.ts"

function baseState(text: string): GraphState {
    return {
        messsages: [new HumanMessage(text)],
        output: "",
        command: "unknown"
    }
}

test("identifica intenção de abrir chamado", () => {
    const state = identifyIntentNode(baseState("meu sistema não funciona, dá erro"))
    assert.equal(state.command, "abrirChamado")
})

test("identifica intenção de dúvida geral", () => {
    const state = identifyIntentNode(baseState("como eu resetar minha senha?"))
    assert.equal(state.command, "duvidaGeral")
})

test("retorna unknown quando não reconhece a intenção", () => {
    const state = identifyIntentNode(baseState("bom dia"))
    assert.equal(state.command, "unknown")
})

test("copia o texto da última mensagem para output", () => {
    const state = identifyIntentNode(baseState("Qual o horário de atendimento?"))
    assert.equal(state.output, "Qual o horário de atendimento?")
})

test("é case-insensitive ao identificar a intenção", () => {
    const state = identifyIntentNode(baseState("ABRIR CHAMADO urgente"))
    assert.equal(state.command, "abrirChamado")
})
