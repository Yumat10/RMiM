import React, { ChangeEvent, useState } from "react";
import { useRoastsContext } from "../contexts/roastsContext";
import { TopStamp } from "../components/TopStamp";
import { AnswerChoiceList } from "../components/AnswerChoiceList";
import { useRouter } from "next/router";

const CallTestEndpoint = () => {
  const router = useRouter();
  const { chatDB, setChatDB, getRoasts } = useRoastsContext();
  // const [file, setFile] = useState(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files[0]);

    setChatDB(event.target.files[0]);

    console.log("1");

    await getRoasts(event.target.files[0]);

    console.log("2");

    router.push("/progress");

    // window.location.href = "/progress";
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

  // React.useEffect(() => {
  //   const timer = setTimeout(() => {
  //     window.location.href = "/results";
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    <div className="flex h-screen w-full justify-center p-10">
      <div className="flex w-full max-w-[1300px] flex-grow flex-col gap-y-10">
        <TopStamp />
        <div className="flex-grow">
          <main className="flex h-full flex-col justify-end gap-y-10 text-7xl font-bold">
            <p>
              Based on your iMessages
              <br />
              we tell you who you really are.
            </p>

            <input
              type="file"
              id="fileInput"
              onChange={handleFileChange}
              accept=".db"
              className="hidden"
            />
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="w-fit text-primary"
            >
              &gt; <span className="underline">Start now</span>
            </button>
          </main>
        </div>
        {/*  <button onClick={getRoasts}>Upload and Analyze</button> */}
      </div>
    </div>
  );
};

export default CallTestEndpoint;
