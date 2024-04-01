import React, { useState } from "react";

const CallTestEndpoint = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const callTestEndpoint = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("dbFile", file);

    try {
      const response = await fetch("http://localhost:3005/api/roast/qual", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Failed to call /api/roast endpoint", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".db" />
      <button onClick={callTestEndpoint}>Upload and Analyze</button>
    </div>
  );
};

export default CallTestEndpoint;
