"use client";

import { Box, VStack } from "@chakra-ui/react";
import React from "react";
import Footer from "../Footer";
import Header from "../Header/Header";

import { useTelegram } from "@/lib/TelegramProvider";
import systemService from "@/services/system.service";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Preload from "../Preload";
import { BitcoinProvider } from "./BitcoinProvider";
export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useTelegram();
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
    const timer = setTimeout(() => {
      setLoadingComplete(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <VStack
      overflow="hidden"
      minHeight="-webkit-fill-available"
      w="100vw"
      h={"var(--chakra-vh)"}
      bgImage={"/background.png"}
      bgRepeat={"no-repeat"}
      bgSize={"cover"}
      justifyContent={"space-between"}
      spacing={0}
    >
      {!loadingComplete ? (
        <Preload progress={progress} loading={loading} />
      ) : (
        <>
          <Box w={"full"} flex="0 0 auto">
            <Header />
          </Box>
          <BitcoinProvider>
            <Box w="full" h={"full"} alignContent={"center"} flex="1 1 auto">
              {children}
            </Box>
            <Box w={"full"} flex="0 0 auto">
              <Footer />
            </Box>
          </BitcoinProvider>
        </>
      )}
    </VStack>
  );
}
