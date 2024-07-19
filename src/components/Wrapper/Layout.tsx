"use client";

import { Box, Stack, VStack } from "@chakra-ui/react";
import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer";
import { BitcoinProvider } from "./BitcoinProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
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
      <Header />
      {children}
      <Footer />
    </VStack>
  );
}
