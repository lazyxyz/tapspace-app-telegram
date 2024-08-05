import useResourceCapacity from "@/hooks/useResourceCapacity";
import { useTelegram } from "@/lib/TelegramProvider";
import systemService from "@/services/system.service";
import {
  checkPassiveUplevel,
  imageResources,
  imageSkills,
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
import { useCallback, useMemo, useState } from "react";
import { BsLightningChargeFill } from "react-icons/bs";
import { IconArrowRight, IconClose } from "../Icons";
import { queryClient } from "../Wrapper/QueryClientProvider";
import PopupSuccessUplevel from "./PopupSuccessUplevel";
import useResourcesSpaceship from "@/hooks/useUpdateResources";

interface PopupUpgradeBotProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  item: { level: number; pro_spaceship_name: string };
  isDisabled: any;
  data: any;
}

interface ResourceCapacity {
  [key: string]: {
    [resource: string]: number;
  };
}

export default function PopupUpgradeSpacship({
  isOpen,
  onClose,
  item,
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
      const updateBot = await systemService.updatePropertiesSpaceship({
        telegram_id:
          user?.id.toString() || process.env.NEXT_PUBLIC_API_ID_TELEGRAM,
        name: item.pro_spaceship_name,
        level: `${item.level + 1}`,
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

  const currentLevel = Number(item.level);
  const nextLevel = currentLevel + 1;

  const resourceSpaceship = useResourcesSpaceship(Number(nextLevel));
  const isDisabled2 = useMemo(() => {
    return Object.entries(resourceSpaceship as any).some(([key, value]) => {
      const numericValue = typeof value === "number" ? value : 0;
      const mining = data?.resources.find(
        (dataItem: any) => dataItem.resource_name === key
      )?.mining;
      return (
        mining < numericValue ||
        (key === "TS-BTC" && (data?.btc_value ?? 0) < numericValue)
      );
    });
  }, [data, resourceSpaceship]);

  console.log(isDisabled2);

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
          <ModalBody px={2}>
            <VStack spacing={5} w={"full"} rounded={"xl"} position={"relative"}>
              <Stack align={"center"}>
                <Text fontSize={"lg"} textColor={"white"} fontWeight={800}>
                  Upgrade Spaceship
                </Text>
                <Box
                  bg={"rgba(255, 255, 255, 0.15)"}
                  p={2}
                  rounded={"xl"}
                  borderWidth={1}
                >
                  <Image
                    src={imageSkills[item.pro_spaceship_name]}
                    w={"64px"}
                    rounded={"xl"}
                    h={"64px"}
                  />
                </Box>

                <Text fontSize={"sm"} fontWeight={700} textColor={"#DADFF4"}>
                  {item.pro_spaceship_name}
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

                {/* <CurrentPassive currentLevel={currentLevel} item={item} /> */}
              </Stack>

              <SimpleGrid
                w={"full"}
                columns={3}
                spacing={2}
                alignContent={"center"}
              >
                {Object.entries(resourceSpaceship as any).map(
                  ([key, value], idx) => {
                    const mining = data?.resources[idx]?.mining;
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
                        spacing={1}
                      >
                        <Image
                          src={imageResources[key]}
                          w={"32px"}
                          h={"32px"}
                        />
                        <Text fontSize={"sm"} fontWeight={600}>
                          {key}
                        </Text>
                        <HStack spacing={1}>
                          <Text
                            fontSize={"sm"}
                            textColor={
                              mining < numericValue ||
                              (key === "TS-BTC" &&
                                (data?.btc_value ?? 0) < numericValue)
                                ? "#EB303B"
                                : ""
                            }
                            fontWeight={"800"}
                          >
                            {mining < numericValue ||
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
                  }
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
              isDisabled={!isDisabled2}
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
            ? (0.00002315 * Math.pow(1 + 0.2, currentLevel)).toFixed(7)
            : numeralFormat(
                checkPassiveUplevel[item.pro_spaceship_name] *
                  Math.pow(1 + 0.1, currentLevel)
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
            ? (0.00002315 * Math.pow(1 + 0.2, currentLevel + 1)).toFixed(7)
            : numeralFormat(
                checkPassiveUplevel[item.pro_spaceship_name] *
                  Math.pow(1 + 0.1, currentLevel + 1)
              )}
          /s
        </Text>
      </HStack>
    </HStack>
  );
};
