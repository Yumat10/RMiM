import { spawn } from "child_process";

const ollamaPort = "11435";
// Todo: Include natively in project
const ollamaExecutable = `OLLAMA_HOST=127.0.0.1:${ollamaPort} ollama`;

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
    const killCommand = `lsof -ti :${ollamaPort} | xargs kill -9`;
    console.log(`Attempting to kill process on port 127.0.0.1${ollamaPort}`);
    await runCommand(killCommand, []);
    console.log(`Process on port 127.0.0.1${ollamaPort} killed successfully.`);

    // Start Ollama app
    await runCommand(ollamaExecutable, ["serve"]);
    console.log("Ollama started successfully.");

    // Pull Mistral model
    await runCommand(ollamaExecutable, ["pull", "mistral"]);
    console.log("Mistral model pulled successfully.");

    // Run Mistral model
    await runCommand(ollamaExecutable, ["run", "mistral"]);
    console.log("Mistral model is running.");
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}
