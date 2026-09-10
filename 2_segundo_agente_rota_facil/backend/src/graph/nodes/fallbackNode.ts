import { type GraphState } from "../graph.ts";




export function fallbackNode(state: GraphState): GraphState {
    return {
        ...state,
        output: "Não foi possivel identificar a sua inteção por favor tente novamente."
    }
}