import { test } from "node:test"
import assert from "node:assert/strict"
import { AIMessage, HumanMessage } from "langchain"
import { buildGraph } from "../src/graph/graph.ts"

test("fluxo completo: mensagem de problema abre chamado", async () => {
    const graph = buildGraph()
    const result = await graph.invoke({
        messsages: [new HumanMessage("meu sistema não funciona, dá erro")],
        output: "",
        command: "unknown"
    })

    assert.equal(result.command, "abrirChamado")
    assert.match(result.ticketId ?? "", /^TCK-\d{4}$/)
    assert.ok(result.output.includes(result.ticketId!))
    assert.ok(result.messsages.at(-1) instanceof AIMessage)
    assert.equal(result.messsages.at(-1)?.text, result.output)
})

test("fluxo completo: mensagem não reconhecida cai no fallback", async () => {
    const graph = buildGraph()
    const result = await graph.invoke({
        messsages: [new HumanMessage("bom dia")],
        output: "",
        command: "unknown"
    })

    assert.equal(result.command, "unknown")
    assert.equal(result.ticketId, undefined)
    assert.equal(
        result.output,
        "Não entendi se você quer abrir um chamado ou tirar uma dúvida. Pode reformular?"
    )
    assert.ok(result.messsages.at(-1) instanceof AIMessage)
})
