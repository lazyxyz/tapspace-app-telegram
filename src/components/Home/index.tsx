"use client";

import { Image, VStack } from "@chakra-ui/react";
import React from "react";
import InfoMint from "../Tabs/Resources/InfoMint";

export default function HomePage() {
  return (
    <VStack h={"full"}>
      <InfoMint />
    </VStack>
  );
}
