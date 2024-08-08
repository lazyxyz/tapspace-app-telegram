import {
  Box,
  Button,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Image,
  VStack,
  HStack,
  useToast,
  Spinner,
  CheckboxIcon,
} from "@chakra-ui/react";
import { IconBitcoin, IconClose } from "../Icons";
import { useState } from "react";
import systemService from "@/services/system.service";
import { useTelegram } from "@/lib/TelegramProvider";
import { queryClient } from "../Wrapper/QueryClientProvider";
import useCustomToast from "@/hooks/useCustomToast";
import { Toaster, toast } from "sonner";
import { imageResources } from "@/utils/utils";
import { useBitcoin } from "../Wrapper/BitcoinProvider";

interface PopupUpgradeBotProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  item: any;
  total: number;
}

export default function PopupBuyResources({
  isOpen,
  onOpen,
  onClose,
  item,
  total,
}: PopupUpgradeBotProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useTelegram();
  const { bitcoinValue } = useBitcoin();

  const handleBuyResources = async () => {
    setIsLoading(true);
    try {
      const updateBot = await systemService.buyResources({
        telegram_id:
          user?.id || Number(process.env.NEXT_PUBLIC_API_ID_TELEGRAM),
        resource_name: item.label,
        value_btc: 0.1,
        value_resource: total,
      });

      setIsLoading(false);
      toast.custom((t) => (
        <HStack
          color="#FFFFFF"
          borderColor="transparent"
          padding="12px"
          borderRadius="12px"
          rounded={"xl"}
          spacing={1}
          align={"center"}
          overflow={"hidden"}
          backdropFilter="blur(25px)"
        >
          <Image
            src={imageResources[item.label]}
            alt="Success"
            boxSize="20px"
            objectFit="cover"
            mr={1}
          />
          <Text
            fontWeight={800}
            fontSize={"sm"}
          >{`Buy ${total} ${item.label} complete`}</Text>
        </HStack>
      ));
      queryClient.refetchQueries({
        queryKey: ["infoUser"],
      });
    } catch (error) {
      setIsLoading(false);
    }
  };

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
          p={0}
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
          <ModalBody p={2}>
            <VStack py={0}>
              <Image src={item?.image} alt="" />
              <Text fontSize={"20px"} fontWeight={800} textColor={"white"}>
                {total} {item?.label}
              </Text>

              <HStack spacing={1}>
                <IconBitcoin w={"16px"} h={"16px"} />
                <Text fontWeight={800} textColor={"white"}>
                  0.1
                </Text>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter px={4}>
            <Button
              w={"full"}
              rounded={"xl"}
              borderBottomWidth={3}
              py={5}
              variant={"hover"}
              isDisabled={isLoading}
              fontWeight={800}
              borderColor={"#0DD63E"}
              bgGradient={"linear(to-b, #0DD63E 0%, #00A65B 100%)"}
              onClick={handleBuyResources}
            >
              {isLoading ? (
                <Spinner size={"sm"} />
              ) : bitcoinValue < 0.1 ? (
                "Insuffician BTC"
              ) : (
                "Purchase"
              )}
            </Button>
          </ModalFooter>

          <Toaster
            position="bottom-left"
            dir="ltr"
            icons={{
              success: <CheckboxIcon />,
            }}
            toastOptions={{
              style: {
                background: "rgba(13, 214, 62, 0.2)",
                backdropFilter: "blur(25px)",
                borderRadius: "12px",
              },
            }}
          />
        </ModalContent>
      </Modal>
    </Box>
  );
}
