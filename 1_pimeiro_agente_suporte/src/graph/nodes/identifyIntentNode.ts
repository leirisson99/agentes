import { type GraphState } from '../graph.ts'

export function identifyIntentNode(state: GraphState): GraphState {
    const input = state.messsages.at(-1)?.text ?? ""
    const lower = input.toLocaleLowerCase()

    let command: GraphState["command"] = "unknown"

    if (/chamado|problema|erro|não funciona|abrir/.test(lower)) {
        command = "abrirChamado"
    } else if (/como|o que é|dúvida|pergunta|qual/.test(lower)) {
        command = "duvidaGeral"
    }

    return {
        ...state,
        command,
        output: input
    }

}