import { DataMint } from "@/lib/data";
import {
  Box,
  HStack,
  Image,
  Progress,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MemoizedMintItem } from "./MintItem";

// Define the MintItemType type
export type MintItemType = {
  name: string;
  second: number;
  allocation: number;
  image: string;
  calculatedValue: number;
  floatingText?: string;
};

// Function to calculate new item second based on bot level
const calculateNewItemSecond = (
  currentItemSecond: number,
  levelBot: number
) => {
  let newItemSecond = currentItemSecond;
  for (let i = 1; i < levelBot; i++) {
    newItemSecond += newItemSecond * 0.05;
  }
  return parseFloat(newItemSecond.toFixed(2));
};

const InfoMint = () => {
  // Initialize listData state with data from localStorage or initial DataMint
  const [listData, setListData] = useState<MintItemType[]>(() => {
    if (typeof window !== "undefined") {
      const savedListData = localStorage.getItem("listData");
      if (savedListData) {
        return JSON.parse(savedListData) as MintItemType[];
      } else {
        const initialData = DataMint.map((item) => ({
          ...item,
          calculatedValue: item.allocation,
        }));
        localStorage.setItem("listData", JSON.stringify(initialData));
        return initialData;
      }
    }
    return [];
  });

  // Initialize accumulatedValues state with data from localStorage
  const [accumulatedValues, setAccumulatedValues] = useState<{
    [key: string]: number;
  }>(() => {
    if (typeof window !== "undefined") {
      const savedValues = localStorage.getItem("accumulatedValues");
      return savedValues ? JSON.parse(savedValues) : {};
    }
    return {};
  });

  // Initialize levelBot state with data from localStorage
  const [levelBot, setLevelBot] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const storedLevelBot = localStorage.getItem("levelBot");
      return storedLevelBot ? parseInt(storedLevelBot) : 1;
    }
    return 1;
  });

  // Initialize totalItems state with data from localStorage
  const [totalItems, setTotalItems] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedTotalItems = Number(localStorage.getItem("totalItems")) || 0;
      return savedTotalItems;
    }
    return 0;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Update listData state based on the current bot level
  const updateListData = useCallback(() => {
    setListData((prevListData: any) => {
      return prevListData.map((item: any) => {
        if (item.calculatedValue < item.allocation) {
          const updatedValue =
            item.calculatedValue +
            calculateNewItemSecond(item.second, levelBot);
          return {
            ...item,
            calculatedValue: Math.min(updatedValue, item.allocation),
            floatingText: null,
          };
        }
        return item;
      });
    });
  }, [levelBot]);

  // Add to accumulatedValues state based on the current listData
  const addToAccumulatedValues = useCallback(() => {
    const updatedAccumulatedValues = { ...accumulatedValues };
    listData.forEach((item) => {
      if (!updatedAccumulatedValues[item.name]) {
        updatedAccumulatedValues[item.name] = 0;
      }
      if (item.calculatedValue > 0 && item.calculatedValue < item.allocation) {
        updatedAccumulatedValues[item.name] += calculateNewItemSecond(
          item.second,
          levelBot
        );
      }
    });
    setAccumulatedValues(updatedAccumulatedValues);
  }, [accumulatedValues, listData, levelBot]);

  // Reset the timer for updating listData
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const allFull = listData.every(
      (item) => item.calculatedValue >= item.allocation
    );
    if (allFull) return;
    timerRef.current = setInterval(() => {
      updateListData();
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [listData, updateListData]);

  // Handle click event to update listData and accumulatedValues
  const handleClick = useCallback(() => {
    setListData((prevListData) =>
      prevListData.map((item) => {
        if (item.calculatedValue > 0) {
          const updatedValue =
            item.calculatedValue -
            calculateNewItemSecond(item.second, levelBot);
          return {
            ...item,
            calculatedValue: Math.max(updatedValue, 0),
            floatingText: `+${calculateNewItemSecond(item.second, levelBot)}`,
          };
        }
        return item;
      })
    );
    addToAccumulatedValues();
    setTotalItems((prevTotal) => prevTotal + 1);
    resetTimer();
  }, [levelBot, addToAccumulatedValues, resetTimer]);

  // Update localStorage when listData changes
  useEffect(() => {
    localStorage.setItem("listData", JSON.stringify(listData));
  }, [listData]);

  // Update localStorage when accumulatedValues changes
  useEffect(() => {
    localStorage.setItem(
      "accumulatedValues",
      JSON.stringify(accumulatedValues)
    );
  }, [accumulatedValues]);

  // Update localStorage when totalItems changes
  useEffect(() => {
    localStorage.setItem("totalItems", totalItems.toString());
  }, [totalItems]);

  // Start the timer when the component mounts and reset it when necessary
  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  return (
    <VStack
      w={"full"}
      justifyContent={"space-between"}
      minH="calc(100vh - 158px)"
    >
      <HStack w={"full"}>
        {listData.map((item) => (
          <MemoizedMintItem
            key={item.name}
            item={item}
            accumulatedValues={accumulatedValues}
          />
        ))}
      </HStack>
      <Stack py={3} w={"full"} align={"center"}>
        <Image onClick={handleClick} src="/assets/centerClick.png" />
      </Stack>
      <Box />
      <Box />
    </VStack>
  );
};

export default InfoMint;
