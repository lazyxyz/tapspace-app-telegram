import useResourceCapacity from "@/hooks/useResourceCapacity";
import { useTelegram } from "@/lib/TelegramProvider";
import systemService from "@/services/system.service";
import {
  checkPassiveUplevel,
  imageResources,
  numeralFormat,
} from "@/utils/utils";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { BsArrowRight, BsLightningChargeFill } from "react-icons/bs";
import { useBitcoin } from "../Wrapper/BitcoinProvider";
import PopupSuccessUplevel from "./PopupSuccessUplevel";
import { IconArrowRight } from "../Icons";
import { queryClient } from "../Wrapper/QueryClientProvider";
import { CurrentPassive } from "./PopupUpgradeBot";

interface PopupUpgradeBotProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  listData: {
    resource_name: string;
    mining: number;
  }[];
  levelResource: any;
  isInsufficientResources: boolean;
}

export default function PopupUpgradeBtc({
  isOpen,
  onOpen,
  onClose,
  listData,
  levelResource,
  isInsufficientResources,
}: PopupUpgradeBotProps) {
  const { bitcoinValue, resources, resetBitcoinValue, resetResources } =
    useBitcoin();

  const [claiming, setClaiming] = useState<boolean>(false);
  const [claimAmount, setClaimAmount] = useState<number>(0);
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
    const updateBot = await systemService.updateBotBtc({
      telegram_id:
        process.env.NEXT_PUBLIC_API_ID_TELEGRAM || user?.id.toString(),
      level: `${levelResource + 1}`,
    });
    onOpenSuccess();
    onClose();
    setIsLoading(false);

    queryClient.refetchQueries({
      queryKey: ["infoUser"],
    });
  }, [onClose, levelResource, queryClient, onOpenSuccess, user?.id]);

  const currentLevel = levelResource;
  const nextLevel = currentLevel + 1;
  const resourceCapacity = useResourceCapacity(nextLevel);

  const { data } = useQuery<any>({
    queryKey: ["infoUser"],
  });

  const resourcesForNextLevel = resourceCapacity[`lv${nextLevel}`] || {};

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
          <ModalBody p={0}>
            <VStack
              spacing={5}
              p={4}
              w={"full"}
              rounded={"xl"}
              position={"relative"}
            >
              <Stack align={"center"}>
                <Text fontSize={"lg"} textColor={"white"} fontWeight={800}>
                  Upgrade BTC
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
                  BTC
                </Text>

                <HStack
                  fontWeight={"800"}
                  textTransform={"uppercase"}
                  textColor={"#ECEFF9"}
                >
                  <Text>Level {currentLevel}</Text>
                  <Icon as={IconArrowRight} />
                  <Text textColor={"#D5FE4B"}>Level {currentLevel + 1}</Text>
                </HStack>

                <CurrentPassive currentLevel={currentLevel} item={""} isBtc />
              </Stack>
              <SimpleGrid
                w={"full"}
                columns={3}
                spacing={4}
                alignContent={"center"}
              >
                {Object.entries(resourcesForNextLevel).map(
                  ([key, value], idx) => {
                    const numericValue = typeof value === "number" ? value : 0;
                    return (
                      <VStack
                        key={key}
                        bg={"#13161F"}
                        p={3}
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
                        <Text
                          fontSize={"sm"}
                          fontWeight={600}
                          textColor={"#BBC1DE"}
                        >
                          {key}
                        </Text>
                        <HStack spacing={1}>
                          <Text
                            fontSize={"sm"}
                            textColor={
                              listData[idx]?.mining < numericValue ||
                              (key === "BTC" &&
                                (data?.btc_value ?? 0) < numericValue)
                                ? "#EB303B"
                                : ""
                            }
                            fontWeight={"800"}
                          >
                            {key === "BTC"
                              ? numeralFormat(Number(data?.btc_value))
                              : numeralFormat(
                                  Number(
                                    listData.find(
                                      (dataItem) =>
                                        dataItem.resource_name === key
                                    )?.mining
                                  )
                                )}
                            /{numeralFormat(numericValue)}
                          </Text>
                        </HStack>
                      </VStack>
                    );
                  }
                )}
              </SimpleGrid>
            </VStack>
          </ModalBody>

          <ModalFooter px={4}>
            <Button
              w={"full"}
              rounded={"xl"}
              borderBottomWidth={3}
              py={5}
              isDisabled={isInsufficientResources}
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
        level={currentLevel}
        miner={""}
        isBtc={true}
      />
    </Box>
  );
}
