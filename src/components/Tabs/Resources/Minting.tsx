import { HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";

declare global {
  interface Window {
    Telegram: any;
  }
}
export default function Minting() {
  // useEffect(() => {
  //   const initTelegramWebApp = async () => {
  //     if (typeof window.Telegram !== "undefined" && window.Telegram.WebApp) {
  //       window.Telegram.WebApp.ready();

  //       const user = window.Telegram.WebApp.initDataUnsafe.user;

  //       console.log(user);
  //     }
  //   };

  //   initTelegramWebApp();
  // }, []);
  return (
    <VStack w={"full"} px={2}>
      <HStack
        w={"full"}
        borderWidth={1}
        bg={"#eff5ff"}
        borderColor={"#92A8D0"}
        p={4}
        rounded={"xl"}
        justifyContent={"space-between"}
      >
        <HStack>
          <Image src="/bitcoin.svg" />
          <Stack spacing={0}>
            <Text fontSize={"xl"} fontWeight={"bold"}>
              Bitcoin
            </Text>
            <Text>0.0015/Sec</Text>
          </Stack>
        </HStack>
        <Text fontSize={"28px"} fontWeight={"bold"} textColor={"primary.100"}>
          0.0167
        </Text>
      </HStack>
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
        <Image src="/north.svg" />

        <Text fontSize={"xl"} fontWeight={"600"}>
          Earth Resources
        </Text>
      </HStack>
    </VStack>
  );
}
