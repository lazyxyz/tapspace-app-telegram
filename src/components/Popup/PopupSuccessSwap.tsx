import ConfettiComponent from "@/lib/Confetti";
import { imageResources } from "@/utils/utils";
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
  Text,
  VStack,
} from "@chakra-ui/react";
import { BsArrowRight } from "react-icons/bs";
import { FaArrowRight } from "react-icons/fa";

interface PopupUpgradeBotProps {
  isOpen: boolean;
  onClose: () => void;
  from_resource: any;
  to_resource: any;
  result: any;
  value: number;
}

interface ResourceCapacity {
  [key: string]: {
    [resource: string]: number;
  };
}

export default function PopupSuccessSwap({
  isOpen,
  onClose,
  from_resource,
  to_resource,
  result,
  value,
}: PopupUpgradeBotProps) {
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
          <ModalBody p={0}>
            <ConfettiComponent />
            <VStack
              spacing={5}
              py={16}
              w={"full"}
              rounded={"xl"}
              position={"relative"}
            >
              <Image src="/assets/star.png" />
              <Text textColor={"#D5FE4B"} fontSize={"24px"} fontWeight={900}>
                Swap Success!
              </Text>

              <HStack
                borderWidth={1}
                spacing={4}
                px={4}
                py={2}
                rounded={"3xl"}
                bg={"rgba(255, 255, 255, 0.10)"}
              >
                <HStack spacing={1}>
                  <Image src={imageResources[from_resource]} w={"18px"} />
                  <Text fontSize={"sm"} fontWeight={800}>
                    {value}
                  </Text>
                </HStack>
                <FaArrowRight />
                <HStack spacing={1}>
                  <Image src={imageResources[to_resource]} w={"18px"} />
                  <Text fontSize={"sm"} fontWeight={800}>
                    {result}
                  </Text>
                </HStack>
              </HStack>
            </VStack>

            <Box
              position={"absolute"}
              zIndex={-1}
              top={0}
              w={"full"}
              right={0}
              left={0}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="200"
                viewBox="0 0 351 200"
                fill="none"
              >
                <path
                  d="M401 1.74846e-05C401 26.2644 395.18 52.2716 383.873 76.5367C372.566 100.802 355.992 122.85 335.099 141.421C314.206 159.993 289.402 174.725 262.104 184.776C234.806 194.827 205.547 200 176 200C146.453 200 117.194 194.827 89.8962 184.776C62.598 174.725 37.7942 159.993 16.901 141.421C-3.99222 122.85 -20.5656 100.802 -31.8729 76.5367C-43.1802 52.2716 -49 26.2644 -49 0L401 1.74846e-05Z"
                  fill="url(#paint0_radial_51_4141)"
                  fill-opacity="0.2"
                />
                <defs>
                  <radialGradient
                    id="paint0_radial_51_4141"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(176 -3.59463e-06) rotate(89.976) scale(199.97 222.878)"
                  >
                    <stop stop-color="#D5FE4B" />
                    <stop offset="1" stop-color="#0DD63E" stop-opacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
