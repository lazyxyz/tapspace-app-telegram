import GenerateAvatar from "@/lib/GenerateAvatar";
import { useTelegram } from "@/lib/TelegramProvider";
import {
  Box,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

interface PopupUpgradeBotProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function Leaderboard({
  isOpen,
  onOpen,
  onClose,
}: PopupUpgradeBotProps) {
  const { data } = useQuery<any>({
    queryKey: ["infoUser"],
  });

  const bgTop = [
    "linear-gradient(90deg, rgba(253, 191, 37, 0.25) 0%, rgba(253, 191, 37, 0.03) 100%)",
    "linear-gradient(90deg, rgba(30, 162, 237, 0.25) 0%, rgba(30, 162, 237, 0.03) 100%)",
    "linear-gradient(90deg, rgba(1, 130, 65, 0.25) 0%, rgba(1, 130, 65, 0.03) 100%)",
    "#333649",
  ];

  const iconTop = [""];
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
          <ModalBody pt={0}>
            <Stack align={"center"}>
              <Image
                src="/assets/leaderboard.svg"
                position={"absolute"}
                top={-16}
                zIndex={1000}
              />

              <Stack align={"center"} position={"relative"}>
                <Image src="/assets/bgLeaderboard.png" />
                <Text
                  fontSize={"24px"}
                  fontWeight={900}
                  position={"absolute"}
                  bottom={4}
                >
                  Leaderboard
                </Text>
              </Stack>

              <HStack
                justifyContent={"space-between"}
                p={3}
                rounded={"xl"}
                w={"full"}
                bgGradient={
                  "linear-gradient(90deg, rgba(253, 191, 37, 0.25) 0%, rgba(253, 191, 37, 0.03) 100%)"
                }
              >
                <HStack spacing={4}>
                  <Box>
                    <Image src="/assets/rewards/top1.svg" />
                  </Box>
                  <HStack>
                    <GenerateAvatar
                      borderRadius={"full"}
                      overflow={"hidden"}
                      w={"36px"}
                      h={"36px"}
                      jazzicon={{
                        diameter: 31,
                        seed: "",
                      }}
                    />

                    <Stack spacing={0}>
                      <Text fontSize={"14px"} fontWeight={800}>
                        Swedien
                      </Text>
                      <Text fontSize={"10px"} fontWeight={800}>
                        Swedien
                      </Text>
                    </Stack>
                  </HStack>
                </HStack>

                <Text>123</Text>
              </HStack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
