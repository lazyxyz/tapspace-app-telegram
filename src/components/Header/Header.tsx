"use client";

import useResourceCapacity from "@/hooks/useResourceCapacity";
import { useTelegram } from "@/lib/TelegramProvider";
import { Box, Button, HStack, Image, Stack, Text } from "@chakra-ui/react";
import { useBitcoin } from "../Wrapper/BitcoinProvider";
import { useQuery } from "@tanstack/react-query";
import systemService from "@/services/system.service";

export default function Header() {
  const bitcoinValue = useBitcoin();

  const { user } = useTelegram();
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["infoUser"],
    queryFn: async () => {
      const rs = await systemService.getUserInfo({
        telegram_id: user?.id,
        planets: "Earth",
      });
      return rs.data[0];
    },
    staleTime: Infinity,
    enabled: true,
  });

  return (
    <HStack
      w={"full"}
      py={2}
      bgGradient="linear(to-b, #333649 0%, #1F212E 100%)"
      position={"sticky"}
      top={0}
      justifyContent={"space-between"}
      zIndex={"100"}
      borderBottomWidth={1}
      borderColor={"#34384B"}
      roundedBottom={"lg"}
      px={2}
    >
      <HStack>
        <Button
          bgGradient="linear(to-b, #0DD63E 0%, #00A65B 100%)"
          p={3}
          rounded={"lg"}
        >
          <BarMenu />
        </Button>
        <HStack>
          <Box
            bg={"white"}
            opacity={"10%"}
            w={"36px"}
            h={"36px"}
            rounded={"full"}
          />
          <Stack spacing={0}>
            <Text fontSize={"sm"} textColor={"white"} fontWeight={"800"}>
              {user?.username || "Unnamed"}
            </Text>
            <Text fontSize={"10px"} fontWeight={800} textColor={"white"}>
              ID:{user?.id}
            </Text>
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
        <Text fontWeight={900} textColor={"white"}>
          {data?.btc_value || 0}
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

const BarMenu = () => {
  return (
    <svg
      width="22"
      height="16"
      viewBox="0 0 22 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.8731 2.82088H6.20452C5.90526 2.82088 5.61826 2.702 5.40666 2.49039C5.19505 2.27878 5.07617 1.99178 5.07617 1.69253C5.07617 1.39327 5.19505 1.10627 5.40666 0.894665C5.61826 0.683058 5.90526 0.564178 6.20452 0.564178H20.8731C21.1723 0.564178 21.4593 0.683058 21.6709 0.894665C21.8825 1.10627 22.0014 1.39327 22.0014 1.69253C22.0014 1.99178 21.8825 2.27878 21.6709 2.49039C21.4593 2.702 21.1723 2.82088 20.8731 2.82088Z"
        fill="white"
      />
      <path
        d="M1.69112 3.38505C2.62587 3.38505 3.38364 2.62728 3.38364 1.69252C3.38364 0.757769 2.62587 0 1.69112 0C0.756365 0 -0.00140381 0.757769 -0.00140381 1.69252C-0.00140381 2.62728 0.756365 3.38505 1.69112 3.38505Z"
        fill="white"
      />
      <path
        d="M20.8731 9.12834H6.20452C5.90526 9.12834 5.61826 9.00946 5.40666 8.79786C5.19505 8.58625 5.07617 8.29925 5.07617 7.99999C5.07617 7.70074 5.19505 7.41374 5.40666 7.20213C5.61826 6.99052 5.90526 6.87164 6.20452 6.87164H20.8731C21.1723 6.87164 21.4593 6.99052 21.6709 7.20213C21.8825 7.41374 22.0014 7.70074 22.0014 7.99999C22.0014 8.29925 21.8825 8.58625 21.6709 8.79786C21.4593 9.00946 21.1723 9.12834 20.8731 9.12834Z"
        fill="white"
      />
      <path
        d="M1.69112 9.69254C2.62587 9.69254 3.38364 8.93477 3.38364 8.00002C3.38364 7.06526 2.62587 6.3075 1.69112 6.3075C0.756365 6.3075 -0.00140381 7.06526 -0.00140381 8.00002C-0.00140381 8.93477 0.756365 9.69254 1.69112 9.69254Z"
        fill="white"
      />
      <path
        d="M20.8731 15.4358H6.20452C5.90526 15.4358 5.61826 15.317 5.40666 15.1054C5.19505 14.8937 5.07617 14.6067 5.07617 14.3075C5.07617 14.0082 5.19505 13.7212 5.40666 13.5096C5.61826 13.298 5.90526 13.1791 6.20452 13.1791H20.8731C21.1723 13.1791 21.4593 13.298 21.6709 13.5096C21.8825 13.7212 22.0014 14.0082 22.0014 14.3075C22.0014 14.6067 21.8825 14.8937 21.6709 15.1054C21.4593 15.317 21.1723 15.4358 20.8731 15.4358Z"
        fill="white"
      />
      <path
        d="M1.69112 16C2.62587 16 3.38364 15.2422 3.38364 14.3075C3.38364 13.3727 2.62587 12.6149 1.69112 12.6149C0.756365 12.6149 -0.00140381 13.3727 -0.00140381 14.3075C-0.00140381 15.2422 0.756365 16 1.69112 16Z"
        fill="white"
      />
    </svg>
  );
};
