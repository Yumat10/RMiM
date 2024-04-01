import express from "express";
import cors from "cors";
import multer from "multer";
import {
  getBingeTexterAlerts,
  getEarlyBirdVsNightOwl,
  // getEmojiMoodRing,
  // getMonologueMaster,
  getSerialConversationalist,
} from "./parser/getQuantitativeAnalysis";
import initSqlJs from "sql.js";
import { askMistral } from "./parser/getQualitativeAnalysis";

const app = express();
const port = 3005; // Choose a port that does not conflict with other services

app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/roast/quant", upload.single("dbFile"), async (req, res) => {
  console.log("---roast quant---");
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const SQL = await initSqlJs();
    const db = new SQL.Database(new Uint8Array(req.file.buffer));
    // Now you can use db.exec(sql) to execute your SQL queries
    // Example: const result = db.exec("SELECT * FROM your_table");
    // Process the result and send a response
    const bingeTexts = await getBingeTexterAlerts(db);
    const serialConversationalist = await getSerialConversationalist(db);
    const earlyBirdVsNightOwl = await getEarlyBirdVsNightOwl(db);
    // const monologueMaster = await getMonologueMaster(db);
    // const emojiMoodRing = await getEmojiMoodRing(db);

    res.json({
      bingeTexts,
      serialConversationalist,
      earlyBirdVsNightOwl,
      // monologueMaster,
      // emojiMoodRing,
    });
  } catch (error) {
    console.error("Error processing database:", error);
    res.status(500).send("Error processing database");
  }
});

app.post("/api/roast/qual", upload.single("dbFile"), async (req, res) => {
  console.log("---roast qual---");
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const SQL = await initSqlJs();
    const db = new SQL.Database(new Uint8Array(req.file.buffer));
    const qualitativeAnalysis = await askMistral(db);

    console.log("---qualitativeAnalysis---");
    console.log(qualitativeAnalysis);

    res.json({
      qualitativeAnalysis,
    });
  } catch (error) {
    console.error("Error processing database:", error);
    res.status(500).send("Error processing database");
  }
});

app.get("/api/custom", (req, res) => {
  res.json({ message: "This is a custom API endpoint" });
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
