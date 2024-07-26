"use client";

import { useTelegram } from "@/lib/TelegramProvider";
import systemService from "@/services/system.service";
import { Box, Button, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { BarMenu } from "../Icons";
import GenerateAvatar from "@/lib/GenerateAvatar";
import { numeralFormat } from "@/utils/utils";

export default function Header() {
  const { user } = useTelegram();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["infoUser"],
    queryFn: async () => {
      const rs = await systemService.getUserInfo({
        telegram_id:
          process.env.NEXT_PUBLIC_API_ID_TELEGRAM || user?.id.toString(),
        planets: "Earth",
      });
      return rs.data;
    },
    staleTime: Infinity,
  });

  return (
    <HStack
      w={"full"}
      py={2}
      bgGradient="linear(to-b, #333649 0%, #1F212E 100%)"
      position={"sticky"}
      top={0}
      justifyContent={"space-between"}
      zIndex={9999}
      borderBottomWidth={1}
      borderColor={"#34384B"}
      roundedBottom={"lg"}
      px={2}
    >
      <HStack>
        <Button
          borderWidth={1}
          borderBottomWidth={3}
          borderColor={"#018241"}
          bgGradient="linear(to-b, #0DD63E 0%, #00A65B 100%)"
          px={"8px"}
          py={"11px"}
          variant={"padding"}
          rounded={"lg"}
        >
          <BarMenu />
        </Button>
        <HStack>
          <GenerateAvatar
            borderRadius={"full"}
            overflow={"hidden"}
            w={"36px"}
            h={"36px"}
            jazzicon={{
              diameter: 31,
              seed: String(user?.id),
            }}
          />
          <Stack spacing={0}>
            <Text fontSize={"sm"} textColor={"white"} fontWeight={"800"}>
              {user?.username || "Unnamed"}
            </Text>
            <HStack spacing={0}>
              <Image src="/assets/cup.svg" />
              <Text fontSize={"10px"} textColor={"#DADFF4"} fontWeight={600}>
                #{data?.rank || "-"}
              </Text>
            </HStack>
          </Stack>
        </HStack>
      </HStack>

      <Stack
        px={"20px"}
        position={"relative"}
        borderBottomWidth={3}
        py={"9px"}
        rounded={"lg"}
        bg={"#13161F"}
      >
        <Text fontWeight={900} pl={3} pr={1} textColor={"white"}>
          {numeralFormat(data?.btc_value) || 0}
        </Text>
        <Image
          src="/bitcoin.svg"
          w={"32px"}
          h={"32px"}
          position={"absolute"}
          left={-3}
          bottom={1}
        />
      </Stack>
    </HStack>
  );
}
