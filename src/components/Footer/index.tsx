"use client";

import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Image,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { FaChevronLeft } from "react-icons/fa";
import ResourcesDrawer from "./Menu/Resource";
import Swap from "./Menu/Resource/Swap";
import ReferralDrawer from "./Menu/Referral";
import ComingSoon from "./Menu/ComingSoon";

const listMenu = [
  {
    label: "Resources",
    image: "Resources.png",
    drawerContent: (isOpen: boolean, onClose: () => void) => (
      <ResourcesDrawer isOpen={isOpen} onClose={onClose} />
    ),
    status: true,
  },
  {
    label: "Spaceship",
    image: "Spaceship.png",
    drawerContent: (isOpen: boolean, onClose: () => void) => (
      <ComingSoon tab={"Spaceship"} />
    ),
    bgIncoming: "/assets/menu/bgSpaceship.png",
    status: false,
  },
  {
    label: "Universe",
    image: "universe.png",
    status: false,
    drawerContent: (isOpen: boolean, onClose: () => void) => (
      <ComingSoon tab={"Universe"} />
    ),
    bgIncoming: "/assets/menu/bgUniverse.png",
  },
  {
    label: "Battles",
    image: "Battles.png",
    status: false,
    drawerContent: (isOpen: boolean, onClose: () => void) => (
      <ComingSoon tab={"Battles"} />
    ),
    bgIncoming: "/assets/menu/bgBattles.png",
  },
  {
    label: "Referral",
    image: "Referral.png",
    drawerContent: (isOpen: boolean, onClose: () => void) => <ReferralDrawer />,
    status: true,
  },
];

export default function Footer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMenuItem, setSelectedMenuItem] = useState<number>(0);
  const [tab, setTab] = useState(false);

  const handleMenuClick = (index: number) => {
    setSelectedMenuItem(index);
    onOpen();
  };

  const RenderMenuItems = ({ checkActive }: { checkActive?: boolean }) => {
    return (
      <HStack w={"full"} spacing={0}>
        {listMenu.map((item, idx) => (
          <VStack
            key={idx}
            w={"full"}
            borderWidth={1}
            borderTopWidth={"3px"}
            bgGradient={
              checkActive && idx === selectedMenuItem
                ? "linear(to-b, #0DD63E 0%, #00A65B 100%)"
                : "linear(to-b, #333649 0%, #1F212E 100%)"
            }
            borderColor={
              checkActive && idx === selectedMenuItem ? "#7CEE22" : "#545978"
            }
            roundedTop={"2xl"}
            position={"relative"}
            minH={"72px"}
            justifyContent={"center"}
            onClick={() => handleMenuClick(idx)}
            cursor="pointer"
          >
            <Image
              src={`/assets/menu/${item.image}`}
              position={"absolute"}
              top={-5}
              w={"56px"}
              h={"56px"}
              objectFit="contain"
            />
            <Text
              textColor={"white"}
              mt={7}
              fontSize={"11px"}
              fontWeight={"900"}
            >
              {item.label}
            </Text>
          </VStack>
        ))}
      </HStack>
    );
  };

  const HeaderResource = () => {
    return (
      <HStack w={"full"} justifyContent={"space-between"}>
        {!tab && <Text>{listMenu[selectedMenuItem]?.label}</Text>}
        <Button
          fontSize={"xl"}
          variant={"unstyled"}
          textColor={"#D5FE4B"}
          onClick={() => setTab(!tab)}
        >
          <HStack>
            {tab && <FaChevronLeft />}
            <Text>Swap</Text>
          </HStack>
        </Button>
      </HStack>
    );
  };

  const HeaderReferral = () => {
    return (
      <Stack
        pt={1}
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
    );
  };

  const checkCommingSoon = !listMenu[selectedMenuItem]?.status;

  return (
    <HStack
      position={"fixed"}
      bottom={0}
      w={"full"}
      justifyContent={"space-between"}
      zIndex={1000}
      spacing={0}
    >
      <RenderMenuItems />

      <Drawer placement={"bottom"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent
          h={checkCommingSoon ? "100vh" : "82vh"}
          px={"0 !"}
          mx={"0 !"}
          bgGradient={"linear(to-b, #333649 0%, #1F212E 100%)"}
          bgImage={listMenu[selectedMenuItem].bgIncoming}
          bgSize={"cover"}
          borderTopWidth={3}
          borderColor={"#545978"}
          roundedTop={"xl"}
        >
          <DrawerHeader borderBottomWidth="1px" border={0} pt={2} pb={1}>
            {listMenu[selectedMenuItem]?.label === "Resources" && (
              <HeaderResource />
            )}

            {listMenu[selectedMenuItem]?.label === "Referral" && (
              <HeaderReferral />
            )}
          </DrawerHeader>
          <DrawerBody px={0} py={0}>
            {tab ? (
              <Swap />
            ) : (
              listMenu[selectedMenuItem]?.drawerContent?.(isOpen, onClose)
            )}
          </DrawerBody>
          <DrawerFooter
            p={0}
            position={"fixed"}
            bgGradient={"linear(to-b, #333649 0%, #1F212E 100%)"}
            w={"full"}
            rounded={"xl"}
            bottom={0}
          >
            <RenderMenuItems checkActive={true} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </HStack>
  );
}
