import dotenv from "dotenv";
dotenv.config();
import { inicializaModelo } from "./modelo.js";
import { GoogleAIFileManager } from "@google/generative-ai/server"; 
import { FileState } from "@google/generative-ai/server"; 

const model = await inicializaModelo("gemini-1.5-flash");

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  
export async function categorizador(){
    const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);

    const uploadResult = await fileManager.uploadFile(`./a11.txt`, {
        mimeType: "text/plain",
        displayName: "Italia",
    });

    // Polling getFile to check processing complete
    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === FileState.PROCESSING) {
        process.stdout.write(".");
        // Sleep for 10 seconds
        await new Promise((resolve) => setTimeout(resolve, 10_000));
        // Fetch the file from the API again
        file = await fileManager.getFile(uploadResult.file.name);
    }
    if (file.state === FileState.FAILED) {
        throw new Error("Audio processing failed.");
    }

    const result = await model.generateContent([
    `Analise as opiniões descritas em sequência e resuma os pontos positivos e negativos citados pelos clientes sobre esses destinos. Depois, categorize o percentual de respostas em satisfeito, insatisfeitos ou neutros, colocando no seguinte formato, por exemplo:  
    Satisfeitos: 20% - 20 respostas 
    Insatisfeitos: 50% - 50 respostas
    Neutros: 30% - 30 respostas 
    O total de respostas deve coincidir com o total de opiniões lidas. 
    Responda somente o resultado final e não a leitura das opiniões.
    Opiniões:`,
    {
        fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
        },
    },
    ]);
    console.log(result.response.text());

}

//categorizador().catch(console.error);