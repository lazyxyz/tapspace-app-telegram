import { DataMint } from "@/lib/data";
import { Box, HStack, Image, Stack, VStack } from "@chakra-ui/react";
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

const postDataToApi = async (data: any) => {
  alert(`Posting data: ${JSON.stringify(data)}`);
};

const InfoMint = () => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["infoUser"],
    queryFn: async () => {
      const rs = await systemService.getUserInfo({
        telegram_id: "1341419583",
        planets: "Earth",
      });
      return rs.data[0];
    },
    staleTime: Infinity,
    enabled: true,
  });

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

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     if (totalItemsRef.current > 0) {
  //       const result = listData.map((item) => ({
  //         name: item.resource_name,
  //         value: totalItemsRef.current * item.frequency_mining,
  //       }));

  //       postDataToApi(result);

  //       setTotalItems(0);
  //     }
  //   }, 30000);

  //   return () => clearInterval(intervalId);
  // }, [accumulatedValues]);

  const rotateVariants = {
    rotate: { rotate: 360 },
  };

  const clickVariants = {
    click: {
      scale: 1.05,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    normal: {
      scale: 1,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };
  const controls = useAnimation();

  const handleImageClick = () => {
    controls.start("click").then(() => {
      controls.start("normal");
    });
    handleClick();
  };
  return (
    <VStack
      w={"full"}
      justifyContent={"space-between"}
      minH="calc(100vh - 166px)"
    >
      <HStack w={"full"}>
        {listData.map((item) => (
          <MemoizedMintItem
            key={item.resource_name}
            item={item}
            accumulatedValues={accumulatedValues}
          />
        ))}
      </HStack>
      <Stack py={3} w={"full"} align={"center"}>
        <motion.div
          animate={controls}
          onClick={handleImageClick}
          initial="normal"
          variants={clickVariants}
          whileHover="click"
          whileTap="click"
          style={{ display: "inline-block" }}
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
        </motion.div>
      </Stack>
      <Box />
      <Box />
    </VStack>
  );
};

export default InfoMint;
