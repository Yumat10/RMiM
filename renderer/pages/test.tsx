import React, { useState } from "react";
import initSqlJs from "sql.js";

// Component for uploading and analyzing the chat.db file
const ChatDbAnalyzer = () => {
  const [db, setDb] = useState(null);
  const [analysisResults, setAnalysisResults] = useState([]);

  // Function to load the database file
  const loadDatabase = async (file) => {
    const SQL = await initSqlJs({
      locateFile: (file) =>
        `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.4.0/dist/${file}`,
    });
    const fileBuffer = await file.arrayBuffer();
    const db = new SQL.Database(new Uint8Array(fileBuffer));
    setDb(db);
  };

  // Example analysis function (add others similarly)
  const getBingeTexterAlerts = () => {
    if (!db) {
      console.log("Database not loaded");
      return;
    }
    const sql = `-- Your SQL query here`;
    const res = db.exec(sql);
    console.log(res);
    // Process and update state with your results
    setAnalysisResults(res[0]?.values || []);
  };

  // Handle file input change
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await loadDatabase(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".db" />
      <button onClick={getBingeTexterAlerts}>
        Analyze Binge Texter Alerts
      </button>
      {/* Display results */}
      <div>
        {analysisResults.map((result, index) => (
          <div key={index}>
            {/* Format your result display */}
            {result.join(", ")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatDbAnalyzer;
