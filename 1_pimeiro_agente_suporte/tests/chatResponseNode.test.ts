import { test } from "node:test"
import assert from "node:assert/strict"
import { AIMessage, HumanMessage } from "langchain"
import { chatResponseNode } from "../src/graph/nodes/chatResponseNode.ts"
import { type GraphState } from "../src/graph/graph.ts"

function baseState(): GraphState {
    return {
        messsages: [new HumanMessage("como funciona o suporte?")],
        output: "O suporte funciona 24h.",
        command: "duvidaGeral"
    }
}

test("adiciona uma AIMessage com o output ao histórico", () => {
    const input = baseState()
    const state = chatResponseNode(input)

    assert.equal(state.messsages.length, 2)
    assert.ok(state.messsages.at(-1) instanceof AIMessage)
    assert.equal(state.messsages.at(-1)?.text, input.output)
})

test("mantém as mensagens anteriores intactas", () => {
    const input = baseState()
    const state = chatResponseNode(input)

    assert.equal(state.messsages[0], input.messsages[0])
})
