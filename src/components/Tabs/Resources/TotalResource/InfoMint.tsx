import { useTelegram } from "@/lib/TelegramProvider";
import systemService from "@/services/system.service";
import {
  Box,
  HStack,
  Image,
  Link,
  Stack,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { MemoizedMintItem } from "./MintItem";
import Leaderboard from "@/components/Leaderboard";
import NextLink from "next/link";

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
  const { user, webApp } = useTelegram();
  useEffect(() => {
    if (webApp) {
    }
  }, [webApp]);

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
  const [tap, setTap] = useState(1);
  const [accumulatedValues, setAccumulatedValues] = useState<{
    [key: string]: number;
  }>({});
  const [levelBot, setLevelBot] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  const totalItemsRef = useRef(totalItems);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (data && typeof window !== "undefined") {
      const initialData = data?.resources?.map((item: any) => {
        const storedCalculatedValue = localStorage.getItem(
          `calculatedValue_${item.resource_name}`
        );
        return {
          ...item,
          calculatedValue: storedCalculatedValue
            ? parseFloat(storedCalculatedValue)
            : item.capacity,
          capaticyLevel: "",
        };
      });
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
          localStorage.setItem(
            `calculatedValue_${item.resource_name}`,
            Math.min(updatedValue, item.capacity).toString()
          );
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

  useEffect(() => {
    resetTimer();
  }, [resetTimer]);

  const handleClick = useCallback(() => {
    setListData((prevListData) =>
      prevListData.map((item) => {
        if (item.calculatedValue > 0) {
          const updatedValue =
            item.calculatedValue -
            calculateNewItemSecond(item.frequency_mining, levelBot);
          localStorage.setItem(
            `calculatedValue_${item.resource_name}`,
            Math.max(updatedValue, 0).toString()
          );
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

  const handleImageClick = (event: any) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    handleClick();
  };

  return (
    <>
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
          pb={24}
        >
          <motion.div
            onClick={handleImageClick}
            initial="normal"
            variants={clickVariants}
            whileTap="click"
            style={{
              display: "inline-block",
              position: "relative",
            }}
          >
            <motion.img
              src="/assets/centerClick.png"
              alt="Center Click"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 90,
                ease: "linear",
              }}
              style={{
                display: "inline-block",
                filter: "drop-shadow(0px 4px 50px rgba(239, 103, 244, 0.45))",
              }}
            />
          </motion.div>

          <Link
            as={NextLink}
            href="/universe"
            bg={"rgba(255, 255, 255, 0.15)"}
            borderWidth={1}
            position={"absolute"}
            bottom={"20%"}
            right={"3%"}
            borderBottomWidth={2}
            rounded={"xl"}
            borderColor={"rgba(255, 255, 255, 0.15)"}
            onClick={onOpen}
            p={1}
          >
            <Image src="/assets/leaderboard.png" w={"40px"} h={"40px"} />
          </Link>
          <Box
            bg={"rgba(255, 255, 255, 0.15)"}
            borderWidth={1}
            position={"absolute"}
            bottom={"11%"}
            right={"3%"}
            borderBottomWidth={2}
            rounded={"xl"}
            borderColor={"rgba(255, 255, 255, 0.15)"}
            onClick={onOpen}
            p={1}
          >
            <Image src="/assets/leaderboard.png" w={"40px"} h={"40px"} />
          </Box>
        </Stack>
      </VStack>
      <Leaderboard isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
};

export default InfoMint;
