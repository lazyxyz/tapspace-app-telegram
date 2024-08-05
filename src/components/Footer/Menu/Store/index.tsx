import { Box, Image, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";

export default function Store() {
  return (
    <VStack
      w={"full"}
      h={"full"}
      spacing={0}
      pt={16}
      px={3}
      bgGradient={"linear(to-b, #333649 0%, #1F212E 100%)"}
    >
      <SimpleGrid columns={2} w={"full"} spacing={3}>
        <Stack
          rounded={"xl"}
          bg={"#1F212E"}
          borderWidth={1}
          borderBottomWidth={3}
          borderColor={"#3F435A"}
        >
          <Image src="/assets/resources/material-steel.png" />
        </Stack>
        <Stack
          rounded={"xl"}
          bg={"#1F212E"}
          borderWidth={1}
          borderBottomWidth={3}
          borderColor={"#3F435A"}
        >
          <Image src="/assets/resources/material-alu.png" />
        </Stack>
        <Stack
          rounded={"xl"}
          bg={"#1F212E"}
          borderWidth={1}
          borderBottomWidth={3}
          borderColor={"#3F435A"}
        >
          <Image src="/assets/resources/material-fiber.png" />
        </Stack>
        <Stack
          rounded={"xl"}
          bg={"#1F212E"}
          borderWidth={1}
          borderBottomWidth={3}
          borderColor={"#3F435A"}
        >
          <Image src="/assets/resources/material-copper.png" />
        </Stack>
        <Stack
          rounded={"xl"}
          bg={"#1F212E"}
          borderWidth={1}
          borderBottomWidth={3}
          borderColor={"#3F435A"}
        >
          <Image src="/assets/resources/material-titan.png" />
        </Stack>
      </SimpleGrid>
    </VStack>
  );
}
