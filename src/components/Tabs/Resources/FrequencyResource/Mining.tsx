import React, { useEffect, useState, useCallback, memo } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import {
  Box,
  Button,
  HStack,
  Image,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useTelegram } from "@/lib/TelegramProvider";
// import { CheckLevel, checkLevel } from "@/utils/utils";

// const BitcoinDisplay = memo(
//   ({ levelBot, animatedValue }: { levelBot: number; animatedValue: any }) => (
//     <HStack
//       w={"full"}
//       borderWidth={1}
//       bg={"#eff5ff"}
//       borderColor={"#92A8D0"}
//       p={4}
//       rounded={"xl"}
//       justifyContent={"space-between"}
//       position="relative"
//     >
//       <HStack spacing={4}>
//         <Image src="/bitcoin.svg" alt="Bitcoin Icon" />
//         <VStack align="start" whiteSpace={"pre"}>
//           <Text fontSize={"xl"} fontWeight={"bold"}>
//             Bitcoin (lv{levelBot})
//           </Text>
//           <Text>{(0.015 * levelBot).toFixed(3)}/Sec</Text>
//         </VStack>
//       </HStack>
//       <motion.div
//         style={{
//           fontSize: "28px",
//           fontWeight: "bold",
//           color: "#3182ce",
//         }}
//       >
//         <motion.span>{animatedValue}</motion.span>
//       </motion.div>
//     </HStack>
//   )
// );
// BitcoinDisplay.displayName = "BitcoinDisplay";

const Minting = () => {
  const { user } = useTelegram();

  const [bitcoinValue, setBitcoinValue] = useState(() => {
    if (typeof window !== "undefined") {
      const savedValue = localStorage.getItem("bitcoinValue");
      return savedValue ? parseFloat(savedValue) : 0;
    }
    return 0;
  });

  const [totalCoin, setTotalCoin] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTotal = localStorage.getItem("totalCoin");
      return savedTotal ? parseFloat(savedTotal) : 0;
    }
    return 0;
  });

  const [claiming, setClaiming] = useState(false);
  const [claimAmount, setClaimAmount] = useState(0);

  const [levelBot, setLevelBot] = useState(() => {
    if (typeof window !== "undefined") {
      const savedValue = localStorage.getItem("levelBot");
      return Number(savedValue) || 1;
    }
    return 1;
  });

  const bitcoinValueMotion = useMotionValue(bitcoinValue);
  const animatedValue = useTransform(bitcoinValueMotion, (value) =>
    value.toFixed(4)
  );

  const [materials, setMaterials] = useState<{ [key: string]: number }>({});
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedValue = localStorage.getItem("accumulatedValues");
      if (savedValue) {
        setMaterials(JSON.parse(savedValue));
      }
    }
  }, [bitcoinValue]);

  const toast = useToast();

  const handleClaim = useCallback(() => {
    const claimValue = parseFloat(bitcoinValue.toFixed(4));
    setClaimAmount(claimValue);
    setClaiming(true);

    setTotalCoin((prevTotal) => {
      const newTotal = prevTotal + claimValue;
      localStorage.setItem("totalCoin", newTotal.toString());
      return newTotal;
    });

    setBitcoinValue(0);
    localStorage.setItem("bitcoinValue", "0");
  }, [bitcoinValue]);

  // const canUpgrade = useCallback(
  //   (currentLevel: number): boolean => {
  //     const levelKey = `lv${currentLevel}` as keyof CheckLevel;
  //     const requirements = checkLevel[levelKey];
  //     return (
  //       materials.Steel >= requirements.Steel &&
  //       materials.Aluminum >= requirements.Aluminum &&
  //       materials.Copper >= requirements.Copper &&
  //       materials.Fiber >= requirements.Fiber &&
  //       materials.Titanium >= requirements.Titanium
  //     );
  //   },
  //   [materials]
  // );

  // const upgradeLevel = useCallback(() => {
  //   if (canUpgrade(levelBot)) {
  //     const levelKey = `lv${levelBot}` as keyof CheckLevel;
  //     const requirements = checkLevel[levelKey];

  //     setMaterials((prevMaterials: any) => {
  //       const newMaterials = {
  //         ...prevMaterials,
  //         Steel: prevMaterials.Steel - requirements.Steel,
  //         Aluminum: prevMaterials.Aluminum - requirements.Aluminum,
  //         Copper: prevMaterials.Copper - requirements.Copper,
  //         Fiber: prevMaterials.Fiber - requirements.Fiber,
  //         Titanium: prevMaterials.Titanium - requirements.Titanium,
  //       };
  //       localStorage.setItem("materials", JSON.stringify(newMaterials));
  //       return newMaterials;
  //     });

  //     setLevelBot((prevLevel) => {
  //       const newLevel = prevLevel + 1;
  //       localStorage.setItem("levelBot", newLevel.toString());
  //       return newLevel;
  //     });

  //     toast({
  //       status: "success",
  //       title: "Upgrade complete",
  //       description: `You can upgrade to level${levelBot + 1}`,
  //       position: "top-right",
  //       isClosable: true,
  //       duration: 3000,
  //     });
  //   } else {
  //     toast({
  //       status: "warning",
  //       title: "",
  //       description: "You must mine enough materials to upgrade",
  //       position: "top-right",
  //       isClosable: true,
  //       duration: 3000,
  //     });
  //   }
  // }, [levelBot, materials, canUpgrade, toast]);

  useEffect(() => {
    if (claiming) {
      const timer = setTimeout(() => {
        setClaiming(false);
        setClaimAmount(0);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [claiming]);

  // useEffect(() => {
  //   const materialInterval = setInterval(() => {
  //     setMaterials((prevMaterials) => {
  //       const newMaterials = { ...prevMaterials };
  //       for (const key in newMaterials) {
  //         newMaterials[key] += 1;
  //       }
  //       localStorage.setItem("accumulatedValues", JSON.stringify(newMaterials));
  //       return newMaterials;
  //     });
  //   }, 1000);
  //   return () => clearInterval(materialInterval);
  // }, []);

  return (
    <VStack w={"full"} px={2} align="center">
      {user && (
        <VStack alignItems={"start"} w={"full"}>
          <Text>Username: {user?.username}</Text>
          <Text>TelegramId: {user?.id}</Text>
        </VStack>
      )}
      <HStack justifyContent={"space-between"} w={"full"} py={2}>
        <Text fontSize={"lg"}>
          Total Coin:{" "}
          <Box
            as={"span"}
            textColor={"primary.100"}
            fontWeight={"bold"}
            fontSize={"xl"}
          >
            {totalCoin}
          </Box>
        </Text>
      </HStack>
      {/* <HStack justifyContent={"start"} w={"full"}>
        <Box>
          <Button onClick={handleClaim}>Claim Bitcoin</Button>
        </Box>
        <Button onClick={upgradeLevel} bg={"primary.100"} textColor={"white"}>
          Upgrade bot
        </Button>
      </HStack>
      <BitcoinDisplay levelBot={levelBot} animatedValue={animatedValue} /> */}
      <HStack
        w={"full"}
        borderWidth={1}
        bg={"#eff5ff"}
        borderColor={"#92A8D0"}
        p={4}
        spacing={3}
        rounded={"xl"}
        justifyContent={"start"}
      >
        <Image src="/north.svg" alt="Earth Resources Icon" />
        <Text fontSize={"xl"} fontWeight={"600"}>
          Earth Resources
        </Text>
      </HStack>

      <Text textColor={"primary.100"} fontSize={"sm"} fontWeight={"bold"}>
        Total resource
      </Text>
      <HStack>
        {Object.entries(materials)
          .slice(0, 5)
          .map(([key, value]) => (
            <Text
              borderWidth={1}
              p={1}
              rounded={"xl"}
              textAlign={"center"}
              key={key}
              fontSize={"sm"}
            >
              {key} {value.toFixed(0)}
            </Text>
          ))}
      </HStack>
      <Text
        textColor={"primary.100"}
        fontSize={"sm"}
        fontWeight={"bold"}
        pt={2}
      >
        Level {levelBot + 1} needed
      </Text>
      <HStack>
        {/* @ts-ignore */}
        {Object.entries(checkLevel["lv" + levelBot])
          .slice(0, 5)
          .map(([key, value]) => (
            <Text
              borderWidth={1}
              p={1}
              rounded={"xl"}
              textAlign={"center"}
              textColor={"primary.100"}
              key={key}
              fontSize={"sm"}
            >
              {/* @ts-ignore */}
              {key} {value}
            </Text>
          ))}
      </HStack>
    </VStack>
  );
};

export default Minting;
