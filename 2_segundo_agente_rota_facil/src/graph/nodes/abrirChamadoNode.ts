import { type GraphState } from "../graph.ts";




export function abrirChamadoNode(state: GraphState): GraphState {
    const ticketId = `TCK-${Math.floor(Math.random() * 900 + 1000)}`

    let contexto = ""
    if (state.previousCommand && state.previousCommand !== "abrir_chamado") {
        const origem: Record<string, string> = {
            consultar_endereco: "uma consulta de endereço",
            consultar_cotacao: "uma consulta de cotação",
            unknown: "uma mensagem não identificada",
        }
        contexto = ` (relacionado a ${origem[state.previousCommand] ?? "um atendimento anterior"})`
    }
    return {
        ...state,
        ticketId,
        output: `Abri o chamado #${ticketId}${contexto}. Nosso time vai te retornar em breve.`
    };
}