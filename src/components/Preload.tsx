import {
  Box,
  Image,
  Progress,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect } from "react";

export default function Preload({ progress, loading }: any) {
  useEffect(() => {
    const storedValue = localStorage.getItem("chakra-ui-color-mode");
    if (storedValue === "light") {
      localStorage.setItem("chakra-ui-color-mode", "dark");
      window.location.reload();
    }
  }, []);

  return (
    <VStack
      overflowY="auto"
      overflowX="hidden"
      position={"absolute"}
      h={"100vh"}
      zIndex={10000}
      top={0}
      right={0}
      left={0}
      w={"full"}
      bgImage={"/preBg.png"}
      bgRepeat={"no-repeat"}
      bgSize={"cover"}
      justifyContent={"center"}
    >
      <Box
        flex="1"
        display="flex"
        alignItems="center"
        flexDirection={"column"}
        justifyContent="center"
        gap={6}
      >
        <Image src="/logo.svg" />

        <Box w="80%" mt={16}>
          <Text color="white" fontWeight="800" textAlign="center" my={2}>
            {progress}%
          </Text>

          <Stack
            spacing={5}
            w={"full"}
            bg="rgba(255, 255, 255, 0.2)"
            rounded={"xl"}
            position="relative"
            h={3}
            overflow="hidden"
          >
            <Box
              style={{
                width: `${Math.min(progress, 100)}%`,
                height: "100%",
                backgroundColor: "#D5FE4B",
                borderRadius: "inherit",
              }}
            />
          </Stack>
        </Box>
      </Box>

      <Stack spacing={0} align="center" pb={6}>
        <Text fontSize="sm">Powered by</Text>
        <Text fontWeight={800} fontSize="sm" textColor="white">
          Grindy Technologies
        </Text>
      </Stack>
    </VStack>
  );
}
