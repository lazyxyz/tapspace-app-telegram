"use client";

import { Box } from "@chakra-ui/react";
import InfoMint from "../Tabs/Resources/TotalResource/InfoMint";
import { BitcoinProvider } from "../Wrapper/BitcoinProvider";
import PopupDailyRewards from "../Popup/PopupDailyRewards";
import PopupClaimBitcoin from "../Popup/PopupClaimBitcoin";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import systemService from "@/services/system.service";
import { useTelegram } from "@/lib/TelegramProvider";
import Preload from "../Preload";

export default function HomePage() {
  const { user } = useTelegram();
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loading, setLoading] = useState(true);

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
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 1;
        } else {
          clearInterval(intervalId);
          return prevProgress;
        }
      });
    }, 30);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
      const timer = setTimeout(() => {
        setLoadingComplete(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <BitcoinProvider>
      {!loadingComplete ? (
        <Preload progress={progress} loading={loading} />
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
