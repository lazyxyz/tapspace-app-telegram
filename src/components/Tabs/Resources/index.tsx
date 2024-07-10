import { Divider, Text, VStack } from "@chakra-ui/react";
import React from "react";
import Minting from "./Minting";
import InfoMint from "./InfoMint";

export default function Resources() {
  return (
    <VStack>
      <Minting />
      <Divider />
      <InfoMint />
    </VStack>
  );
}
