"use client";

import { Box, VStack } from "@chakra-ui/react";
import InfoMint from "../Tabs/Resources/TotalResource/InfoMint";
import { BitcoinProvider } from "../Wrapper/BitcoinProvider";
import PopupDailyRewards from "../PopupDailyRewards";
import PopupClaimBitcoin from "../PopupClaimBitcoin";

export default function HomePage() {
  return (
    <BitcoinProvider>
      <Box px={2} w={"full"}>
        <InfoMint />
      </Box>
      <PopupDailyRewards />
      <PopupClaimBitcoin />
    </BitcoinProvider>
  );
}
