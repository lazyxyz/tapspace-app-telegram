import { Box, Image, Stack, Text, VStack } from "@chakra-ui/react";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import React, { useEffect, useState } from "react";
import { MintItemType } from "./InfoMint";

const MintItem: React.FC<{
  item: MintItemType;
  accumulatedValues: { [key: string]: number };
}> = ({ item, accumulatedValues }) => {
  const calculatedValueMotion = useMotionValue(accumulatedValues[item.name]);
  const calculatedCapacity = useMotionValue(item.calculatedValue);
  const [floatingTexts, setFloatingTexts] = useState<string[]>([]);

  const animatedValue = useTransform(calculatedValueMotion, (value) =>
    value?.toFixed(0)
  );

  useEffect(() => {
    animate(calculatedValueMotion, accumulatedValues[item.name], {
      duration: 0.2,
      ease: "linear",
    });
    animate(calculatedCapacity, item.calculatedValue, {
      duration: 0.2,
      ease: "linear",
    });
    if (item.floatingText) {
      setFloatingTexts((prevTexts: any) => [...prevTexts, item.floatingText]);
      setTimeout(() => {
        setFloatingTexts((prevTexts) => prevTexts.slice(1));
      }, 1000);
    }
  }, [accumulatedValues, item.calculatedValue, item.floatingText]);

  const progressValue = useTransform(
    calculatedCapacity,
    (value) => (value / item.allocation) * 100
  );

  return (
    <VStack>
      <VStack
        w={"64px"}
        bg={"#333649"}
        px={1}
        borderWidth={1}
        borderBottomWidth={3}
        borderColor={"#545978"}
        rounded={"xl"}
        justifyContent={"space-between"}
        position="relative"
      >
        <VStack spacing={0} pb={1}>
          <Box p={2} rounded={"xl"}>
            <Image src={item.image} />
          </Box>
          <VStack align={"center"} spacing={0} w={"full"}>
            <Text
              align={"center"}
              color={"#C5C5C5"}
              fontSize={"10px"}
              fontWeight={"bold"}
            >
              {item.name}
            </Text>

            <Text as={motion.span} fontSize={"sm"} fontWeight={"800"}>
              {animatedValue.get()}
            </Text>
          </VStack>
        </VStack>

        {progressValue.get() > 0 &&
          floatingTexts.map((text, index) => (
            <FloatingText key={index} text={text} />
          ))}
      </VStack>

      <Stack
        spacing={5}
        w={"full"}
        bg="gray.200"
        rounded={"xl"}
        position="relative"
        h={2}
        overflow="hidden"
      >
        <motion.div
          style={{
            width: `${Math.min(progressValue.get(), 100)}%`,
            height: "100%",
            backgroundColor: progressValue.get() < 50 ? "#FDBF25" : "#D5FE4B",
            borderRadius: "inherit",
          }}
          initial={{ width: "0%" }}
          animate={{ width: `${Math.min(progressValue.get(), 100)}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </Stack>
    </VStack>
  );
};

const FloatingText = ({ text }: { text: string }) => (
  <motion.div
    initial={{ opacity: 1, y: 0 }}
    animate={{ opacity: 0, y: -50 }}
    transition={{ duration: 1 }}
    style={{ position: "absolute", bottom: "0", left: "0", zIndex: 10 }}
  >
    <Text fontSize="sm" fontWeight="bold" color="green.500">
      {text}
    </Text>
  </motion.div>
);

export const MemoizedMintItem = React.memo(MintItem);
