import { AIMessage } from "langchain";
import { type GraphState } from "../graph.ts";




export function chatResponseNode(state: GraphState): GraphState {
    return {
        ...state,
        messages: [
            ...state.messages,
            new AIMessage(state.output)
        ]
    }
}