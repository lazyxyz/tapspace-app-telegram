import { useBitcoin } from "@/components/Wrapper/BitcoinProvider";
import { Box, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const BitcoinDisplay = ({ passive }: { totalBit: number; passive: number }) => {
  const { bitcoinValue } = useBitcoin();

  const bitcoinValueMotion = useMotionValue(0);
  const [isBitcoinLoaded, setIsBitcoinLoaded] = useState(false);

  const animatedValue = useTransform(bitcoinValueMotion, (value) =>
    value.toFixed(7)
  );

  useEffect(() => {
    if (bitcoinValue !== undefined) {
      bitcoinValueMotion.set(bitcoinValue);
      setIsBitcoinLoaded(true);
    }
  }, [bitcoinValue, bitcoinValueMotion]);

  useEffect(() => {
    if (!isBitcoinLoaded) return;

    const interval = setInterval(() => {
      const updatedValue = bitcoinValue + passive;
      animate(bitcoinValueMotion, updatedValue, {
        duration: 0.2,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [bitcoinValue, bitcoinValueMotion, passive, isBitcoinLoaded]);

  return (
    <HStack>
      <Box bg={"rgba(255, 255, 255, 0.12)"} p={2} rounded={"xl"}>
        <Image src="/bitcoin.svg" w={"56px"} h={"56px"} />
      </Box>
      <VStack align={"start"}>
        <Stack spacing={0}>
          <Text fontWeight={"800"}>TS-BTC</Text>
          <Text fontSize={"xs"}>{passive}/s</Text>
        </Stack>
        <HStack spacing={1}>
          <Image src="/bitcoin.svg" w={"16px"} h={"16px"} />
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
