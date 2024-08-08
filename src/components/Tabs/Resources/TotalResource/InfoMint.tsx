import { useEffect, useCallback, useState } from "react";
import { useTelegram } from "@/lib/TelegramProvider";
import useSocket from "@/hooks/useSocket";
import { HStack, Stack, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { MemoizedMintItem } from "./MintItem";
import PopupDailyRewards from "@/components/Popup/PopupDailyRewards";
import PopupClaimBitcoin from "@/components/Popup/PopupClaimBitcoin";

export type MintItemType = {
  capacity: number;
  resource_name: string;
  calculatedValue: number;
  floatingText?: string;
  multitap: number;
  image?: string;
  mining: number;
};

interface InfoMintProps {
  data: any;
  refetch: () => void;
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
  const { user } = useTelegram();
  const { emit } = useSocket();
  const [listData, setListData] = useState<MintItemType[]>([]);
  const [levelBot, setLevelBot] = useState<number>(1);

  const initializeListData = useCallback(() => {
    if (data && typeof window !== "undefined") {
      const initialData = data.resources.map((item: any) => {
        const storedCalculatedValue = localStorage.getItem(
          `calculatedValue_${item.resource_name}`
        );
        const storedLastUpdate = localStorage.getItem(
          `lastUpdate_${item.resource_name}`
        );

        let calculatedValue = item.capacity;
        if (storedCalculatedValue && storedLastUpdate) {
          const lastUpdate = new Date(storedLastUpdate);
          const currentTime = new Date();
          const timeDifference = Math.floor(
            (currentTime.getTime() - lastUpdate.getTime()) / 1000
          ); // tính bằng giây

          const incrementValue = calculateNewItemSecond(
            item.multitap,
            levelBot
          );
          const maxCapacity = item.capacity;

          // Cập nhật giá trị dựa trên thời gian đã trôi qua
          calculatedValue = Math.min(
            maxCapacity,
            parseFloat(storedCalculatedValue) + incrementValue * timeDifference
          );
        }

        return {
          ...item,
          calculatedValue,
        };
      });

      setListData(initialData);
      localStorage.setItem("listData", JSON.stringify(initialData));
    }
  }, [data, levelBot]);

  useEffect(() => {
    initializeListData();
  }, [initializeListData]);

  const updateListData = useCallback(() => {
    setListData((prevListData) =>
      prevListData.map((item) => {
        if (item.calculatedValue < item.capacity) {
          const updatedValue =
            item.calculatedValue +
            calculateNewItemSecond(item.multitap, levelBot);
          localStorage.setItem(
            `calculatedValue_${item.resource_name}`,
            Math.min(updatedValue, item.capacity).toString()
          );
          // Cập nhật thời gian cập nhật cuối cùng
          localStorage.setItem(
            `lastUpdate_${item.resource_name}`,
            new Date().toISOString()
          );
          return {
            ...item,
            calculatedValue: Math.min(updatedValue, item.capacity),
          };
        }
        return item;
      })
    );
  }, [levelBot]);

  useEffect(() => {
    const allFull = listData.every(
      (item) => item.calculatedValue >= item.capacity
    );
    if (allFull) return;

    const timerId = setInterval(() => {
      updateListData();
    }, 1000);

    return () => clearInterval(timerId);
  }, [listData, updateListData]);

  const handleClick = useCallback(() => {
    setListData((prevListData) =>
      prevListData.map((item) => {
        if (item.calculatedValue > 0) {
          const increment = calculateNewItemSecond(item.multitap, levelBot);
          const updatedValue = Math.max(item.calculatedValue - increment, 0);

          localStorage.setItem(
            `calculatedValue_${item.resource_name}`,
            updatedValue.toString()
          );

          localStorage.setItem(
            `lastUpdate_${item.resource_name}`,
            new Date().toISOString()
          );

          return {
            ...item,
            calculatedValue: updatedValue,
            floatingText: `+${increment.toFixed(2)}`,
          };
        }
        return item;
      })
    );

    const miningValues: { [key: string]: number } = {};

    listData.forEach((item) => {
      if (item.calculatedValue > 0) {
        miningValues[item.resource_name] = item.multitap;
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

    setTimeout(() => {
      setListData((prevListData) =>
        prevListData.map((item) => ({ ...item, floatingText: undefined }))
      );
    }, 1000);
  }, [listData, levelBot, emit, user]);

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

  return (
    <>
      <VStack
        w="full"
        h="full"
        px={2}
        justifyContent="flex-start"
        overflow={"hidden"}
        pt={"70px"}
      >
        <HStack w={"full"}>
          {listData.map((item) => (
            <MemoizedMintItem key={item.resource_name} item={item} />
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
            onClick={handleClick}
            initial="normal"
            variants={clickVariants}
            whileTap="click"
            style={{
              display: "inline-block",
              position: "relative",
              userSelect: "none",
              WebkitUserSelect: "none",
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
                filter: "drop-shadow(<0px 4px 50px> rgba(239, 103, 244, 0.5))",
              }}
            />
          </motion.div>
        </Stack>
      </VStack>

      <PopupDailyRewards data={data} />
      <PopupClaimBitcoin data={data} />
    </>
  );
};

export default InfoMint;
