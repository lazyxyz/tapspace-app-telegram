import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  motion,
  animate,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Box,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import ThreeDButton from "./ButtonMint";
import { DataMint } from "@/lib/data";
import { FaBitcoinSign } from "react-icons/fa6";
import { PiHandCoins } from "react-icons/pi";

type MintItemType = {
  name: string;
  second: number;
  allocation: number;
  image: string;
  calculatedValue: number;
  floatingText?: string;
};

const InfoMint = () => {
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

  const [accumulatedValues, setAccumulatedValues] = useState<{
    [key: string]: number;
  }>(() => {
    if (typeof window !== "undefined") {
      const savedValues = JSON.parse(
        localStorage.getItem("accumulatedValues") || "{}"
      );
      return savedValues;
    }

    return "{}";
  });

  const [levelBot, setLevelBot] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const storedLevelBot = localStorage.getItem("levelBot");
      return storedLevelBot ? parseInt(storedLevelBot) : 1;
    }
    return 1;
  });

  const [totalItems, setTotalItems] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedTotalItems = Number(localStorage.getItem("totalItems")) || 0;
      return savedTotalItems;
    }
    return 0;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateListData = useCallback(() => {
    setListData((prevListData: any) => {
      const updatedList = prevListData.map((item: any) => {
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

      return updatedList;
    });
  }, [levelBot]);

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
  }, [levelBot, resetTimer]);

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

const FloatingText = ({ text }: { text: string }) => (
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
      //@ts-ignore
      setFloatingTexts((prevTexts) => [...prevTexts, item.floatingText]);
      setTimeout(() => {
        setFloatingTexts((prevTexts) => prevTexts.slice(1));
      }, 1000);
    }
  }, [item.calculatedValue, calculatedValueMotion, item.floatingText]);

  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow((prevShow) => !prevShow);
    }, 1000);

    return () => clearInterval(interval);
  }, [show]);
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
      position="relative"
    >
      <HStack>
        <Box
          bg={item.allocation > 0 ? "white" : "#657BAE"}
          p={2}
          rounded={"xl"}
        >
          <Image src={item.image} />
        </Box>
        <VStack align={"start"}>
          <Text color={"primary.100"} fontSize={"md"} fontWeight={"bold"}>
            {item.name}
          </Text>
          <HStack position={"relative"}>
            <Icon as={PiHandCoins} fontSize={"sm"} color={"yellow.500"} />
            <AnimatePresence>
              {show && (
                <motion.div
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: -10 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 1 }}
                  key="animatedText"
                  style={{ position: "absolute", left: "20px" }}
                >
                  <Text
                    fontSize={"xs"}
                    textColor={"green"}
                    fontWeight={"semibold"}
                  >
                    +1
                  </Text>
                </motion.div>
              )}
            </AnimatePresence>
          </HStack>
        </VStack>
      </HStack>

      <HStack w={"50%"} justifyContent={"space-between"}>
        <Text color={"primary.100"} fontWeight={"600"} fontSize={"md"}>
          {item.second}/Sec
        </Text>

        <HStack spacing={0} justifyContent={"end"}>
          <Text
            as={motion.span}
            fontSize={"md"}
            fontWeight={"bold"}
            textColor={"primary.100"}
          >
            {/* @ts-ignore */}
            {animatedValue}
          </Text>

          <Text color={"primary.100"} fontWeight={"bold"} fontSize={"md"}>
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

export const calculateNewItemSecond = (
  currentItemSecond: any,
  levelBot: any
) => {
  let newItemSecond = currentItemSecond;
  for (let i = 1; i < levelBot; i++) {
    newItemSecond = newItemSecond + newItemSecond * 0.05;
  }
  return parseFloat(newItemSecond.toFixed(2));
};
