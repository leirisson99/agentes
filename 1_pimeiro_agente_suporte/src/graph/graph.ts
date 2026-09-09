import { z } from "zod"
import { withLangGraph } from '@langchain/langgraph/zod'
import { END, MessagesZodMeta, START, StateGraph, StateSchema } from '@langchain/langgraph'
import { type BaseMessage } from "langchain"
import { identifyIntentNode } from "./nodes/identifyIntentNode.ts"
import { abrirChamadoNode } from "./nodes/abrirChamadoNode.ts"
import { duvidaGeralNode } from "./nodes/duvidaGeralNode.ts"
import { fallbackNode } from "./nodes/fallbackNode.ts"
import { chatResponseNode } from "./nodes/chatResponseNode.ts"

const GrapState = z.object({
    messsages: withLangGraph(z.custom<BaseMessage[]>(), MessagesZodMeta),
    output: z.string(),
    command: z.enum(['abrirChamado',"duvidaGeral", 'consultarStatus', 'unknown']),
    ticketId: z.string().optional() // usado só na consulta de status
})


export type GraphState = z.infer<typeof GrapState>

export function buildGraph(){
    const workflow = new StateGraph({
        stateSchema: GrapState
    })
    .addNode("identifyIntent", identifyIntentNode)
    .addNode("abrirChamado", abrirChamadoNode)
    .addNode("duvidaGeral", duvidaGeralNode)
    .addNode("fallback", fallbackNode)
    .addNode("chatResponse", chatResponseNode)

    .addEdge(START, "identifyIntent")
    .addConditionalEdges(
        "identifyIntent",
        (state: GraphState) => {
            switch(state.command){
                case "abrirChamado": return 'abrirChamado'
                case 'duvidaGeral' : return 'duvidaGeral'
                default: return 'fallback'
            }
        },
        {
            abrirChamado: 'abrirChamado',
            duvidaGeral: 'duvidaGeral',
            fallback: "fallback"
        }
    )
    .addEdge("abrirChamado", "chatResponse")
    .addEdge("duvidaGeral", "chatResponse")
    .addEdge("fallback", "chatResponse")
    .addEdge("chatResponse", END)

    return workflow.compile()
}