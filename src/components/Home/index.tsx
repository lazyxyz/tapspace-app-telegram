"use client";

import { Box, VStack } from "@chakra-ui/react";
import InfoMint from "../Tabs/Resources/TotalResource/InfoMint";
import { BitcoinProvider } from "../Wrapper/BitcoinProvider";
import PopupDailyRewards from "../Popup/PopupDailyRewards";
import PopupClaimBitcoin from "../Popup/PopupClaimBitcoin";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import systemService from "@/services/system.service";
import { useTelegram } from "@/lib/TelegramProvider";
import Preload from "../Preload";

export default function HomePage() {
  const { user } = useTelegram();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["infoUser"],
    queryFn: async () => {
      const rs = await systemService.getUserInfo({
        telegram_id:
          process.env.NEXT_PUBLIC_API_ID_TELEGRAM || user?.id.toString(),
        planets: "Earth",
      });
      return rs.data[0];
    },
    staleTime: Infinity,
    enabled: true,
  });

  return (
    <BitcoinProvider>
      {isLoading ? (
        <Preload />
      ) : (
        <>
          <Box px={2} w={"full"}>
            <InfoMint data={data} refetch={refetch} />
          </Box>

          <PopupDailyRewards data={data} />
          <PopupClaimBitcoin data={data} />
        </>
      )}
    </BitcoinProvider>
  );
}
