import GenerateAvatar from "@/lib/GenerateAvatar";
import { useTelegram } from "@/lib/TelegramProvider";
import systemService from "@/services/system.service";
import { numeralFormat, useShortenedName } from "@/utils/utils";
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
import { IconBitcoin } from "../Icons";

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
    queryKey: ["leaderboard"],
    queryFn: async () => {
      return (await systemService.getLeaderboard()).data;
    },
  });

  console.log(data);

  const bgTop = [
    "linear-gradient(90deg, rgba(253, 191, 37, 0.25) 0%, rgba(253, 191, 37, 0.03) 100%)",
    "linear-gradient(90deg, rgba(30, 162, 237, 0.25) 0%, rgba(30, 162, 237, 0.03) 100%)",
    "linear-gradient(90deg, rgba(1, 130, 65, 0.25) 0%, rgba(1, 130, 65, 0.03) 100%)",
    "#333649",
  ];

  const colorTop = ["#FDBF25", "#1EA2ED", "#0DD63E"];
  const imageTop = [
    "/assets/rewards/top1.svg",
    "/assets/rewards/top2.svg",
    "/assets/rewards/top3.svg",
  ];

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
          <ModalBody pt={0} pb={2} px={2}>
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

              <Stack w={"full"} spacing={1}>
                {data?.map((item: any, idx: number) => (
                  <HStack
                    key={idx}
                    justifyContent={"space-between"}
                    p={3}
                    rounded={"xl"}
                    w={"full"}
                    bgGradient={bgTop[idx]}
                    bg={idx >= 3 ? "#333649" : ""}
                  >
                    <HStack spacing={4}>
                      <Box>
                        {idx < 3 ? (
                          <Image
                            px={1}
                            src={imageTop[idx]}
                            whiteSpace={"pre"}
                          />
                        ) : (
                          <Stack
                            rounded={"full"}
                            bg={"#6C7293"}
                            w={"24px"}
                            h={"24px"}
                            justifyContent={"center"}
                            align={"center"}
                          >
                            <Text fontSize={"xs"} fontWeight={800}>
                              {idx + 1}
                            </Text>
                          </Stack>
                        )}
                      </Box>
                      <HStack>
                        <GenerateAvatar
                          borderRadius={"full"}
                          overflow={"hidden"}
                          w={"36px"}
                          h={"36px"}
                          jazzicon={{
                            diameter: 31,
                            seed: item.name,
                          }}
                        />

                        <Stack spacing={0}>
                          <Text
                            fontSize={"14px"}
                            fontWeight={800}
                            noOfLines={1}
                          >
                            {item.name}
                          </Text>
                          <Text
                            color={colorTop[idx]}
                            fontSize={"10px"}
                            fontWeight={800}
                          >
                            Level #
                          </Text>
                        </Stack>
                      </HStack>
                    </HStack>

                    <HStack spacing={1}>
                      <IconBitcoin w={"16px"} h={"16px"} />
                      <Text fontWeight={800}>{numeralFormat(item.value)}</Text>
                    </HStack>
                  </HStack>
                ))}
              </Stack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
