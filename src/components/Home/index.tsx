"use client";

import { useTelegram } from "@/lib/TelegramProvider";
import systemService from "@/services/system.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import InfoMint from "../Tabs/Resources/TotalResource/InfoMint";

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
          user?.id.toString() || process.env.NEXT_PUBLIC_API_ID_TELEGRAM,
        planets: "Earth",
      });
      return rs.data;
    },
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
    <>
      <InfoMint data={data} refetch={refetch} />
    </>
  );
}
