import React, { useEffect, useRef, useState, useCallback } from "react";
import { Box, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { DataMint } from "@/lib/data";
import ThreeDButton from "./ButtonMint";
import { useTelegram } from "@/lib/TelegramProvider";

type MintItemType = {
  name: string;
  second: number;
  allocation: number;
  image: string;
  calculatedValue: number;
};

const InfoMint = () => {
  const { user, webApp } = useTelegram();

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
      {user ? (
        <div>
          <h1>Welcome {user?.username}</h1>
          User data:
          <pre>{JSON.stringify(user, null, 2)}</pre>
          Eniter Web App data:
          <pre>{JSON.stringify(webApp, null, 2)}</pre>
        </div>
      ) : (
        <div>Make sure web app is opened from telegram client</div>
      )}

      <Stack pb={3} w={"full"} align={"end"}>
        <ThreeDButton onClick={handleClick}>Mining</ThreeDButton>
      </Stack>

      {listData.map((item) => (
        <MemoizedMintItem key={item.name} item={item} />
      ))}
    </VStack>
  );
};

const MintItem = ({ item }: { item: MintItemType }) => {
  const calculatedValueMotion = useMotionValue(item.calculatedValue);
  const animatedValue = useTransform(calculatedValueMotion, (value) =>
    value.toFixed(0)
  );

  useEffect(() => {
    animate(calculatedValueMotion, item.calculatedValue, {
      duration: 0.2,
      ease: "linear",
    });
  }, [item.calculatedValue, calculatedValueMotion]);

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
    </HStack>
  );
};

const MemoizedMintItem = React.memo(MintItem);

export default InfoMint;
