import { imageResources, numeralFormat } from "@/utils/utils";
import {
  Box,
  Button,
  HStack,
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
import { useCallback, useEffect, useState } from "react";
import { useBitcoin } from "../Wrapper/BitcoinProvider";
import systemService from "@/services/system.service";
import { useQueryClient } from "@tanstack/react-query";
import { useTelegram } from "@/lib/TelegramProvider";

export default function PopupClaimBitcoin({ data }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useTelegram();
  const {
    bitcoinValue,
    //@ts-ignore
    offlineEarnings,
    resources,
    resetBitcoinValue,
    resetResources,
  } = useBitcoin();
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

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const [isLoading, setIsLoading] = useState(false);

  const handleClaim = useCallback(async () => {
    setIsLoading(true);
    //@ts-ignore
    const claimValue = parseFloat(bitcoinValue + offlineEarnings);
    setClaimAmount(claimValue);
    setClaiming(true);

    setTotalCoin((prevTotal) => {
      const newTotal = prevTotal + claimValue;
      localStorage.setItem("totalCoin", newTotal.toString());
      return newTotal;
    });

    const updateBtc = await systemService.updateTokenBtc({
      telegram_id:
        process.env.NEXT_PUBLIC_API_ID_TELEGRAM || user?.id.toString(),
      btc_value: claimValue,
    });

    const updatedResources = await systemService.updateMining({
      telegram_id:
        process.env.NEXT_PUBLIC_API_ID_TELEGRAM || user?.id.toString(),
      mining_values: {
        Steel: resources["Steel"],
        Aluminum: resources["Aluminum"],
        Copper: resources["Copper"],
        Fiber: resources["Fiber"],
        Titanium: resources["Titanium"],
      },
    });

    onClose();
    resetBitcoinValue();
    resetResources();
    setIsLoading(false);
    queryClient.refetchQueries({
      queryKey: ["infoUser"],
    });
  }, [
    bitcoinValue,
    offlineEarnings,
    resetBitcoinValue,
    resetResources,
    queryClient,
  ]);

  return (
    <Box>
      <Modal
        isOpen={isOpen}
        closeOnOverlayClick={false}
        isCentered
        onClose={onClose}
      >
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
                <Text fontSize={"lg"} textColor={"#D5FE4B"} fontWeight={800}>
                  Hooray!
                </Text>
                <Text fontSize={"xs"} fontWeight={400} textColor={"#DADFF4"}>
                  Your resources earned during offline time
                </Text>
              </Stack>
              <SimpleGrid w={"full"} columns={3} spacing={4}>
                {Object.entries(imageResources)
                  .slice(1)
                  .map(([key, value]) => (
                    <VStack
                      key={key}
                      bg={"#13161F"}
                      py={2}
                      rounded={"xl"}
                      borderColor={"#3F435A"}
                      borderWidth={1}
                      borderBottomWidth={3}
                    >
                      <Image src={value as any} w={"44px"} h={"44px"} />
                      <Text fontSize={"sm"} fontWeight={600}>
                        {key}
                      </Text>
                      <HStack spacing={1}>
                        <Text fontSize={"sm"} fontWeight={"800"}>
                          {resources[key]
                            ? numeralFormat(resources[key])
                            : numeralFormat(Number(bitcoinValue.toFixed(5)))}
                        </Text>
                      </HStack>
                    </VStack>
                  ))}
              </SimpleGrid>

              <Image
                src="/assets/botGirl.png"
                position={"absolute"}
                top={-120}
                zIndex={-1}
              />
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
              onClick={handleClaim}
            >
              {isLoading ? <Spinner size={"sm"} /> : "Claim Rewards"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
