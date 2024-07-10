import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { DataMint } from "@/lib/data";
import ThreeDButton from "./ButtonMint";

type MintItemType = {
  name: string;
  second: number;
  allocation: number;
  image: string;
  calculatedValue: number;
};

const InfoMint = () => {
  const [listData, setListData] = useState<MintItemType[]>(
    () =>
      JSON.parse(localStorage.getItem("listData") || "null") ||
      DataMint.map((item) => ({
        ...item,
        calculatedValue: item.allocation,
      }))
  );
  const [accumulatedValues, setAccumulatedValues] = useState<{
    [key: string]: number;
  }>({});

  const [totalItems, setTotalItems] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateListData = useCallback(() => {
    const currentTime = Date.now();
    const lastUpdateTime =
      Number(localStorage.getItem("lastUpdateTime")) || currentTime;
    const elapsedSeconds = Math.floor((currentTime - lastUpdateTime) / 1000);

    setListData((prevListData) => {
      const updatedList = prevListData.map((item) => {
        if (item.calculatedValue < item.allocation) {
          const updatedValue =
            item.calculatedValue + item.second * elapsedSeconds;
          return {
            ...item,
            calculatedValue: Math.min(updatedValue, item.allocation),
          };
        }
        return item;
      });

      localStorage.setItem("listData", JSON.stringify(updatedList));
      return updatedList;
    });

    localStorage.setItem("lastUpdateTime", currentTime.toString());
  }, []);

  useEffect(() => {
    const savedValues = JSON.parse(
      localStorage.getItem("accumulatedValues") || "{}"
    );
    setAccumulatedValues(savedValues);

    const savedTotalItems = Number(localStorage.getItem("totalItems")) || 0;
    setTotalItems(savedTotalItems);

    updateListData();
  }, [updateListData]);

  useEffect(() => {
    localStorage.setItem("listData", JSON.stringify(listData));
  }, [listData]);

  useEffect(() => {
    localStorage.setItem("totalItems", totalItems.toString());
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
    localStorage.setItem(
      "accumulatedValues",
      JSON.stringify(updatedAccumulatedValues)
    );
  }, [accumulatedValues, listData]);

  const getTotalAccumulatedValues = () => {
    return Object.values(accumulatedValues).reduce(
      (total, value) => total + value,
      0
    );
  };

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

const MintItem = ({ item }: { item: MintItemType }) => (
  <HStack
    w={"full"}
    borderWidth={3}
    bg={"#e6effc"}
    borderColor={"#92A8D0"}
    p={4}
    rounded={"xl"}
    justifyContent={"space-between"}
    opacity={item.calculatedValue > 0 ? "100%" : "50%"}
  >
    <HStack>
      <Box
        bg={item.calculatedValue > 0 ? "white" : "#657BAE"}
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

      <Text color={"primary.100"} fontWeight={"bold"} fontSize={"lg"}>
        {item.calculatedValue}/{item.allocation}
      </Text>
    </HStack>
  </HStack>
);

const MemoizedMintItem = React.memo(MintItem);

export default InfoMint;
