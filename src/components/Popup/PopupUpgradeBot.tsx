import useResourceCapacity from "@/hooks/useResourceCapacity";
import systemService from "@/services/system.service";
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
  VStack,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { BsArrowRight } from "react-icons/bs";
import { useBitcoin } from "../Wrapper/BitcoinProvider";
import PopupSuccessUplevel from "./PopupSuccessUplevel";
import { useTelegram } from "@/lib/TelegramProvider";

interface PopupUpgradeBotProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  item: {
    resource_name: string;
    level_resource: string;
    mining: number;
  };
  listData: {
    resource_name: string;
    mining: number;
  }[];
  levelResource: any;
}

interface ResourceCapacity {
  [key: string]: {
    [resource: string]: number;
  };
}

export default function PopupUpgradeBot({
  isOpen,
  onOpen,
  onClose,
  item,
  listData,
  levelResource,
}: PopupUpgradeBotProps) {
  const { bitcoinValue, resources, resetBitcoinValue, resetResources } =
    useBitcoin();
  const [claiming, setClaiming] = useState<boolean>(false);
  const [claimAmount, setClaimAmount] = useState<number>(0);
  const queryClient = useQueryClient();
  const [totalCoin, setTotalCoin] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const savedTotal = localStorage.getItem("totalCoin");
      return savedTotal ? parseFloat(savedTotal) : 0;
    }
    return 0;
  });

  const { user } = useTelegram();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    isOpen: onSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();

  const handleClaim = useCallback(async () => {
    setIsLoading(true);
    const updateBot = await systemService.updateBotResourcesLevel({
      telegram_id: user?.id,
      name: item.resource_name,
      level_resource: `lv${convertLevelToNumber(item.level_resource) + 1}`,
    });
    onOpenSuccess();
    onClose();
    setIsLoading(false);

    queryClient.invalidateQueries({
      queryKey: ["infoUser"],
      exact: true,
    });
  }, [item, onClose, queryClient]);

  const currentLevel = convertLevelToNumber(item.level_resource);
  const nextLevel = currentLevel + 1;
  const resourceCapacity = useResourceCapacity(nextLevel);

  const queryKey = [`infoUser`];
  const data = queryClient.getQueryData<{ btc_value: number }>(queryKey);

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
                  <Text textColor={"#D5FE4B"}>Level {currentLevel + 1}</Text>
                </HStack>
              </Stack>
              <SimpleGrid
                w={"full"}
                columns={2}
                spacing={4}
                alignContent={"center"}
              >
                {Object.entries(resourceCapacity[`lv${nextLevel}`])
                  .filter(
                    ([key]) => key === item.resource_name || key === "BTC"
                  )
                  .map(([key, value], idx) => {
                    const numericValue = typeof value === "number" ? value : 0;
                    return (
                      <VStack
                        key={key}
                        bg={"#13161F"}
                        py={2}
                        rounded={"xl"}
                        borderColor={"#3F435A"}
                        borderWidth={1}
                        borderBottomWidth={3}
                      >
                        <Image
                          src={imageResources[key]}
                          w={"44px"}
                          h={"44px"}
                        />
                        <Text fontSize={"sm"} fontWeight={600}>
                          {key}
                        </Text>
                        <HStack spacing={1}>
                          <Text
                            fontSize={"sm"}
                            textColor={
                              item.mining < numericValue ||
                              (key === "BTC" &&
                                (data?.btc_value ?? 0) < numericValue)
                                ? "#EB303B"
                                : ""
                            }
                            fontWeight={"800"}
                          >
                            {key === "BTC"
                              ? data?.btc_value
                              : listData.find(
                                  (dataItem) => dataItem.resource_name === key
                                )?.mining}
                            /{numericValue}
                          </Text>
                        </HStack>
                      </VStack>
                    );
                  })}
              </SimpleGrid>
            </VStack>
          </ModalBody>

          <ModalFooter px={2}>
            <Button
              w={"full"}
              rounded={"xl"}
              borderBottomWidth={3}
              py={5}
              isDisabled={isDisabled}
              _hover={{ bgGradient: "linear(to-b, #0DD63E 0%, #00A65B 100%)" }}
              fontWeight={800}
              borderColor={"#0DD63E"}
              bgGradient={"linear(to-b, #0DD63E 0%, #00A65B 100%)"}
              onClick={handleClaim}
            >
              {isLoading ? <Spinner size={"sm"} /> : "Purchase"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <PopupSuccessUplevel
        onClose={onCloseSuccess}
        isOpen={onSuccess}
        onOpen={onOpenSuccess}
        level={currentLevel + 1}
        miner={item.resource_name}
      />
    </Box>
  );
}
