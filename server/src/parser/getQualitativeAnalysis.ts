import axios from "axios";
import { Database } from "sql.js";
import { ANALYSIS_PROMPT } from "./llmPrompts";

const OLLAMA_ORIGIN = "http://127.0.0.1:11435";

export async function askMistral(db: Database): Promise<string> {
  const formattedChatData = await formatChatData(db);

  console.log("---formatChatData---");
  console.log(formatChatData);

  try {
    const response = await axios.post(`${OLLAMA_ORIGIN}/api/generate`, {
      model: "mistral:latest",
      messages: [
        {
          role: "system",
          content: ANALYSIS_PROMPT,
        },
      ],
      prompt: formattedChatData,
      stream: false,
    });

    if (response.data) {
      console.log(response.data);
    }

    return response.data.response;
  } catch (error) {
    console.error("Error asking Mistral:", error);
    throw error;
  }
}

async function formatChatData(db: Database) {
  const query = `
    SELECT text, handle_id, datetime(date/1000000000 + strftime('%s', '2001-01-01'), 'unixepoch', 'localtime') as date
    FROM message
    ORDER BY date DESC
    LIMIT 100;`;

  const messages = db.exec(query);

  // Format messages for Mistral
  let formattedMessages = "Here are some notable messaging patterns:\n";
  // Example formatting, adjust based on your analysis and what you want Mistral to generate
  messages[0].values.forEach((message) => {
    const [text, handleId, date] = message;
    formattedMessages += `On ${date}, user ${handleId} said: "${text}"\n`;
  });

  return formattedMessages;
}
