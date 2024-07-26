"use client";

import {
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
    image: "resources.png",
    drawerContent: (isOpen: boolean, onClose: () => void) => (
      <ResourcesDrawer isOpen={isOpen} onClose={onClose} />
    ),
    status: true,
  },
  {
    label: "Spaceship",
    image: "spaceship.png",
    drawerContent: (isOpen: boolean, onClose: () => void) => (
      <ComingSoon tab={"Spaceship"} />
    ),
    status: false,
  },
  {
    label: "Universe",
    image: "universe.png",
    status: false,
    drawerContent: (isOpen: boolean, onClose: () => void) => (
      <ComingSoon tab={"Universe"} />
    ),
  },
  {
    label: "Battles",
    image: "battle.png",
    status: false,
    drawerContent: (isOpen: boolean, onClose: () => void) => (
      <ComingSoon tab={"Battles"} />
    ),
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
      <>
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
      </>
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
          bgGradient="linear(to-b, #333649 0%, #1F212E 100%)"
          bg={checkCommingSoon ? "rgba(0, 0, 0, 0.8)" : ""}
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
          <DrawerBody px={3}>
            {tab ? (
              <Swap />
            ) : (
              listMenu[selectedMenuItem]?.drawerContent?.(isOpen, onClose)
            )}
          </DrawerBody>
          <DrawerFooter p={0} position={"sticky"} bottom={0} zIndex={999999}>
            <RenderMenuItems checkActive={true} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </HStack>
  );
}
