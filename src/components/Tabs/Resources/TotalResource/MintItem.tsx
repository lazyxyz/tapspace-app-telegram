import { Box, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import React, { useEffect, useState } from "react";
import { MintItemType } from "./InfoMint";
import { imageResources, numeralFormat } from "@/utils/utils";

const MintItem: React.FC<{
  item: MintItemType;
  accumulatedValues: { [key: string]: number };
}> = ({ item, accumulatedValues }) => {
  const calculatedValueMotion = useMotionValue(
    accumulatedValues[item.resource_name] || 0
  );
  const calculatedCapacity = useMotionValue(item.calculatedValue);
  const [floatingTexts, setFloatingTexts] = useState<string[]>([]);

  const animatedValue = useTransform(calculatedValueMotion, (value) =>
    numeralFormat(value)
  );

  useEffect(() => {
    animate(calculatedValueMotion, item.mining, {
      duration: 0.2,
      ease: "linear",
    });
    animate(calculatedCapacity, item.calculatedValue, {
      duration: 0.2,
      ease: "linear",
    });
    if (item.floatingText) {
      //@ts-ignore
      setFloatingTexts((prevTexts) => [...prevTexts, item.floatingText]);
      setTimeout(() => {
        setFloatingTexts((prevTexts) => prevTexts.slice(1));
      }, 1000);
    }
  }, [item.mining, item.calculatedValue, item.floatingText]);

  const progressValue = useTransform(
    calculatedCapacity,
    (value) => (value / item.capacity) * 100
  );

  return (
    <VStack w={"20%"}>
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
              {/* @ts-ignore */}
              {animatedValue}
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
            backgroundColor:
              progressValue.get() < 50
                ? "#FDBF25"
                : progressValue.get() < 20
                ? "red"
                : "#D5FE4B",
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
    <Text
      color="white"
      textAlign="center"
      textShadow="0px 1px 0px #13161F, 0px 0px 5px #D5FE4B"
      sx={{
        WebkitTextStrokeWidth: "1px",
      }}
    >
      {text}
    </Text>
  </motion.div>
);

export const MemoizedMintItem = React.memo(MintItem);
