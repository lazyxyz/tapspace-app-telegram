"use client";

import { Box, VStack } from "@chakra-ui/react";
import InfoMint from "../Tabs/Resources/TotalResource/InfoMint";
import { BitcoinProvider } from "../Wrapper/BitcoinProvider";
import PopupDailyRewards from "../PopupDailyRewards";

export default function HomePage() {
  return (
    <BitcoinProvider>
      <VStack h={"full"}>
        <InfoMint />
      </VStack>
      <PopupDailyRewards />
    </BitcoinProvider>
  );
}
