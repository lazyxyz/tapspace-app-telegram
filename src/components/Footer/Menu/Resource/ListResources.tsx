"use client";

import PopupUpgradeBot from "@/components/Popup/PopupUpgradeBot";
import { useBitcoin } from "@/components/Wrapper/BitcoinProvider";
import { queryClient } from "@/components/Wrapper/QueryClientProvider";
import useResourceCapacity from "@/hooks/useResourceCapacity";
import {
  checkPassiveUplevel,
  imageResources,
  numeralFormatResources,
} from "@/utils/utils";
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
import { useMemo } from "react";

export default function ListResources() {
  const { data } = useQuery<any>({
    queryKey: ["infoUser"],
  });

  const { resourcesSocket } = useBitcoin();

  return (
    <Stack>
      {data?.resources.map((item: any, idx: number) => (
        <Stack
          key={idx}
          bg={"#13161F"}
          w={"full"}
          px={3}
          py={4}
          rounded={"xl"}
          borderWidth={1}
          borderBottomWidth={3}
          borderColor={"#3F435A"}
        >
          <HStack justifyContent={"space-between"}>
            <HStack>
              <Box bg={"rgba(255, 255, 255, 0.12)"} p={2} rounded={"xl"}>
                <Image
                  src={imageResources[item?.resource_name]}
                  w={"56px"}
                  h={"56px"}
                />
              </Box>
              <VStack align={"start"}>
                <Stack spacing={0}>
                  <Text fontWeight={"800"}>{item.resource_name}</Text>
                  <Text fontSize={"xs"}>
                    {Number(
                      checkPassiveUplevel[item.resource_name] *
                        Math.pow(1 + 0.1, item.level_resource - 1)
                    ).toFixed(5)}
                    /s
                  </Text>
                </Stack>
                <HStack align={"center"} spacing={1}>
                  <Image
                    src={imageResources[item?.resource_name]}
                    w={"16px"}
                    h={"16px"}
                  />
                  <Text fontSize={"sm"} fontWeight={"800"}>
                    {resourcesSocket?.resources
                      ? numeralFormatResources(
                          resourcesSocket.resources[item.resource_name] || 0,
                          2
                        )
                      : "-"}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <BotResource item={data.resources[idx]} data={data} idx={idx} />
          </HStack>
        </Stack>
      ))}
    </Stack>
  );
}

const BotResource = ({ item, data, idx }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentLevel = Number(item.level_resource);
  const nextLevel = currentLevel + 1;
  const resourceCapacity = useResourceCapacity(Number(nextLevel));

  const isDisabled = useMemo(() => {
    return Object.entries(resourceCapacity[`lv${nextLevel}`])
      .filter(([key]) => key === item.resource_name || key === "BTC")
      .some(([key, value]) => {
        const numericValue = typeof value === "number" ? value : 0;
        return (
          item.mining < numericValue ||
          (key === "BTC" && (data?.btc_value ?? 0) < numericValue)
        );
      });
  }, [item, resourceCapacity, nextLevel, data]);

  return (
    <Box
      bg={"rgba(255, 255, 255, 0.12)"}
      position={"relative"}
      borderWidth={1}
      borderColor={!isDisabled ? "#D5FE4B" : "transparent"}
      p={2}
      rounded={"xl"}
      onClick={() => {
        onOpen(),
          queryClient.refetchQueries({
            queryKey: ["infoUser"],
          });
      }}
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
        Level {data?.resources[idx].level_resource}
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
        bgGradient={!isDisabled ? "linear(to-b, #0DD63E 0%, #00A65B 100%)" : ""}
      >
        Upgrade
      </Button>

      <PopupUpgradeBot
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        item={item}
        data={data}
        levelResource={data?.resources[idx].level_resource}
        isDisabled={isDisabled}
      />
    </Box>
  );
};
