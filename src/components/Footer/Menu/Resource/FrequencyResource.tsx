"use client";

import PopupUpgradeBtc from "@/components/Popup/PopupUpgradeBtc";
import {
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import BitcoinDisplay from "./Bitcoin";
import { useMemo } from "react";
import useResourceCapacity from "@/hooks/useResourceCapacity";
interface QueryData {
  bot_level?: string;
}
const FrequencyResource = () => {
  const { data } = useQuery<any>({
    queryKey: ["infoUser"],
  });

  const botLevel = data?.bot_level;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const nextLevel = botLevel + 1;
  const resourceCapacity = useResourceCapacity(nextLevel);
  const resourcesForNextLevel = resourceCapacity[`lv${nextLevel}`] || {};

  const isDisabled = useMemo(() => {
    return Object.entries(resourcesForNextLevel).some(([key, value], idx) => {
      const numericValue = typeof value === "number" ? value : 0;
      const userValue = data?.resources[idx]?.mining ?? 0;
      return userValue < numericValue;
    });
  }, [resourcesForNextLevel, data?.resources, data]);

  return (
    <VStack w={"full"}>
      <Stack
        bg={"#13161F"}
        borderWidth={1}
        borderBottomWidth={3}
        borderColor={"#3F435A"}
        rounded={"xl"}
        w={"full"}
        px={3}
        py={4}
      >
        <HStack justifyContent={"space-between"}>
          <BitcoinDisplay
            levelBot={Number(botLevel)}
            totalBit={data?.btc_value}
          />

          <Box
            bg={"rgba(255, 255, 255, 0.12)"}
            borderWidth={1}
            borderColor={!isDisabled ? "#D5FE4B" : "transparent"}
            position={"relative"}
            p={2}
            rounded={"xl"}
            onClick={() => onOpen()}
          >
            <Image src="/bot.svg" w={"56px"} h={"56px"} />
            <Text
              fontSize={"10px"}
              fontWeight={800}
              position={"absolute"}
              bg={"#1EA2ED"}
              px={2}
              py={1}
              rounded={"xl"}
              left={2.5}
              top={-2}
              whiteSpace={"pre"}
            >
              Level {botLevel}
            </Text>
            <Button
              bottom={0}
              w={"full"}
              left={0}
              right={0}
              roundedTop={0}
              rounded={"xl"}
              variant={"unsyled"}
              fontSize={"xs"}
              h={"24px"}
              position={"absolute"}
              bg={isDisabled ? "#545978" : ""}
              bgGradient={
                !isDisabled ? "linear(to-b, #0DD63E 0%, #00A65B 100%)" : ""
              }
            >
              Upgrade
            </Button>
          </Box>
        </HStack>
      </Stack>

      <PopupUpgradeBtc
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        listData={data?.resources}
        levelResource={botLevel}
        isInsufficientResources={isDisabled}
      />
    </VStack>
  );
};

export default FrequencyResource;
