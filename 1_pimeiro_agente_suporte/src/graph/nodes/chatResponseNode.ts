import { AIMessage } from "langchain"
import { type GraphState } from "../graph.ts"

export function chatResponseNode(state: GraphState): GraphState {
    return {
        ...state,
        messsages: [
            ...state.messsages,
            new AIMessage(state.output)
        ]
    }
}