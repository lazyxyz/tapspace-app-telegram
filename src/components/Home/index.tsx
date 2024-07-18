"use client";

import { Box } from "@chakra-ui/react";
import InfoMint from "../Tabs/Resources/TotalResource/InfoMint";
import { BitcoinProvider } from "../Wrapper/BitcoinProvider";

export default function HomePage() {
  return (
    <Box h={"full"}>
      <BitcoinProvider>
        <InfoMint />
      </BitcoinProvider>
    </Box>
  );
}
