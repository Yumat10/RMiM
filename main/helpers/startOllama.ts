import { spawn } from "child_process";

export const MODEL_NAME:
  | "mistral"
  | "llama2"
  | "llama2-uncensored"
  | "dolphin-mixtral" = "llama2";

const OLLAMA_PORT = "11437";
// Todo: Include natively in project
const ollamaExecutable = `OLLAMA_HOST=127.0.0.1:${OLLAMA_PORT} ollama`;

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { shell: true, stdio: "inherit" });
    process.on("error", reject);
    process.on("exit", (code) =>
      code === 0 ? resolve(code) : reject(new Error(`Exited with code ${code}`))
    );
  });
}

export async function startOllama() {
  console.log("---runOllamaApp---");
  try {
    const killCommand = `lsof -ti :${OLLAMA_PORT} | xargs kill -9`;
    console.log(`Attempting to kill process on port 127.0.0.1${OLLAMA_PORT}`);
    await runCommand(killCommand, []);
    console.log(`Process on port 127.0.0.1${OLLAMA_PORT} killed successfully.`);
    // const ollama = new Ollama({ host: `http://localhost:${OLLAMA_PORT}` });

    // Start Ollama app
    await runCommand(ollamaExecutable, ["serve"]);
    console.log("Ollama app started successfully.");

    // Pull model
    await runCommand(ollamaExecutable, ["pull", MODEL_NAME]);
    console.log(`${MODEL_NAME} model pulled successfully.`);

    // Run model
    await runCommand(ollamaExecutable, ["run", MODEL_NAME]);
    console.log(`${MODEL_NAME} model is running.`);
    console.log("Ollama started successfully.");
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}
