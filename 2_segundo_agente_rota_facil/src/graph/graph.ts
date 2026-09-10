import { z } from 'zod'
import { withLangGraph } from '@langchain/langgraph/zod'
import { END, MemorySaver, MessagesZodMeta, START, StateGraph } from "@langchain/langgraph"
import { BaseMessage } from '@langchain/core/messages'
import { identifyIntent } from './nodes/identifyIntentNode.ts'
import { consultarEnderecoNode } from './nodes/consultarEnderecoNode.ts'
import { consultarCotacaoNode } from './nodes/consultarCotacaoNode.ts'
import { abrirChamadoNode } from './nodes/abrirChamadoNode.ts'
import { chatResponseNode } from './nodes/chatResponseNode.ts'
import { fallbackNode } from './nodes/fallbackNode.ts'


// criando o estado do Grafo
const GraphState = z.object({
    messages: withLangGraph(z.custom<BaseMessage[]>(), MessagesZodMeta),
    output: z.string(),
    previousCommand: z.enum(['consultar_endereco', 'consultar_cotacao', 'abrir_chamado', 'unknown']).optional(),
    command: z.enum(['consultar_endereco', 'consultar_cotacao', 'abrir_chamado', 'unknown']),
    ticketId: z.string().optional(),
    endereco: z.object({
        logradouro: z.string(),
        bairro: z.string(),
        localidade: z.string(),
        uf: z.string(),
    }).optional(),
    cotacao: z.number().optional()
})


export type GraphState = z.infer<typeof GraphState>


export function buildGraph() {
    const workFlow = new StateGraph({ stateSchema: GraphState })
        .addNode("identifyIntent", identifyIntent)
        .addNode("consultarEndereco", consultarEnderecoNode)
        .addNode("consultarCotacao", consultarCotacaoNode)
        .addNode("abrirChamado", abrirChamadoNode)
        .addNode("fallback", fallbackNode)
        .addNode("chatResponse", chatResponseNode)

        .addEdge(START, "identifyIntent")
        .addConditionalEdges(
            "identifyIntent",
            (state: GraphState) => {
                switch (state.command) {
                    case 'consultar_endereco': return "consultarEndereco"
                    case "consultar_cotacao": return "consultarCotacao"
                    case 'abrir_chamado': return "abrirChamado"
                    default: return 'fallback'
                }
            },
            {
                consultarEndereco: "consultarEndereco",
                consultarCotacao: "consultarCotacao",
                abrirChamado: "abrirChamado",
                fallback: "fallback"
            }
        )
        .addEdge("consultarEndereco", "chatResponse")
        .addEdge("consultarCotacao", "chatResponse")
        .addEdge("abrirChamado", "chatResponse")
        .addEdge("fallback", "chatResponse")
        .addEdge("chatResponse", END)


    // guarda em memória — em produção seria Postgres/Redis
    const checkpointer = new MemorySaver()

    return workFlow.compile({ checkpointer })

}

