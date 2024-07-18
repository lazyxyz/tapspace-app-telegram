import React, { memo, useEffect, useState } from "react";
import { HStack, VStack, Box, Text, Image, Stack } from "@chakra-ui/react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const BitcoinDisplay = ({ levelBot }: { levelBot: number }) => {
  const [bitcoinValue, setBitcoinValue] = useState(() => {
    if (typeof window !== "undefined") {
      const savedValue = localStorage.getItem("bitcoinValue");
      return savedValue ? parseFloat(savedValue) : 0;
    }
    return 0;
  });

  console.log(12);

  const bitcoinValueMotion = useMotionValue(bitcoinValue);

  const animatedValue = useTransform(bitcoinValueMotion, (value) =>
    value.toFixed(2)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedValue = bitcoinValue + 0.15;
      localStorage.setItem("bitcoinValue", updatedValue.toString());

      animate(bitcoinValueMotion, updatedValue, {
        duration: 0.2,
      });

      setBitcoinValue(updatedValue);
    }, 1000);

    return () => clearInterval(interval);
  }, [bitcoinValue, bitcoinValueMotion]);

  const bitcoinValuePerSecond = 0.00000005 * levelBot;

  return (
    <HStack>
      <Box bg={"rgba(255, 255, 255, 0.12)"} p={2} rounded={"xl"}>
        <Image src="/assets/bitcoin.svg" w={"56px"} h={"56px"} />
      </Box>
      <VStack align={"start"}>
        <Stack spacing={0}>
          <Text fontWeight={"800"}>TS-BTC</Text>
          <Text fontSize={"xs"}>{bitcoinValuePerSecond.toFixed(8)}/s</Text>
        </Stack>
        <HStack spacing={1}>
          <Image src="/assets/bitcoin.svg" w={"16px"} h={"16px"} />
          <motion.div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: "white",
            }}
          >
            <motion.span>{animatedValue}</motion.span>
          </motion.div>
        </HStack>
      </VStack>
    </HStack>
  );
};

export default BitcoinDisplay;
