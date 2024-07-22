import { Box, Image, Spinner, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";

export default function Preload() {
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
        <Spinner size={"xl"} color="#1EA2ED" />
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
