import dotenv from "dotenv";
dotenv.config();
import { inicializaModelo } from "./modelo.js";
import { fazerPergunta } from "./pergunta.js";
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

  
export async function processImagem(){
    
    const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY);

    const uploadResult = await fileManager.uploadFile(
        `./Captura.png`,
        {
            mimeType: "image/png",
            displayName: "Captura de tela",
        },
    );

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

    let prompt = await fazerPergunta("Me fale o que deseja saber sobre a imagem e qual o formato devo retornar: ");

    const result = await model.generateContent([
        `${prompt}`,
        {
            fileData: {
            fileUri: uploadResult.file.uri,
            mimeType: uploadResult.file.mimeType,
            },
        },
    ]);
    console.log(result.response.text());

}

//processImagem().catch(console.error);