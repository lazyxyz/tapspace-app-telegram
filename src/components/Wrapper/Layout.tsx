import { VStack } from "@chakra-ui/react";
import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <VStack
      overflowY="auto"
      overflowX="hidden"
      w="100vw"
      minH="100vh"
      bgImage={"/background.png"}
      justifyContent={"space-between"}
    >
      <Header />
      {children}

      <Footer />
    </VStack>
  );
}
