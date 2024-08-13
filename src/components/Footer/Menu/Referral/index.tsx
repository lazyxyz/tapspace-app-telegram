"use client";
import { IconCoppyLink } from "@/components/Icons";
import GenerateAvatar from "@/lib/GenerateAvatar";
import { useTelegram } from "@/lib/TelegramProvider";
import systemService from "@/services/system.service";
import {
  Alert,
  Box,
  Button,
  CloseButton,
  HStack,
  Image,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";

const MotionButton = motion(Button);
const MotionBox = motion(Box);
export default function ReferralDrawer() {
  const { user } = useTelegram();
  const { data } = useQuery({
    queryKey: ["referral"],
    queryFn: () => {
      const rs = systemService.sendInviteLink({
        telegram_id:
          Number(user?.id) || Number(process.env.NEXT_PUBLIC_API_ID_TELEGRAM),
      });
      return rs;
    },
  });

  const { data: dataUser } = useQuery<any>({
    queryKey: ["infoUser"],
  });

  console.log(data);

  const { webApp } = useTelegram();
  const toast = useToast();

  const handleLinkClick = () => {
    if (webApp && data?.data.invite_link) {
      try {
        //@ts-ignore
        webApp.openTelegramLink(
          "https://t.me/share/url?url=https://t.me/catizenbot/gameapp?startapp=rp_1365932&text=%F0%9F%92%B0Catizen%3A%20Unleash%2C%20Play%2C%20Earn%20-%20Where%20Every%20Game%20Leads%20to%20an%20Airdrop%20Adventure!%0A%F0%9F%8E%81Let%27s%20play-to-earn%20airdrop%20right%20now!"
        );
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
    } else {
      console.error("Telegram Web App not initialized or invite link missing");
    }
  };

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    window.navigator.clipboard.writeText(
      String(data?.data.invite_link + `&text=${data?.data.message_content}`)
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const countRef = dataUser?.referred_users.length;

  return (
    <VStack
      justifyContent={"space-between"}
      h={"full"}
      pt={16}
      pb={6}
      px={3}
      bgGradient={"linear(to-b, #333649 0%, #1F212E 100%)"}
    >
      <Stack>
        <Stack
          pt={4}
          w={"full"}
          align={"center"}
          spacing={0}
          justifyContent={"space-between"}
        >
          <Text fontSize={"lg"} fontWeight={800} textColor={"white"}>
            Invite Friends
          </Text>

          <Text fontWeight={800} fontSize={"md"} textColor={"#BBC1DE"}>
            Invite friends and get more rewards
          </Text>
        </Stack>

        <HStack bg={"#1F212E"} p={3} rounded={"xl"} my={2}>
          <Image src="/assets/menu/Referral.png" w={"24px"} h={"24px"} />
          <Text fontSize={"xs"} textColor={"#ECEFF9"} fontWeight={800}>
            Each referral will grant you more{" "}
            <Box color={"#0FE0FD"} as="span">
              2%
            </Box>{" "}
            TS-BTC/sec minted and{" "}
            <Box color={"#0FE0FD"} as="span">
              10%
            </Box>{" "}
            all resources/tap.
          </Text>
        </HStack>

        <HStack bg={"rgba(253, 191, 37, 0.2)"} p={3} w={"full"} rounded={"xl"}>
          <Image src="/assets/rewards/Fill/Gold.png" w={"48px"} h={"48px"} />
          <Stack spacing={0}>
            <Text textColor={"#FFE42C"} fontSize={"lg"} fontWeight={800}>
              {countRef * 2}%
            </Text>
            <Text fontSize={"xs"} textColor={"#ECEFF9"} fontWeight={800}>
              TS-BTC minted/sec
            </Text>
          </Stack>
        </HStack>

        <HStack
          bg={"rgba(124, 238, 34, 0.2)"}
          px={3}
          py={3}
          w={"full"}
          rounded={"xl"}
        >
          <Image src="/assets/rewards/Fill/Energy.png" w={"48px"} h={"48px"} />
          <Stack spacing={0}>
            <Text textColor={"#7CEE22"} fontSize={"lg"} fontWeight={800}>
              {countRef * 10}%
            </Text>
            <Text fontSize={"xs"} textColor={"#ECEFF9"} fontWeight={800}>
              All resources/tap
            </Text>
          </Stack>
        </HStack>

        <Text fontSize={"sm"} py={2} fontWeight={600} textColor={"#BBC1DE"}>
          List of friends{" "}
          <Box as="span" textColor={"white"}>
            {countRef}
          </Box>
        </Text>

        <Stack overflow={"auto"} maxH={"200px"}>
          {dataUser?.referred_users?.map((item: string, idx: number) => (
            <HStack spacing={3} key={idx}>
              <GenerateAvatar
                borderRadius={"full"}
                overflow={"hidden"}
                w={"36px"}
                h={"36px"}
                jazzicon={{
                  diameter: 31,
                  seed: String(item),
                }}
              />
              <Text fontWeight={700}>{item}</Text>
            </HStack>
          ))}
        </Stack>
      </Stack>

      <Stack w={"full"} spacing={4}>
        {copied && (
          <Alert status="success" rounded={"xl"} bg={"rgba(13, 214, 62, 0.1)"}>
            <HStack w={"full"} justifyContent={"space-between"}>
              <HStack>
                <MotionBox
                  initial={{ height: 0, scale: 1 }}
                  animate={{ height: "100%", scale: copied ? 1.2 : 1 }}
                  transition={{ duration: 0.3 }}
                  overflow="hidden"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  bgGradient={"linear(to-b, #0DD63E 0%, #00A65B 100%)"}
                  rounded={"full"}
                  p={1}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path
                      d="M5 13L9 17L19 7"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </svg>
                </MotionBox>
                <Text textColor={"white"} fontWeight={600}>
                  Copied link!
                </Text>
              </HStack>
              <CloseButton
                fontWeight={600}
                alignSelf="flex-start"
                position="relative"
                onClick={() => {}}
              />
            </HStack>
          </Alert>
        )}

        <HStack w={"full"}>
          <Text
            onClick={handleLinkClick}
            w={"full"}
            rounded={"xl"}
            borderBottomWidth={3}
            py={2}
            textAlign={"center"}
            _hover={{ bgGradient: "linear(to-b, #0DD63E 0%, #00A65B 100%)" }}
            fontWeight={800}
            borderColor={"#0DD63E"}
            bgGradient={"linear(to-b, #0DD63E 0%, #00A65B 100%)"}
          >
            Invite a friend
          </Text>

          <MotionButton
            borderWidth={1}
            w={"52px"}
            h={"44px"}
            rounded={"xl"}
            variant={"unstyled"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            borderBottomWidth={3}
            bgGradient={
              copied
                ? "linear(to-b, #0DD63E 0%, #00A65B 100%)"
                : "linear(to-b, #333649 0%, #1F212E 100%)"
            }
            borderColor={copied ? "#0DD63E" : "#545978"}
            onClick={handleCopy}
            initial={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {copied ? (
              <MotionBox
                initial={{ height: 0, scale: 1 }}
                animate={{ height: "100%", scale: copied ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
                overflow="hidden"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M5 13L9 17L19 7"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
              </MotionBox>
            ) : (
              <IconCoppyLink />
            )}
          </MotionButton>
        </HStack>
      </Stack>
    </VStack>
  );
}
