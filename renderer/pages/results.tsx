import React, { useState } from "react";
import { useRoastsContext } from "../contexts/roastsContext";
import { TopStamp } from "../components/TopStamp";
import { AnswerChoiceList } from "../components/AnswerChoiceList";

const CallTestEndpoint = () => {
  const { chatDB, setChatDB, getRoasts } = useRoastsContext();
  // const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setChatDB(event.target.files[0]);
    // setFile(event.target.files[0]);
  };

  // const callTestEndpoint = async () => {
  //   if (!file) {
  //     alert("Please select a file first.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("dbFile", file);

  //   try {
  //     const response = await fetch("http://localhost:3005/api/roast/qual", {
  //       method: "POST",
  //       body: formData,
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //   } catch (error) {
  //     console.error("Failed to call /api/roast endpoint", error);
  //   }
  // };

  return (
    <div className="flex h-screen w-full justify-center p-10">
      <div className="flex w-full max-w-[1300px] flex-grow flex-col gap-y-10">
        <TopStamp />
        <div className="flex-grow">
          <main className="flex h-full flex-row items-center justify-center gap-x-10">
            <p className="w-fit whitespace-nowrap text-5xl font-bold">
              You are the one who
            </p>
            <div className="fade-top-bottom w-full">
              <AnswerChoiceList />
            </div>
          </main>
        </div>
        <input type="file" onChange={handleFileChange} accept=".db" />
        <button onClick={getRoasts}>Upload and Analyze</button>
      </div>
    </div>
  );
};

export default CallTestEndpoint;
