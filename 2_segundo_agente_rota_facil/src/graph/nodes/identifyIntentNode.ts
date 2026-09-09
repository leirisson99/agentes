import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from "node:path"
import { ChatOpenAI } from "@langchain/openai"
import { z } from "zod"
import { type GraphState } from '../graph'


const __dirname = path.dirname(fileURLToPath(import.meta.url))

// futuramente deve ser tipado o modelo do prompt
const promptConfig = JSON.parse(
    readFileSync(path.join(
        __dirname,
        "../..prompt//identifyIntent.prompt.json"
    ), "utf-8"))

function buildSystemPrompt(): string {
    const { task, categories, exemples } = promptConfig
    const categoriesText = categories
        .map((c: any) => `${c.id}: ${c.description}`)
        .join("\n")

    const examplesText = exemples
        .map((e: any) => `Entrada: "${e.input}" → ${JSON.stringify(e.output)}`)
        .join('\n')

    return `${task}\n\nCategorias possíveis:\n${categoriesText}\n\nExemplos:\n${examplesText}`;
}

const IntentSchema = z.object({
    command: z.enum(["consultar_endereco", "consultar_cotacao", "abrir_chamado", "unknown"])
});

const baseModel = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    apiKey: process.env.OPENROUTER_API_KEY,
    configuration: { baseURL: "https://openrouter.ai/api/v1" }
})

const classifier = baseModel.withStructuredOutput(IntentSchema)

export async function identifyIntent(state: GraphState): Promise<GraphState> {
    const input = state.messages.at(-1)?.text ?? ""

    const result = await classifier.invoke([
        { role: "system", content: buildSystemPrompt() },
        { role: "human", content: input }
    ])

    return {
        ...state,
        command: result.command,
        output: input
    }
}