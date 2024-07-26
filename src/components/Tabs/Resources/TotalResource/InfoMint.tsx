import { DataMint } from "@/lib/data";
import { Box, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MemoizedMintItem } from "./MintItem";
import { useQuery } from "@tanstack/react-query";
import systemService from "@/services/system.service";
import {
  animate,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useTelegram } from "@/lib/TelegramProvider";

export type MintItemType = {
  capacity: number;
  resource_name: string;
  calculatedValue: number;
  floatingText?: string;
  frequency_mining: number;
  image?: string;
  mining: number;
};

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

const InfoMint = ({ data, refetch }: any) => {
  const { user } = useTelegram();

  const postDataToApi = async (data: any) => {
    const updatedResources = await systemService.updateMining({
      telegram_id:
        process.env.NEXT_PUBLIC_API_ID_TELEGRAM || user?.id.toString(),
      mining_values: {
        Steel: data[0].value,
        Aluminum: data[1].value,
        Copper: data[2].value,
        Fiber: data[3].value,
        Titanium: data[4].value,
      },
    });
    refetch();
  };

  const [listData, setListData] = useState<MintItemType[]>([]);
  const [accumulatedValues, setAccumulatedValues] = useState<{
    [key: string]: number;
  }>({});
  const [levelBot, setLevelBot] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const totalItemsRef = useRef(totalItems);

  useEffect(() => {
    if (data && typeof window !== "undefined") {
      const initialData = data?.resources?.map((item: any) => ({
        ...item,
        calculatedValue: item.capacity,
        capaticyLevel: "",
      }));
      setListData(initialData);
      localStorage.setItem("listData", JSON.stringify(initialData));
    }
  }, [data]);

  useEffect(() => {
    const savedValues = localStorage.getItem("accumulatedValues");
    if (savedValues) {
      setAccumulatedValues(JSON.parse(savedValues));
    }

    const storedLevelBot = localStorage.getItem("levelBot");
    if (storedLevelBot) {
      setLevelBot(parseInt(storedLevelBot));
    }

    const savedTotalItems = Number(localStorage.getItem("totalItems")) || 0;
    setTotalItems(savedTotalItems);
  }, []);

  useEffect(() => {
    totalItemsRef.current = totalItems;
  }, [totalItems]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateListData = useCallback(() => {
    setListData((prevListData: any) => {
      return prevListData.map((item: any) => {
        if (item.calculatedValue < item?.capacity) {
          const updatedValue =
            item.calculatedValue +
            calculateNewItemSecond(item.frequency_mining, levelBot);
          return {
            ...item,
            calculatedValue: Math.min(updatedValue, item?.capacity),
            floatingText: null,
          };
        }
        return item;
      });
    });
  }, [levelBot]);

  const addToAccumulatedValues = useCallback(() => {
    const updatedAccumulatedValues = { ...accumulatedValues };
    listData.forEach((item) => {
      if (!updatedAccumulatedValues[item.resource_name]) {
        updatedAccumulatedValues[item.resource_name] = 0;
      }
      if (item.calculatedValue > 0 && item.calculatedValue < item?.capacity) {
        updatedAccumulatedValues[item.resource_name] += calculateNewItemSecond(
          item.frequency_mining,
          levelBot
        );
      }
    });
    setAccumulatedValues(updatedAccumulatedValues);
  }, [accumulatedValues, listData, levelBot]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const allFull = listData.every(
      (item) => item.calculatedValue >= item?.capacity
    );
    if (allFull) return;
    timerRef.current = setInterval(() => {
      updateListData();
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [listData, updateListData]);

  const handleClick = useCallback(() => {
    setListData((prevListData) =>
      prevListData.map((item) => {
        if (item.calculatedValue > 0) {
          const updatedValue =
            item.calculatedValue -
            calculateNewItemSecond(item.frequency_mining, levelBot);
          return {
            ...item,
            calculatedValue: Math.max(updatedValue, 0),
            floatingText: `+${calculateNewItemSecond(
              item.frequency_mining,
              levelBot
            )}`,
          };
        }
        return item;
      })
    );
    addToAccumulatedValues();
    setTotalItems((prevTotal) => prevTotal + 1);
    resetTimer();
  }, [levelBot, addToAccumulatedValues, resetTimer]);

  useEffect(() => {
    localStorage.setItem("listData", JSON.stringify(listData));
  }, [listData]);

  useEffect(() => {
    localStorage.setItem(
      "accumulatedValues",
      JSON.stringify(accumulatedValues)
    );
  }, [accumulatedValues]);

  useEffect(() => {
    localStorage.setItem("totalItems", totalItems.toString());
  }, [totalItems]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (totalItemsRef.current > 0) {
        const result = listData.map((item) => ({
          name: item.resource_name,
          value: totalItemsRef.current * item.frequency_mining,
        }));

        postDataToApi(result);

        setTotalItems(0);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [accumulatedValues]);

  const clickVariants = {
    click: {
      scale: 0.95,
      transition: { duration: 0.05, ease: "easeInOut" },
    },
    normal: {
      scale: 1,
      transition: { duration: 0.05, ease: "easeInOut" },
    },
  };

  const Sparkle = ({ x, y }: any) => (
    <motion.div
      initial={{ opacity: 1, scale: 0 }}
      animate={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        position: "absolute",
        top: y,
        left: x,
        width: 20,
        height: 20,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "50%",
        pointerEvents: "none",
        zIndex: 100,
      }}
    />
  );
  const [sparkles, setSparkles] = useState<any>([]);

  const handleImageClick = (event: any) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newSparkle = { x, y, id: Date.now() };
    setSparkles([...sparkles, newSparkle]);
    handleClick();

    setTimeout(() => {
      setSparkles((prev: any) =>
        prev.filter((sparkle: any) => sparkle.id !== newSparkle.id)
      );
    }, 500);
  };
  return (
    <VStack w="full" h="full" px={2} justifyContent="flex-start" pt={2}>
      <HStack w={"full"}>
        {listData.map((item) => (
          <MemoizedMintItem
            key={item.resource_name}
            item={item}
            accumulatedValues={accumulatedValues}
          />
        ))}
      </HStack>
      <Stack
        py={3}
        flex="1"
        justifyContent="center"
        alignItems="center"
        w="full"
      >
        <motion.div
          onClick={handleImageClick}
          initial="normal"
          variants={clickVariants}
          whileTap="click"
          style={{ display: "inline-block", position: "relative" }}
        >
          <motion.img
            src="/assets/Planet/Nutom.png"
            alt="Center Click"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 90,
              ease: "linear",
            }}
          />
          {sparkles.map((sparkle: any) => (
            <Sparkle key={sparkle.id} x={sparkle.x} y={sparkle.y} />
          ))}
        </motion.div>
      </Stack>
    </VStack>
  );
};

export default InfoMint;
