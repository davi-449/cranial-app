const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inicializa o cliente da API GenAI com a chave de API do ambiente
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Obtém o modelo generativo Gemini 1.5
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Função para enviar mensagens ao modelo Gemini
export const sendMessageToGemini = async (message: string) => {
  try {
    // Faz a chamada ao modelo Gemini
    const response = await model.generateMessage({
      prompt: {
        messages: [
          {
            author: "user",
            content: message,
          },
        ],
      },
    });

    // Retorna o texto gerado pelo modelo
    return response.candidates[0].content; // Certifique-se de que este campo existe na resposta
  } catch (error) {
    console.error("Erro ao se comunicar com a API GenAI:", error);
    throw error;
  }
};