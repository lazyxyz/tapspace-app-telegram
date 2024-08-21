"use client";

import React from "react";
import { THEME, TonConnectUIProvider } from "@tonconnect/ui-react";

export default function TonConnectProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TonConnectUIProvider
      manifestUrl="https://openspace-fe.vercel.app/tonconnect-manifest.json"
      uiPreferences={{ theme: THEME.DARK }}
    >
      {children}
    </TonConnectUIProvider>
  );
}
