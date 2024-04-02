import React, { useState } from "react";
import { useRoastsContext } from "../contexts/roastsContext";
import { TopStamp } from "../components/TopStamp";
import { AnswerChoiceList } from "../components/AnswerChoiceList";

const ProgressPage = () => {
  const { quantitativeRoasts, qualitativeRoasts } = useRoastsContext();

  return (
    <div className="flex h-screen w-full justify-center p-10">
      <div className="flex w-full max-w-[1300px] flex-grow flex-col gap-y-10">
        <TopStamp />
        <div className="flex-grow">
          <main className="flex h-full flex-col justify-end gap-y-10 text-7xl font-bold">
            <p>
              In the past 24hrs
              <br />
              you sent 174 texts.
            </p>
            <p className="text-secondary">...are you okay?</p>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
