import { type GraphState } from '../graph.ts'


const TETO_ALERTA = 6.0

export async function consultarCotacaoNode(state: GraphState): Promise<GraphState> {

    const response = await fetch("https://economia.awesomeapi.com.br/json/last/USD-BRL")
    const data: any = await response.json()

    const bid = parseFloat(data.USDBRL.bid)



    if (isNaN(bid)) {
        return {
            ...state,
            output: "Não consegui consultar a cotação agora, tenta novamente em instantes."
        }
    }

    const acimaDoTeto = bid > TETO_ALERTA
    let texto = `A cotação atual do dólar é R$ ${bid.toFixed(2)}.`;
    if (acimaDoTeto) {
        texto += " Atenção: cotação acima do teto — o preço da importação pode sofrer reajuste.";
    }


    return {
        ...state,
        cotacao: bid,
        output: texto

    }
}