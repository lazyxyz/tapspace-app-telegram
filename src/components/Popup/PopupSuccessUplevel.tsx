import {
  Box,
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CurrentPassive } from "./PopupUpgradeBot";
import ConfettiComponent from "@/lib/Confetti";

interface PopupUpgradeBotProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  level: number;
  miner: any;
  isBtc?: boolean;
}

interface ResourceCapacity {
  [key: string]: {
    [resource: string]: number;
  };
}

export default function PopupSuccessUplevel({
  isOpen,
  onOpen,
  onClose,
  level,
  miner,
  isBtc,
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
              py={6}
              w={"full"}
              rounded={"xl"}
              position={"relative"}
            >
              <Text fontSize={"lg"} textColor={"white"} fontWeight={800}>
                Congratulation!
              </Text>
              <Text fontSize={"sm"} textColor={"white"} fontWeight={800}>
                {miner.resource_name} Miner
              </Text>
              <Text textColor={"#D5FE4B"} fontSize={"24px"} fontWeight={900}>
                LEVEL {level}
              </Text>
              <CurrentPassive currentLevel={level - 1} item={miner} isBtc />
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

              <Box
                bg={"rgba(255, 255, 255, 0.15)"}
                py={4}
                px={10}
                rounded={"xl"}
                borderWidth={1}
              >
                <Image src="/assets/botGirl.png" />
              </Box>
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
              onClick={onClose}
            >
              Keep Upgrade
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
