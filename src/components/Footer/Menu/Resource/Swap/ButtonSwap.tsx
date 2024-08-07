import { Button } from "@chakra-ui/react";
import React from "react";

export default function ButtonSwap({ handleSwap }: any) {
  return (
    <Button
      variant={"solid"}
      onClick={handleSwap}
      position="absolute"
      bottom="30%"
      left="50%"
      transform="translate(-50%, -50%)"
      zIndex={1}
      px={3}
      py={5}
      _hover={{
        bgGradient: "linear(to-b, #333649 0%, #1F212E 100%)",
      }}
      borderWidth={2}
      borderRadius="2xl"
      borderColor={"#3F435A"}
      bgGradient="linear(to-b, #333649 0%, #1F212E 100%)"
      color="#D5FE4B"
      fontSize={"xl"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M17 20V4M17 4L13 8M17 4L21 8M7 4V20M7 20L3 16M7 20L11 16"
          stroke="#D5FE4B"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </Button>
  );
}
