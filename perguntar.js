import dotenv from "dotenv";
dotenv.config();
import { inicializaModelo } from "./modelo.js";
import { fazerPergunta } from "./pergunta.js";

const model = await inicializaModelo("gemini-1.5-flash");

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

export async function perguntar(){
    
    const chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              {text: "Me fale sobre a média histórica do valor do feijão no brasil"},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "Como especialista financeiro focado no mercado de TI, não possuo informações sobre o mercado de feijão.  Meu conhecimento e foco se restringem a dados e análises do setor de tecnologia. Não devo perder tempo com outros assuntos.\n"},
            ],
          },
          {
            role: "user",
            parts: [
              {text: "me fale sobre a média histórico dos custos com ti no mercado em geral"},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "Determinar uma média histórica *precisa* dos custos com TI em geral é complexo devido à grande variabilidade entre setores, portes de empresas e metodologias de cálculo.  No entanto, posso apresentar alguns dados e tendências observadas:\n\n**Considerações importantes que afetam a média:**\n\n* **Setor:**  Setores como serviços financeiros, telecomunicações e tecnologia investem uma porcentagem maior da receita em TI comparado a setores como manufatura ou agricultura.\n* **Tamanho da Empresa:**  Grandes empresas tendem a ter custos de TI absolutos maiores, mas proporcionalmente à receita, empresas menores podem investir mais em tecnologia em fases de crescimento.\n* **Investimento vs. Despesa:**  Classificar gastos com TI como investimento (CAPEX) ou despesa operacional (OPEX) influencia a análise dos custos e o retorno sobre o investimento.\n* **Nuvem vs. On-Premise:** A migração para a nuvem alterou a estrutura de custos de TI, mudando de custos fixos (hardware, licenças) para custos variáveis (assinaturas).\n\n**Dados e Tendências:**\n\n| Métrica | Observações |\n|---|---|\n| **% da Receita:** |  Em geral, empresas alocam entre 3% a 6% da receita para TI, podendo chegar a 10% ou mais em setores intensivos em tecnologia. |\n| **Custo por Funcionário:** |  Esta métrica varia amplamente, mas pode servir como referência interna.  Estima-se uma média entre \\$5.000 a \\$20.000 por funcionário por ano, dependendo do nível de tecnologia utilizada. |\n| **Tendência de Crescimento:** | Os gastos com TI tendem a crescer, impulsionados por transformação digital, segurança cibernética e  adoção de novas tecnologias.  A  taxa de crescimento varia a cada ano, mas a tendência é ascendente. |\n\n\n**Recomendação:**\n\nPara uma análise mais precisa dos custos com TI no *seu* mercado específico, é recomendado consultar pesquisas e relatórios setoriais, além de realizar um benchmarking com empresas similares.\n"},
            ],
          },
        ],
      });

    let categorias = await fazerPergunta("Me fale as áreas da ti que você quer saber: ");
    let prompt = await fazerPergunta("Me fale sobre o que você quer aprender sobre finanças da TI: ");
    
    const result = await chatSession.sendMessage(`${categorias} ${prompt}`);
    console.log(result.response.text());
}

perguntar().catch(console.error);