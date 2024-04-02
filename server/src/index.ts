import express from "express";
import cors from "cors";
import multer from "multer";
import {
  getBingeTexterAlerts,
  getEarlyBirdVsNightOwl,
  // getEmojiMoodRing,
  // getMonologueMaster,
  getSerialConversationalist,
  getTextsSentToday,
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
    const numTextsToday = await getTextsSentToday(db);
    const bingeTexts = await getBingeTexterAlerts(db);
    const serialConversationalist = await getSerialConversationalist(db);
    const earlyBirdVsNightOwl = await getEarlyBirdVsNightOwl(db);
    // const monologueMaster = await getMonologueMaster(db);
    // const emojiMoodRing = await getEmojiMoodRing(db);

    res.json({
      numTextsToday,
      // bingeTexts,
      // serialConversationalist,
      // earlyBirdVsNightOwl,
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

    res.json(qualitativeAnalysis);
  } catch (error) {
    console.error("Error processing database:", error);
    res.status(500).send("Error processing database");
  }
});

app.post("/api/test/qual", (req, res) => {
  res.json({
    roasts: [
      "You're the kind of person who thinks 'seen' is a complete response.",
      "Your emoji game is so outdated, even your phone is embarrassed to suggest them.",
      "If ghosting were an Olympic sport, you'd have more golds than Michael Phelps.",
      "Your idea of a deep conversation is sending GIFs back and forth until one of you falls asleep.",
      "You text like you're still paying by the character. It's 2023, not 2003.",
    ],
  });
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
