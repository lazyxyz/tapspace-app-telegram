import { useEffect, useState } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { Box, Button, HStack, Image, Text, VStack } from "@chakra-ui/react";

const Minting = () => {
  const [bitcoinValue, setBitcoinValue] = useState(() => {
    const savedValue = localStorage.getItem("bitcoinValue");
    return savedValue ? parseFloat(savedValue) : 0;
  });
  const [totalCoin, setTotalCoin] = useState(() => {
    const savedTotal = localStorage.getItem("totalCoin");
    return savedTotal ? parseFloat(savedTotal) : 0;
  });

  const bitcoinValueMotion = useMotionValue(bitcoinValue);
  const animatedValue = useTransform(bitcoinValueMotion, (value) =>
    value.toFixed(4)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setBitcoinValue((prevValue) => {
        const newValue = prevValue + 0.015;
        animate(bitcoinValueMotion, newValue, {
          duration: 0.5,
          ease: "linear",
        });
        localStorage.setItem("bitcoinValue", newValue.toString());
        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [bitcoinValueMotion]);

  const handleClaim = () => {
    const currentTime = new Date().toLocaleString();
    const claimValue = bitcoinValue.toFixed(4);

    setTotalCoin((prevTotal) => prevTotal + parseFloat(claimValue));

    setBitcoinValue(0);
    localStorage.setItem("bitcoinValue", "0");

    localStorage.setItem("totalCoin", totalCoin.toString());
  };

  return (
    <VStack w={"full"} px={2} align="center">
      <HStack justifyContent={"space-between"} w={"full"} py={2}>
        <Text fontSize={"lg"}>
          Total Coin:{" "}
          <Box
            as={"span"}
            textColor={"primary.100"}
            fontWeight={"bold"}
            fontSize={"xl"}
          >
            {totalCoin}
          </Box>
        </Text>
        <Box>
          <Button onClick={handleClaim}>Claim Bitcoin</Button>
        </Box>
      </HStack>
      <HStack
        w={"full"}
        borderWidth={1}
        bg={"#eff5ff"}
        borderColor={"#92A8D0"}
        p={4}
        rounded={"xl"}
        justifyContent={"space-between"}
      >
        <HStack spacing={4}>
          <Image src="/bitcoin.svg" />
          <VStack align="start">
            <Text fontSize={"xl"} fontWeight={"bold"}>
              Bitcoin
            </Text>
            <Text>0.015/Sec</Text>
          </VStack>
        </HStack>
        <motion.div
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#3182ce",
          }}
        >
          <motion.span>{animatedValue}</motion.span>
        </motion.div>
      </HStack>
      <HStack
        w={"full"}
        borderWidth={1}
        bg={"#eff5ff"}
        borderColor={"#92A8D0"}
        p={4}
        spacing={3}
        rounded={"xl"}
        justifyContent={"start"}
      >
        <Image src="/north.svg" />
        <Text fontSize={"xl"} fontWeight={"600"}>
          Earth Resources
        </Text>
      </HStack>
    </VStack>
  );
};

export default Minting;
