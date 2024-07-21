import { convertLevelToNumber, imageResources } from "@/utils/utils";
import {
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  UseDisclosureProps,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useBitcoin } from "./Wrapper/BitcoinProvider";
import systemService from "@/services/system.service";
import { useQueryClient } from "@tanstack/react-query";
import { BsArrowRight } from "react-icons/bs";
import useResourceCapacity from "@/hooks/useResourceCapacity";

export default function PopupUpgradeBot({
  isOpen,
  onOpen,
  onClose,
  item,
}: any) {
  const { bitcoinValue, resources, resetBitcoinValue, resetResources } =
    useBitcoin();
  const [claiming, setClaiming] = useState(false);
  const [claimAmount, setClaimAmount] = useState(0);
  const queryClient = useQueryClient();
  const [totalCoin, setTotalCoin] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTotal = localStorage.getItem("totalCoin");
      return savedTotal ? parseFloat(savedTotal) : 0;
    }
    return 0;
  });

  const [isLoading, setIsLoading] = useState(false);

  //   const handleClaim = useCallback(async () => {
  //     setIsLoading(true);
  //     const claimValue = parseFloat((bitcoinValue + offlineEarnings).toFixed());
  //     setClaimAmount(claimValue);
  //     setClaiming(true);

  //     setTotalCoin((prevTotal) => {
  //       const newTotal = prevTotal + claimValue;
  //       localStorage.setItem("totalCoin", newTotal.toString());
  //       return newTotal;
  //     });

  //     const updateBtc = await systemService.updateTokenBtc({
  //       telegram_id: "6298608837",
  //       btc_value: claimValue,
  //     });

  //     const updatedResources = await systemService.updateMining({
  //       telegram_id: "6298608837",
  //       mining_values: {
  //         Steel: resources["Steel"],
  //         Aluminum: resources["Aluminum"],
  //         Copper: resources["Copper"],
  //         Fiber: resources["Fiber"],
  //         Titanium: resources["Titanium"],
  //       },
  //     });
  //     resetBitcoinValue();
  //     resetResources();
  //     onClose();
  //     setIsLoading(false);
  //     queryClient.invalidateQueries({
  //       queryKey: ["infoUser"],
  //       exact: true,
  //     });
  //   }, [
  //     bitcoinValue,
  //     offlineEarnings,
  //     resetBitcoinValue,
  //     resetResources,
  //     queryClient,
  //   ]);

  const currentLevel = convertLevelToNumber(item.level_resource);
  const nextLevel = currentLevel + 1;
  const resourceCapacity = useResourceCapacity(nextLevel);

  return (
    <Box>
      <Modal isOpen={isOpen} isCentered onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          borderWidth={1}
          borderBottomWidth={3}
          borderColor={"#3F435A"}
          mx={4}
          bgGradient="linear(to-b, #333649 0%, #1F212E 100%)"
          rounded={"xl"}
        >
          <ModalBody>
            <VStack
              borderWidth={1}
              borderBottomWidth={3}
              borderColor={"#3F435A"}
              spacing={5}
              bg={"#13161F"}
              p={4}
              mt={16}
              w={"full"}
              rounded={"xl"}
              position={"relative"}
            >
              <Stack align={"center"}>
                <Text fontSize={"lg"} textColor={"white"} fontWeight={800}>
                  Upgrade Miner
                </Text>
                <Box
                  bg={"rgba(255, 255, 255, 0.15)"}
                  py={4}
                  px={6}
                  rounded={"xl"}
                  borderWidth={1}
                >
                  <Image src="/assets/botGirl.png" w={"46px"} h={"64px"} />
                </Box>

                <Text fontSize={"sm"} fontWeight={700} textColor={"#DADFF4"}>
                  {item.resource_name} Miner
                </Text>

                <HStack fontWeight={"800"} textColor={"#ECEFF9"}>
                  <Text>Level {currentLevel}</Text>
                  <Icon as={BsArrowRight} />
                  <Text textColor={"#D5FE4B"}>Level {nextLevel}</Text>
                </HStack>
              </Stack>
              <SimpleGrid w={"full"} columns={3} spacing={4}>
                {Object.entries(resourceCapacity[`lv${nextLevel}`]).map(
                  ([key, value]) => (
                    <VStack
                      key={key}
                      bg={"#13161F"}
                      py={2}
                      rounded={"xl"}
                      borderColor={"#3F435A"}
                      borderWidth={1}
                      borderBottomWidth={3}
                    >
                      <Image src={imageResources[key]} w={"44px"} h={"44px"} />
                      <Text fontSize={"sm"} fontWeight={600}>
                        {key}
                      </Text>
                      <HStack spacing={1}>
                        <Text
                          fontSize={"sm"}
                          textColor={
                            item.mining < (value || 0) ? "#EB303B" : ""
                          }
                          fontWeight={"800"}
                        >
                          {item.mining}/{value}
                        </Text>
                      </HStack>
                    </VStack>
                  )
                )}
              </SimpleGrid>
            </VStack>
          </ModalBody>

          <ModalFooter px={2}>
            <Button
              w={"full"}
              rounded={"xl"}
              borderBottomWidth={3}
              py={5}
              variant={"hover"}
              fontWeight={800}
              borderColor={"#0DD63E"}
              bgGradient={"linear(to-b, #0DD63E 0%, #00A65B 100%)"}
              //   onClick={handleClaim}
            >
              {isLoading ? <Spinner size={"sm"} /> : "Purchase"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
