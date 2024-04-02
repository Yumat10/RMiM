import axios from "axios";
import { Database } from "sql.js";
import { ANALYSIS_PROMPT } from "./llmPrompts";
import { MODEL_NAME } from "../../../main/helpers/startOllama";

const OLLAMA_ORIGIN = "http://127.0.0.1:11435";

export async function askMistral(db: Database): Promise<any> {
  const formattedChatData = await formatChatData(db);

  console.log("---formatChatData---");
  console.log(formattedChatData);

  // return formattedChatData;

  // Chunk the chat data into smaller pieces
  const chatDataChunks = {};
  const chunkSize = 100;
  const chatIds = Object.keys(formattedChatData);
  for (let i = 0; i < chatIds.length; i += chunkSize) {
    const chunkChatIds = chatIds.slice(i, i + chunkSize);
    chatDataChunks[`chunk_${i / chunkSize}`] = chunkChatIds.map(
      (chatId) => formattedChatData[chatId]
    );
  }

  // return Object.keys(chatDataChunks).length;

  let allResponses = [];
  let index = 0; // Initialize index to keep track of iterations
  for (const chunkId in chatDataChunks) {
    try {
      const chunk = chatDataChunks[chunkId];
      const response = await axios.post(`${OLLAMA_ORIGIN}/api/generate`, {
        model: MODEL_NAME,
        // messages: [
        //   {
        //     role: "system",
        //     content: ANALYSIS_PROMPT,
        //   },
        // ],
        prompt: ANALYSIS_PROMPT + "\n" + JSON.stringify(chunk),
        stream: false,
      });

      if (response.data && response.data.response) {
        allResponses.push(response.data.response);
      }
      console.log(
        `---------------- ${
          index / Object.keys(chatDataChunks).length
        } ----------------`
      ); // Use index for logging
      index++; // Increment index after each successful iteration
    } catch (error) {
      console.error(`Error generating for chunkId ${chunkId}:`, error);
      // Optionally, handle the error, e.g., by continuing with the next chunk
      continue;
    }
  }

  return allResponses;
  // return formattedChatData;

  try {
    const response = await axios.post(`${OLLAMA_ORIGIN}/api/generate`, {
      model: MODEL_NAME,
      messages: [
        {
          role: "system",
          content: ANALYSIS_PROMPT,
        },
      ],
      prompt: JSON.stringify(formattedChatData),
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
  SELECT
    chat."ROWID" as chat_id,
    datetime(message.date / 1000000000 + strftime("%s", "2001-01-01"), "unixepoch", "localtime") AS message_date,
    message.text,
    message.is_from_me
  FROM
    chat
    JOIN chat_message_join ON chat."ROWID" = chat_message_join.chat_id
    JOIN message ON chat_message_join.message_id = message."ROWID"
  WHERE
    datetime(message.date / 1000000000 + strftime("%s", "2001-01-01"), "unixepoch") >= datetime('now', '-1 month')
  ORDER BY
    chat_id, message_date ASC;`;
  const result = db.exec(query);

  if (result.length > 0) {
    const values = result[0].values;
    const groupedMessages = values.reduce((acc, message) => {
      const [chatId, messageDate, text, isFromMe] = message;
      if (!text) {
        return acc;
      }
      const chatIdStr = chatId.toString(); // Convert Uint8Array to string
      if (!acc[chatIdStr]) {
        acc[chatIdStr] = [];
      }
      acc[chatIdStr].push({ messageDate, text, isFromMe });
      return acc;
    }, {});
    return groupedMessages;
  }

  return {};
}
