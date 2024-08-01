import Leaderboard from "@/components/Leaderboard";
import useSocket from "@/hooks/useSocket";
import { useTelegram } from "@/lib/TelegramProvider";
import { HStack, Stack, useDisclosure, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { MemoizedMintItem } from "./MintItem";

export type MintItemType = {
  capacity: number;
  resource_name: string;
  calculatedValue: number;
  floatingText?: string;
  frequency_mining: number;
  image?: string;
  mining: number;
};

interface InfoMintProps {
  data: any;
  refetch: () => void;
}

interface BackButton {
  isVisible: boolean;
  show?: () => void;
}

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

const InfoMint: React.FC<InfoMintProps> = ({ data, refetch }) => {
  const { user, webApp } = useTelegram();

  const [listData, setListData] = useState<MintItemType[]>([]);
  const [accumulatedValues, setAccumulatedValues] = useState<{
    [key: string]: number;
  }>({});
  const [levelBot, setLevelBot] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataSocket, setDataSocket] = useState<any>([]);

  const { emit, on, connected } = useSocket();

  const initializeListData = useCallback(() => {
    if (data && typeof window !== "undefined") {
      const initialData = data.resources.map((item: any) => {
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
    initializeListData();
  }, [initializeListData]);

  const updateListData = useCallback(() => {
    setListData((prevListData) =>
      prevListData.map((item) => {
        if (item.calculatedValue < item.capacity) {
          const updatedValue =
            item.calculatedValue +
            calculateNewItemSecond(item.frequency_mining, levelBot);
          localStorage.setItem(
            `calculatedValue_${item.resource_name}`,
            Math.min(updatedValue, item.capacity).toString()
          );
          return {
            ...item,
            calculatedValue: Math.min(updatedValue, item.capacity),
            floatingText: undefined,
          };
        }
        return item;
      })
    );
  }, [levelBot]);

  const addToAccumulatedValues = useCallback(() => {
    setAccumulatedValues((prevValues) => {
      const updatedAccumulatedValues = { ...prevValues };
      listData.forEach((item) => {
        if (!updatedAccumulatedValues[item.resource_name]) {
          updatedAccumulatedValues[item.resource_name] = 0;
        }
        if (item.calculatedValue > 0 && item.calculatedValue < item.capacity) {
          updatedAccumulatedValues[item.resource_name] +=
            calculateNewItemSecond(item.frequency_mining, levelBot);
        }
      });
      return updatedAccumulatedValues;
    });
  }, [listData, levelBot]);

  const resetTimer = useCallback(() => {
    const allFull = listData.every(
      (item) => item.calculatedValue >= item.capacity
    );
    if (allFull) return;

    const timerId = setInterval(() => {
      updateListData();
    }, 1000);

    return () => clearInterval(timerId);
  }, [listData, updateListData]);

  useEffect(() => {
    const cleanupTimer = resetTimer();
    return cleanupTimer;
  }, [resetTimer]);

  const handleClick = useCallback(() => {
    try {
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

      const miningValues: { [key: string]: number } = {};

      listData.forEach((item) => {
        if (item.calculatedValue > 0) {
          miningValues[item.resource_name] = item.frequency_mining;
        }
      });

      if (Object.keys(miningValues).length > 0) {
        const data = {
          telegram_id:
            Number(user?.id) || Number(process.env.NEXT_PUBLIC_API_ID_TELEGRAM),
          mining_values: miningValues,
        };
        emit("update_mining", data);
      } else {
        console.log("No valid resources to update.");
      }
    } catch (error) {
      console.error("Error in handleClickSocket:", error);
    }
  }, [listData, levelBot, connected]);

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

  const handleImageClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      handleClick();
    },
    [handleClick]
  );

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
                filter: "drop-shadow(0px 4px 50px rgba(239, 103, 244, 0.5))",
              }}
            />
          </motion.div>
        </Stack>
      </VStack>

      <Leaderboard isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </>
  );
};

export default InfoMint;
