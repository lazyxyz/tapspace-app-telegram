"use client";

import { Box, VStack } from "@chakra-ui/react";
import React from "react";
import Footer from "../Footer";
import Header from "../Header/Header";
import { BitcoinProvider } from "./BitcoinProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <VStack
      overflow="hidden"
      minHeight="-webkit-fill-available"
      w="100vw"
      h={"100vh"}
      bgImage={"/background.png"}
      bgRepeat={"no-repeat"}
      bgSize={"cover"}
      justifyContent={"space-between"}
    >
      <Box w={"full"} flex="0 0 auto">
        <Header />
      </Box>
      <Box w="full" flex="1 1 auto">
        {children}
      </Box>
      <Box w={"full"} flex="0 0 auto">
        <Footer />
      </Box>
    </VStack>
  );
}
