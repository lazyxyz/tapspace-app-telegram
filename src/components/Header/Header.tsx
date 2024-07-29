"use client";

import { useTelegram } from "@/lib/TelegramProvider";
import systemService from "@/services/system.service";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Icon,
  Image,
  Stack,
  Switch,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { BarMenu, IconBitcoin, IconClose } from "../Icons";
import GenerateAvatar from "@/lib/GenerateAvatar";
import { numeralFormat } from "@/utils/utils";
import Leaderboard from "../Leaderboard";
import { FaVolumeOff } from "react-icons/fa";
import { PiMusicNotesFill } from "react-icons/pi";
import { IoReload } from "react-icons/io5";

export default function Header() {
  const { user } = useTelegram();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenNavbar,
    onOpen: onOpenNavbar,
    onClose: onCloseNavbar,
  } = useDisclosure();

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
    <>
      <HStack
        w={"full"}
        py={2}
        bgGradient="linear(to-b, #333649 0%, #1F212E 100%)"
        position={isOpenNavbar ? "static" : "sticky"}
        top={0}
        justifyContent={"space-between"}
        zIndex={1999}
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
            onClick={onOpenNavbar}
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
                seed: String(user?.username),
              }}
            />
            <Stack spacing={0}>
              <Text fontSize={"sm"} textColor={"white"} fontWeight={"800"}>
                {user?.username || "Unnamed"}
              </Text>
              <HStack
                spacing={0}
                onClick={() => {
                  onOpen();
                }}
              >
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
          <Box position={"absolute"} left={-4} bottom={1}>
            <IconBitcoin w={"32px"} h={"32px"} />
          </Box>
        </Stack>
      </HStack>

      <Leaderboard isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

      <Navbar isOpen={isOpenNavbar} onClose={onCloseNavbar} />
    </>
  );
}

const Navbar = ({ isOpen, onClose }: any) => {
  return (
    <Drawer isOpen={isOpen} placement="left" size={"full"} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent
        py={4}
        bgGradient="linear(to-b, #333649 0%, #1F212E 100%)"
        position={"relative"}
      >
        <Box position={"absolute"} right={6} top={10} onClick={onClose}>
          <Icon as={IconClose} right={0} position={"absolute"} w={"full"} />
        </Box>
        <DrawerHeader fontSize={"24px"} textColor={"white"} fontWeight={800}>
          Setting
        </DrawerHeader>

        <DrawerBody>
          <VStack align={"start"} justifyContent={"space-between"} spacing={4}>
            <Stack w={"full"}>
              <HStack
                fontSize={"xl"}
                fontWeight={800}
                w={"full"}
                justifyContent={"space-between"}
              >
                <HStack>
                  <Icon as={FaVolumeOff} fontSize={"3xl"} />
                  <Text>Sound FX</Text>
                </HStack>

                <Switch size="md" />
              </HStack>

              <HStack
                fontSize={"xl"}
                fontWeight={800}
                w={"full"}
                justifyContent={"space-between"}
              >
                <HStack fontSize={"xl"} fontWeight={800}>
                  <Icon as={PiMusicNotesFill} fontSize={"3xl"} />
                  <Text>Music</Text>
                </HStack>

                <Switch size="md" />
              </HStack>
            </Stack>

            <Button
              rounded={"xl"}
              ml={"auto"}
              borderBottomWidth={3}
              py={5}
              gap={2}
              variant={"hover"}
              fontWeight={800}
              borderColor={"#0DD63E"}
              bgGradient={"linear(to-b, #0DD63E 0%, #00A65B 100%)"}
            >
              <Icon as={IoReload} w={4} h={4}></Icon>

              <Text
                fontSize={"sm"}
                onClick={async () => {
                  localStorage.clear();
                  window.location.reload();
                }}
              >
                Refresh
              </Text>
            </Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
