import { type GraphState } from '../graph.ts'

export function abrirChamadoNode(state: GraphState): GraphState {
    // aqui, num agente real, você chamaria a API do GLPI/Jira/etc
    //  — igual você fez na SJAM

    const ticketId = `TCK-${Math.floor(Math.random() * 900 + 1000)}`

    return {
        ...state,
        ticketId,
        output: `Entendi seu problema. Abri o chamado #${ticketId} e nosso time vai te retornar em breve.`
    }

}