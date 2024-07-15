import { Text, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export default function MySpaceShip() {
  const [bitcoinValue, setBitcoinValue] = useState<{ [key: string]: number }>(
    {}
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedValue = localStorage.getItem("accumulatedValues");
      if (savedValue) {
        setBitcoinValue(JSON.parse(savedValue));
      }
    }
  }, []);

  return (
    <VStack align={"start"} px={4}>
      {Object.entries(bitcoinValue).map(([key, value]) => (
        <Text key={key}>
          {key}: {value}
        </Text>
      ))}
    </VStack>
  );
}
