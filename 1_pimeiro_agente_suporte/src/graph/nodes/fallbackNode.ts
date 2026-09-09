import { type GraphState } from "../graph.ts";

export function fallbackNode(state: GraphState): GraphState {
    return {
        ...state,
        output: "Não entendi se você quer abrir um chamado ou tirar uma dúvida. Pode reformular?"
    }
}