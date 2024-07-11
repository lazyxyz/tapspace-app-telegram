import { Box, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Telegram: any;
  }
}
export default function Minting() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    script.onload = () => {
      if (window.Telegram) {
        window.Telegram.WebApp.ready();
        const userData = window.Telegram.WebApp.initDataUnsafe?.user;
      }
    };
    document.body.appendChild(script);
  }, []);

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
            {user ? (
              <Box>
                <Text>ID: {user.id}</Text>
                <Text>First Name: {user.first_name}</Text>
                <Text>Last Name: {user.last_name}</Text>
                <Text>Username: {user.username}</Text>
              </Box>
            ) : (
              <Text>Loading user information...</Text>
            )}
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
