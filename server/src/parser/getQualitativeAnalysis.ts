import axios from "axios";

const OLLAMA_ORIGIN = "http://localhost:11435";

export async function askMistral(): Promise<string> {
  try {
    const response = await axios.post(`${OLLAMA_ORIGIN}/api/chat`, {
      model: "mistral",
      messages: [{ role: "user", content: "Hello Mistral!" }],
    });
    return response.data;
  } catch (error) {
    console.error("Error asking Mistral:", error);
    throw error;
  }
}
