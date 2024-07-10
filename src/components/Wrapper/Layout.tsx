import { VStack } from "@chakra-ui/react";
import React from "react";
import Header from "../Header/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <VStack overflowY="auto" overflowX="hidden" w="100vw" h="100vh">
      <Header />
      {children}
    </VStack>
  );
}
