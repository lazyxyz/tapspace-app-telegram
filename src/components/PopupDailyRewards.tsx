import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  Image,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
export default function PopupDailyRewards() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [totalClaim, setTotalClaim] = useState();

  return (
    <Modal isOpen={isOpen} isCentered onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        bgGradient="linear(to-b, #333649 0%, #1F212E 100%)"
        rounded={"xl"}
      >
        <ModalHeader>
          <VStack spacing={0}>
            <Image src="/assets/dailyReward.svg" />
            <Text fontSize={"lg"} fontWeight={800}>
              Daily Rewards
            </Text>
            <Text fontSize={"xs"} fontWeight={400} textColor={"#DADFF4"}>
              Daily rewards accumulate according to your streak.
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <SimpleGrid columns={3} spacing={4}>
            {Array.from(Array(9)).map((item, idx) => (
              <VStack
                key={idx}
                bg={"#13161F"}
                py={2}
                rounded={"xl"}
                boxShadow={"0px 4px 15px 0px rgba(124, 238, 34, 0.25);"}
                borderColor={"#7CEE22"}
                borderWidth={1}
                borderBottomWidth={3}
              >
                <Image src="/assets/rewards/Gold.png" />
                <Text>Day 2</Text>
                <Text>500</Text>
              </VStack>
            ))}
          </SimpleGrid>
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
            onClick={() => onClose}
          >
            Claim Rewards
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
