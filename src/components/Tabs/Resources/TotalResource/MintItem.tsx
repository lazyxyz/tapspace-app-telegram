import { Box, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import React, { useEffect, useState } from "react";
import { MintItemType } from "./InfoMint";
import { imageResources, numeralFormat } from "@/utils/utils";
import { useBitcoin } from "@/components/Wrapper/BitcoinProvider";

interface FloatingTextProps {
  id: string;
  text: string;
}
const MintItem: React.FC<{
  item: MintItemType;
}> = ({ item }) => {
  const { resourcesSocket, isSocketConnected } = useBitcoin();

  const calculatedValueMotion = useMotionValue(
    resourcesSocket?.resources &&
      Number(resourcesSocket.resources[item.resource_name])
  );
  const calculatedCapacity = useMotionValue(item.calculatedValue);
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextProps[]>([]);

  const animatedValue = useTransform(calculatedValueMotion, (value) =>
    numeralFormat(value)
  );

  useEffect(() => {
    animate(calculatedCapacity, item.calculatedValue, {
      duration: 0.2,
      ease: "linear",
    });
    if (item.floatingText) {
      const id = new Date().getTime().toString();
      setFloatingTexts((prevTexts: any) => [
        ...prevTexts,
        { id, text: item.floatingText },
      ]);
      setTimeout(() => {
        setFloatingTexts((prevTexts) =>
          prevTexts.filter((text) => text.id !== id)
        );
      }, 1000);
    }
  }, [item.calculatedValue, item.floatingText]);

  const progressValue = useTransform(
    calculatedCapacity,
    (value) => (value / item.capacity) * 100
  );

  const progressColor =
    progressValue.get() < 20
      ? "#EB303B"
      : progressValue.get() < 50
      ? "#FDBF25"
      : "#0DD63E";

  return (
    <VStack w={"20%"} overflow={"hidden"}>
      <VStack
        w={"full"}
        bg={"#333649"}
        px={1}
        borderWidth={1}
        borderBottomWidth={3}
        borderColor={"#545978"}
        rounded={"xl"}
        justifyContent={"space-between"}
        position="relative"
      >
        <VStack spacing={0} py={1}>
          <Box p={1} rounded={"xl"}>
            <Image
              w={"24px"}
              h={"24px"}
              src={imageResources[item.resource_name]}
            />
          </Box>
          <VStack align={"center"} spacing={0} w={"full"}>
            <Text
              align={"center"}
              color={"#C5C5C5"}
              fontSize={"10px"}
              fontWeight={"bold"}
            >
              {item.resource_name}
            </Text>
            <Text as={motion.span} fontSize={"sm"} fontWeight={"800"}>
              {isSocketConnected && resourcesSocket?.resources
                ? numeralFormat(resourcesSocket?.resources[item.resource_name])
                : numeralFormat(item.mining)}
            </Text>
          </VStack>
        </VStack>

        {progressValue.get() > 0 &&
          floatingTexts.map((floatingText) => (
            <FloatingText key={floatingText.id} text={floatingText.text} />
          ))}
      </VStack>

      <Stack
        spacing={0}
        w={"full"}
        bg="rgba(255, 255, 255, 0.15)"
        h={4}
        rounded={"xl"}
        position="relative"
        overflow="hidden"
      >
        <motion.div
          style={{
            width: `${Math.min(progressValue.get(), 100)}%`,
            height: "100%",
            backgroundColor: progressColor,
            borderRadius: "inherit",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${Math.min(progressValue.get(), 100)}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        <Text
          textShadow="-1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000"
          color="white"
          px={2}
          fontSize="12px"
          fontWeight={800}
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          {item.calculatedValue.toFixed(0)}/{item.capacity}
        </Text>
      </Stack>
    </VStack>
  );
};

const FloatingText = ({ text }: { text: string }) => (
  <motion.div
    initial={{ opacity: 1, y: 0 }}
    animate={{ opacity: 0, y: -50 }}
    transition={{ duration: 1 }}
    style={{
      position: "absolute",
      left: "25%",
      top: "50%",
      zIndex: 10,
    }}
  >
    <Text
      color="white"
      textAlign="center"
      fontSize={"xs"}
      fontWeight={900}
      textShadow="-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0px 1px 0px #13161F, 0px 0px 5px #D5FE4B"
    >
      {text}
    </Text>
  </motion.div>
);

export const MemoizedMintItem = React.memo(MintItem);
