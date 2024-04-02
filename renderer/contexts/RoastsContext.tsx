import axios from "axios";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface RoastsContextInterface {
  chatDB: Blob | undefined;
  setChatDB: Dispatch<SetStateAction<Blob | undefined>>;
  getRoasts: (chatDB: File) => Promise<void>;
  quantitativeRoasts: string[];
  qualitativeRoasts: string[];
}

const RoastsContext = createContext<RoastsContextInterface | undefined>(
  undefined
);

export const RoastsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [chatDB, setChatDB] = useState();
  const [quantitativeRoasts, setQuantitativeRoasts] = useState<string[]>([]);
  const [qualitativeRoasts, setQualitativeRoasts] = useState<string[]>([]);

  async function getRoasts(chatDB: File) {
    console.log(chatDB);

    if (!chatDB) return;

    const formData = new FormData();
    formData.append("dbFile", chatDB);

    try {
      console.log("going...");
      const { data: quantitativeRoastsData } = await axios.post(
        "http://localhost:3005/api/roast/quant",
        formData
      );
      console.log("---quantitativeRoastsData---");
      console.log(quantitativeRoastsData);
      setQuantitativeRoasts(quantitativeRoastsData);

      await new Promise((resolve) => setTimeout(resolve, 7000));
      const { data: qualitativeRoastsData } = await axios.post(
        "http://localhost:3005/api/test/qual"
      );
      setQualitativeRoasts(qualitativeRoastsData);
    } catch (error) {
      console.log(error);
    }
  }

  console.log(quantitativeRoasts);
  console.log(qualitativeRoasts);

  return (
    <RoastsContext.Provider
      value={{
        chatDB,
        setChatDB,
        getRoasts,
        qualitativeRoasts,
        quantitativeRoasts,
      }}
    >
      {children}
    </RoastsContext.Provider>
  );
};

export const useRoastsContext = (): RoastsContextInterface => {
  const context = useContext(RoastsContext);
  if (context === undefined) {
    throw new Error("RoastsContext must be within RoastsContextProvider");
  }

  return context;
};
