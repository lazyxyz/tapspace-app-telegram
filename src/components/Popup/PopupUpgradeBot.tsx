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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { BsLightningChargeFill } from "react-icons/bs";
import { IconArrowRight, IconClose } from "../Icons";
import { queryClient } from "../Wrapper/QueryClientProvider";
import PopupSuccessUplevel from "./PopupSuccessUplevel";

interface PopupUpgradeBotProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  item: {
    resource_name: string;
    level_resource: string;
    mining: number;
  };
  levelResource: any;
  isDisabled: any;
  data: any;
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
  levelResource,
  isDisabled,
  data,
}: PopupUpgradeBotProps) {
  const { user } = useTelegram();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    isOpen: onSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();
  const toast = useToast();
  const handleClaim = useCallback(async () => {
    setIsLoading(true);
    try {
      const updateBot = await systemService.updateBotResourcesLevel({
        telegram_id:
          user?.id.toString() || process.env.NEXT_PUBLIC_API_ID_TELEGRAM,
        name: item.resource_name,
        level_resource: `${item.level_resource + 1}`,
      });
      onOpenSuccess();

      setIsLoading(false);

      queryClient.refetchQueries({
        queryKey: ["infoUser"],
      });
    } catch (error) {
      toast({
        status: "error",
        title: "Failed",
        description: String(error),
        position: "top-right",
        isClosable: true,
        duration: 3000,
      });
    }
  }, [item, onClose, queryClient]);

  const currentLevel = Number(item.level_resource);
  const nextLevel = currentLevel + 1;
  const resourceCapacity = useResourceCapacity(Number(nextLevel));

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
          <Box
            position={"absolute"}
            right={3}
            top={3}
            zIndex={99}
            onClick={onClose}
          >
            <Icon as={IconClose} right={0} position={"absolute"} w={"full"} />
          </Box>
          <ModalBody>
            <VStack spacing={5} w={"full"} rounded={"xl"} position={"relative"}>
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

                <HStack
                  fontWeight={"800"}
                  textColor={"#ECEFF9"}
                  textTransform={"uppercase"}
                >
                  <Text>Level {currentLevel}</Text>
                  <Icon as={IconArrowRight} />
                  <Text textColor={"#D5FE4B"}>Level {currentLevel + 1}</Text>
                </HStack>

                <CurrentPassive currentLevel={currentLevel} item={item} />
              </Stack>
              <SimpleGrid
                w={"full"}
                columns={2}
                spacing={4}
                alignContent={"center"}
              >
                {Object.entries(resourceCapacity[`lv${nextLevel}`])
                  .filter(
                    ([key]) => key === item.resource_name || key === "TS-BTC"
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
                              (key === "TS-BTC" &&
                                (data?.btc_value ?? 0) < numericValue)
                                ? "#EB303B"
                                : ""
                            }
                            fontWeight={"800"}
                          >
                            {item.mining < numericValue ||
                            (key === "TS-BTC" &&
                              (data?.btc_value ?? 0) < numericValue) ? (
                              <>
                                {key === "TS-BTC"
                                  ? numeralFormat(data?.btc_value)
                                  : numeralFormat(
                                      Number(
                                        data?.resources.find(
                                          (dataItem: any) =>
                                            dataItem.resource_name === key
                                        )?.mining
                                      )
                                    )}
                                /{numeralFormat(numericValue)}
                              </>
                            ) : (
                              numeralFormat(numericValue)
                            )}
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
        level={currentLevel}
        miner={item}
        isBtc={false}
      />
    </Box>
  );
}

export const CurrentPassive = ({
  currentLevel,
  item,
  isBtc,
}: {
  currentLevel: number;
  item: any;
  isBtc?: boolean;
}) => {
  return (
    <HStack
      fontSize={"sm"}
      fontWeight={"bold"}
      bg={"rgba(255, 255, 255, 0.15)"}
      px={2}
      py={1}
      rounded={"2xl"}
      borderWidth={1}
    >
      <HStack spacing={1} align={"center"}>
        <Stack bg={"#D5FE4B"} rounded={"full"} color={"black"} p={1}>
          <Icon fontSize={"10px"} as={BsLightningChargeFill} />
        </Stack>

        <Text fontWeight={800}>
          {isBtc
            ? (0.00011575 * Math.pow(1 + 0.2, currentLevel - 1)).toFixed(7)
            : numeralFormat(
                checkPassiveUplevel[item.resource_name] *
                  Math.pow(1 + 0.1, currentLevel - 1)
              )}
          /s
        </Text>
      </HStack>
      <Icon as={IconArrowRight} />
      <HStack spacing={1} align={"center"}>
        <Stack bg={"#D5FE4B"} rounded={"full"} color={"black"} p={1}>
          <Icon fontSize={"10px"} as={BsLightningChargeFill} />
        </Stack>

        <Text fontWeight={800}>
          {isBtc
            ? (0.00011575 * Math.pow(1 + 0.2, currentLevel)).toFixed(7)
            : numeralFormat(
                checkPassiveUplevel[item.resource_name] *
                  Math.pow(1 + 0.1, currentLevel)
              )}
          /s
        </Text>
      </HStack>
    </HStack>
  );
};
