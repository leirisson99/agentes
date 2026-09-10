import { type GraphState } from "../graph.ts"


function extrairCEP(texto: string) {
    const match = texto.match(/\d{5}-?\d{3}/)
    if (!match) return null
    return match[0].replace("-", "")
}


export async function consultarEnderecoNode(state: GraphState): Promise<GraphState> {
    const cep = extrairCEP(state.output)
    if (!cep || cep.length != 8) {
        return {
            ...state,
            output: "Esse CEP parece inválido, pode confirmar? Preciso de 8 números, ex.: 01310-100."
        }
    }

    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data: any = await response.json()


    if (data.erro) {
        return {
            ...state,
            output: `Não encontrei nenhum endereço para o CEP ${cep}.`
        }
    }

    const freteBase = 25 + data.localidade.length * 2
    const hoje = new Date().getDay()
    const ehFinalDeSemana = hoje === 0 || hoje === 6
    const frete = ehFinalDeSemana ? freteBase * 1.2 : freteBase

    let texto = `Endereço encontrado: ${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}. Frete estimado: R$ ${frete.toFixed(2)}`
    if(ehFinalDeSemana){
           texto += " (com acréscimo de 20% por ser fim de semana)."
    }

    return {
        ...state,
        endereco: data,
        output: texto
    }
}