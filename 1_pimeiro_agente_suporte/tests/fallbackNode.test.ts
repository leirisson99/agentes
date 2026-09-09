import { test } from "node:test"
import assert from "node:assert/strict"
import { HumanMessage } from "langchain"
import { fallbackNode } from "../src/graph/nodes/fallbackNode.ts"
import { type GraphState } from "../src/graph/graph.ts"

function baseState(): GraphState {
    return {
        messsages: [new HumanMessage("bom dia")],
        output: "",
        command: "unknown"
    }
}

test("retorna mensagem padrão pedindo para reformular", () => {
    const state = fallbackNode(baseState())
    assert.equal(
        state.output,
        "Não entendi se você quer abrir um chamado ou tirar uma dúvida. Pode reformular?"
    )
})

test("preserva as demais propriedades do estado", () => {
    const input = baseState()
    const state = fallbackNode(input)
    assert.equal(state.messsages, input.messsages)
    assert.equal(state.command, "unknown")
})
