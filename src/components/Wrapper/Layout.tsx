"use client";

import { Box, Stack, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer";
import { BitcoinProvider } from "./BitcoinProvider";
import Preload from "../Preload";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isPreloading, setIsPreloading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPreloading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <VStack
      overflowY="auto"
      overflowX="hidden"
      w="100vw"
      bgImage={"/background.png"}
      bgRepeat={"no-repeat"}
      bgSize={"cover"}
      justifyContent={"space-between"}
    >
      <Box w="full" h="full">
        <Header />
        {children}
        <Footer />
      </Box>
    </VStack>
  );
}
