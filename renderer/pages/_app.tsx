import React from "react";
import type { AppProps } from "next/app";

import "../styles/globals.css";
import { RoastsContextProvider } from "../contexts/roastsContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RoastsContextProvider>
      <Component {...pageProps} />
    </RoastsContextProvider>
  );
}

export default MyApp;
