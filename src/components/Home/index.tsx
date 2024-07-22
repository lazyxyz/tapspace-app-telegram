"use client";

import { Box, VStack } from "@chakra-ui/react";
import InfoMint from "../Tabs/Resources/TotalResource/InfoMint";
import { BitcoinProvider } from "../Wrapper/BitcoinProvider";
import PopupDailyRewards from "../Popup/PopupDailyRewards";
import PopupClaimBitcoin from "../Popup/PopupClaimBitcoin";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export default function HomePage() {
  const queryClient = useQueryClient();
  const queryKey = [`infoUser`];
  const data = queryClient.getQueryData<{ btc_value: number }>(queryKey);

  return (
    <BitcoinProvider>
      <Box px={2} w={"full"}>
        <InfoMint />
      </Box>

      <PopupDailyRewards data={data} />
      <PopupClaimBitcoin data={data} />
    </BitcoinProvider>
  );
}
