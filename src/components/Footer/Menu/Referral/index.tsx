import { IconCoppyLink } from "@/components/Icons";
import {
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";

export default function ReferralDrawer() {
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

        <Text>List of friends</Text>
      </Stack>

      <HStack w={"full"}>
        <Button
          w={"full"}
          rounded={"xl"}
          borderBottomWidth={3}
          py={5}
          isDisabled={false}
          _hover={{ bgGradient: "linear(to-b, #0DD63E 0%, #00A65B 100%)" }}
          fontWeight={800}
          borderColor={"#0DD63E"}
          bgGradient={"linear(to-b, #0DD63E 0%, #00A65B 100%)"}
        >
          Invite a friend
        </Button>

        <Button
          borderWidth={1}
          w={"52px"}
          h={"44px"}
          rounded={"xl"}
          variant={"unstyled"}
          display={"flex"}
          borderBottomWidth={3}
          bgGradient={"linear(to-b, #333649 0%, #1F212E 100%)"}
          borderColor={"#545978"}
        >
          <IconCoppyLink />
        </Button>
      </HStack>
    </VStack>
  );
}
