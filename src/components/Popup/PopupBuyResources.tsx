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
} from "@chakra-ui/react";
import { IconBitcoin, IconClose } from "../Icons";
import { useState } from "react";
import systemService from "@/services/system.service";
import { useTelegram } from "@/lib/TelegramProvider";
import { queryClient } from "../Wrapper/QueryClientProvider";

interface PopupUpgradeBotProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  item: any;
}

export default function PopupBuyResources({
  isOpen,
  onOpen,
  onClose,
  item,
}: PopupUpgradeBotProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useTelegram();
  const toast = useToast();

  const handleBuyResources = async () => {
    setIsLoading(true);
    try {
      const updateBot = await systemService.buyResources({
        telegram_id:
          user?.id || Number(process.env.NEXT_PUBLIC_API_ID_TELEGRAM),
        resource_name: item.label,
        value_btc: 0.1,
        value_resource: item.value,
      });

      setIsLoading(false);
      toast({
        status: "success",
        title: "Success",
        description: String(`Buy ${item.value} ${item.label} compelete`),
        position: "top-right",
        isClosable: true,
        duration: 3000,
      });
      onClose();
      queryClient.refetchQueries({
        queryKey: ["infoUser"],
      });
    } catch (error) {
      setIsLoading(false);
      toast({
        status: "error",
        title: "Failed",
        description: String(error),
        position: "top-right",
        isClosable: true,
        duration: 3000,
      });
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
                {item?.value} {item?.label}
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
              isDisabled={isLoading}
              borderBottomWidth={3}
              py={5}
              variant={"hover"}
              fontWeight={800}
              borderColor={"#0DD63E"}
              bgGradient={"linear(to-b, #0DD63E 0%, #00A65B 100%)"}
              onClick={handleBuyResources}
            >
              {isLoading ? <Spinner size={"sm"} /> : "Purchase"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
