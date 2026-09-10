import { z } from 'zod'
import { withLangGraph } from '@langchain/langgraph/zod'
import { MemorySaver, MessagesZodMeta, StateGraph } from "@langchain/langgraph"
import { BaseMessage } from '@langchain/core/messages'


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

    // nodes da aplicação


    // guarda em memória — em produção seria Postgres/Redis
    const checkpointer = new MemorySaver()

    return workFlow.compile({ checkpointer })

}

