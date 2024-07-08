"use client";

import { VStack } from "@chakra-ui/react";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <VStack
      overflowY="auto"
      overflowX="hidden"
      w="100vw"
      h="100vh"
      //   bg={boxColor}
    >
      {children}
    </VStack>
  );
}
