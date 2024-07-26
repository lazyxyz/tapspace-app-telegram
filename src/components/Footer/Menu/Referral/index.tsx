import { IconCoppyLink } from "@/components/Icons";
import { useTelegram } from "@/lib/TelegramProvider";
import systemService from "@/services/system.service";
import {
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Link,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import NextLink from "next/link";
import React, { useState } from "react";
import { BiCheck } from "react-icons/bi";

const MotionButton = motion(Button);
const MotionBox = motion(Box);
export default function ReferralDrawer() {
  const { user } = useTelegram();
  const { data } = useQuery({
    queryKey: ["referral"],
    queryFn: () => {
      const rs = systemService.sendInviteLink({
        telegram_id:
          Number(process.env.NEXT_PUBLIC_API_ID_TELEGRAM) || Number(user?.id),
      });
      return rs;
    },
  });

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    window.navigator.clipboard.writeText(String(data?.data.invite_link));
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <VStack justifyContent={"space-between"} h={"full"} pb={4}>
      <Stack>
        <HStack bg={"#1F212E"} p={3} rounded={"xl"} my={2}>
          <Image src="/assets/menu/Referral.png" w={"24px"} h={"24px"} />
          <Text fontSize={"xs"} textColor={"#ECEFF9"} fontWeight={800}>
            Each referral will grant you more
            <Box color={"#0FE0FD"} as="span">
              2%
            </Box>{" "}
            TS-BTC/sec minted and all resources/tap.
          </Text>
        </HStack>

        <HStack bg={"rgba(253, 191, 37, 0.2)"} p={3} w={"full"} rounded={"xl"}>
          <Image src="/assets/rewards/Fill/Gold.svg" />
          <Stack spacing={0}>
            <Text textColor={"#FFE42C"} fontSize={"lg"} fontWeight={800}>
              +2%
            </Text>
            <Text fontSize={"xs"} textColor={"#ECEFF9"} fontWeight={800}>
              All resources/tap
            </Text>
          </Stack>
        </HStack>

        <HStack
          bg={"rgba(124, 238, 34, 0.2)"}
          px={3}
          py={2}
          w={"full"}
          rounded={"xl"}
        >
          <Image src="/assets/rewards/Fill/Energyy.svg" />
          <Stack spacing={0}>
            <Text textColor={"#7CEE22"} fontSize={"lg"} fontWeight={800}>
              +10%
            </Text>
            <Text fontSize={"xs"} textColor={"#ECEFF9"} fontWeight={800}>
              All resources/tap
            </Text>
          </Stack>
        </HStack>

        <Text fontSize={"sm"} fontWeight={600} textColor={"#BBC1DE"}>
          List of friends
        </Text>
      </Stack>

      <HStack w={"full"}>
        <Link
          as={NextLink}
          href={data?.data.invite_link || ""}
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
        </Link>

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
    </VStack>
  );
}
