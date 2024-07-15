import { DataMint } from "@/lib/data";
import { Box, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ThreeDButton from "./ButtonMint";

type MintItemType = {
  name: string;
  second: number;
  allocation: number;
  image: string;
  calculatedValue: number;
  floatingText?: any;
};

const InfoMint = () => {
  const [listData, setListData] = useState<MintItemType[]>(() => {
    if (typeof window !== "undefined") {
      const savedListData = localStorage.getItem("listData");
      if (savedListData) {
        return JSON.parse(savedListData);
      }
      const initialData = DataMint.map((item) => ({
        ...item,
        calculatedValue: item.allocation,
      }));
      localStorage.setItem("listData", JSON.stringify(initialData));
      return initialData;
    }
    return [];
  });

  const [accumulatedValues, setAccumulatedValues] = useState<{
    [key: string]: number;
  }>({});
  const [totalItems, setTotalItems] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateListData = useCallback(() => {
    setListData((prevListData) => {
      const updatedList = prevListData.map((item) => {
        if (item.calculatedValue < item.allocation) {
          const updatedValue = item.calculatedValue + item.second;
          return {
            ...item,
            calculatedValue: Math.min(updatedValue, item.allocation),
            floatingText: null, // Clear floating text when updating by timer
          };
        }
        return item;
      });

      localStorage.setItem("listData", JSON.stringify(updatedList));
      return updatedList;
    });
  }, []);

  useEffect(() => {
    const initLocalStorageData = () => {
      const savedValues = JSON.parse(
        localStorage.getItem("accumulatedValues") || "{}"
      );
      setAccumulatedValues(savedValues);

      const savedTotalItems = Number(localStorage.getItem("totalItems")) || 0;
      setTotalItems(savedTotalItems);

      updateListData();
    };

    if (typeof window !== "undefined") {
      initLocalStorageData();
    }
  }, [updateListData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("listData", JSON.stringify(listData));
    }
  }, [listData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("totalItems", totalItems.toString());
    }
  }, [totalItems]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    const allFull = listData.every(
      (item) => item.calculatedValue >= item.allocation
    );
    if (allFull) return;

    timerRef.current = setInterval(() => {
      updateListData();
    }, 1000);
  }, [listData, updateListData]);

  const handleClick = useCallback(() => {
    setListData((prevListData) =>
      prevListData.map((item) => {
        if (item.calculatedValue > 0) {
          const updatedValue = item.calculatedValue - item.second;
          return {
            ...item,
            calculatedValue: Math.max(updatedValue, 0),
            floatingText: `+${item.second}`, // Add floating text value
          };
        }
        return item;
      })
    );
    addToAccumulatedValues();
    setTotalItems((prevTotal) => prevTotal + 1);
    resetTimer();
  }, [resetTimer]);

  const addToAccumulatedValues = useCallback(() => {
    const updatedAccumulatedValues = { ...accumulatedValues };

    listData.forEach((item) => {
      if (!updatedAccumulatedValues[item.name]) {
        updatedAccumulatedValues[item.name] = 0;
      }
      if (item.calculatedValue > 0 && item.calculatedValue < item.allocation) {
        updatedAccumulatedValues[item.name] += item.second;
      }
    });

    setAccumulatedValues(updatedAccumulatedValues);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "accumulatedValues",
        JSON.stringify(updatedAccumulatedValues)
      );
    }
  }, [accumulatedValues, listData]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  return (
    <VStack w={"full"} px={2}>
      <Stack pb={3} w={"full"} align={"end"}>
        <ThreeDButton onClick={handleClick}>Mining</ThreeDButton>
      </Stack>

      {listData.map((item) => (
        <MemoizedMintItem key={item.name} item={item} />
      ))}
    </VStack>
  );
};

const FloatingText = ({ text }: any) => (
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

const MintItem = ({ item }: { item: MintItemType }) => {
  const calculatedValueMotion = useMotionValue(item.calculatedValue);
  const animatedValue = useTransform(calculatedValueMotion, (value) =>
    value.toFixed(0)
  );

  const [floatingTexts, setFloatingTexts] = useState<string[]>([]);

  useEffect(() => {
    animate(calculatedValueMotion, item.calculatedValue, {
      duration: 0.2,
      ease: "linear",
    });

    if (item.floatingText) {
      setFloatingTexts((prevTexts) => [...prevTexts, item.floatingText]);
      setTimeout(() => {
        setFloatingTexts((prevTexts) => prevTexts.slice(1));
      }, 1000); // Hide each floating text after 1 second
    }
  }, [item.calculatedValue, calculatedValueMotion, item.floatingText]);

  const MotionText = motion(Text);

  return (
    <HStack
      w={"full"}
      borderWidth={3}
      bg={"#e6effc"}
      borderColor={"#92A8D0"}
      p={4}
      rounded={"xl"}
      justifyContent={"space-between"}
      opacity={item.allocation > 0 ? "100%" : "50%"}
      position="relative" // Add position relative for floating text
    >
      <HStack>
        <Box
          bg={item.allocation > 0 ? "white" : "#657BAE"}
          p={2}
          rounded={"xl"}
        >
          <Image src={item.image} />
        </Box>

        <Text color={"primary.100"} fontSize={"lg"} fontWeight={"bold"}>
          {item.name}
        </Text>
      </HStack>

      <HStack w={"50%"} justifyContent={"space-between"}>
        <Text color={"primary.100"} fontWeight={"600"} fontSize={"lg"}>
          {item.second}/Sec
        </Text>

        <HStack spacing={0}>
          <MotionText
            fontSize={"lg"}
            fontWeight={"bold"}
            textColor={"primary.100"}
          >
            <motion.span>{animatedValue}</motion.span>
          </MotionText>

          <Text color={"primary.100"} fontWeight={"bold"} fontSize={"lg"}>
            /{item.allocation}
          </Text>
        </HStack>
      </HStack>

      {floatingTexts.map((text, index) => (
        <FloatingText key={index} text={text} />
      ))}
    </HStack>
  );
};

const MemoizedMintItem = React.memo(MintItem);

export default InfoMint;
