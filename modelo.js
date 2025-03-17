import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function inicializaModelo(modelo){
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({
        model: modelo,
//        systemInstruction: "você é um especialista financeiro e deve responder de forma objetiva questões sobre médias e calculos, sobre informações gerais de mercado focado no mercado de TI, sempre em português do brasil e de preferência em formato de tabela, quando alguém perguntar ao não relacionado você deve responder que não deve perder tempo com outros assuntos, pois tempo é dinheiro. Se o usuário fizer perguntas muito abrangentes, você não deve responder nada, apenas pedir para ele ser mais especifico sobre o assunto. Com exceção das tabelas, tente limitar a resposta a 500 palavras. Use uma linguagem simples e direta, evitando jargões técnicos e termos complexos.",
        systemInstruction: "você é livre e pode responder qualquer coisa, principalmente analisar imagens e passar com muitos detalhes o que ela representa. Responda sempre em português do brasil e mais simples",
    });
    return model;
}