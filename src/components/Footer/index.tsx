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
  Icon,
  Image,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useState, useMemo, useEffect } from "react";
import { FaChevronLeft } from "react-icons/fa";
import ResourcesDrawer from "./Menu/Resource";
import Swap from "./Menu/Resource/Swap";
import ReferralDrawer from "./Menu/Referral";
import ComingSoon from "./Menu/ComingSoon";
import { IconClose } from "../Icons";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
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
    bgIncoming: "/assets/battles.mp4",
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
    setTab(false);
    onOpen();
  };

  const RenderMenuItems = ({ checkActive }: { checkActive?: boolean }) => {
    return (
      <HStack w={"full"} spacing={0}>
        {listMenu.map((item, idx) => (
          <VStack
            key={idx}
            w={"20%"}
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
  const bgIncoming = listMenu[selectedMenuItem]?.bgIncoming;
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
  }, [selectedMenuItem]);

  const handleMediaLoad = () => {
    setIsLoading(false);
  };
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
          h={
            checkCommingSoon
              ? "100vh"
              : listMenu[selectedMenuItem]?.label === "Referral"
              ? "90vh"
              : "82vh"
          }
          px={"0 !"}
          mx={"0 !"}
          bgGradient={"linear(to-b, #333649 0%, #1F212E 100%)"}
          bgSize={"cover"}
          borderTopWidth={3}
          borderColor={"#545978"}
          roundedTop={"xl"}
        >
          {bgIncoming && bgIncoming.endsWith(".mp4") ? (
            <MotionBox
              as="video"
              src={bgIncoming}
              autoPlay
              loop
              muted
              playsInline
              position="fixed"
              top="0"
              left="0"
              width="100%"
              height="100%"
              objectFit="cover"
              zIndex="-1"
              pointerEvents="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
          ) : (
            <MotionBox
              bgImage={`url(${bgIncoming})`}
              bgSize="cover"
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              zIndex="-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />
          )}

          {listMenu[selectedMenuItem]?.label === "Referral" && (
            <Box
              position={"absolute"}
              right={3}
              top={3}
              zIndex={99}
              onClick={onClose}
            >
              <Icon as={IconClose} right={0} position={"absolute"} w={"full"} />
            </Box>
          )}
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
            w={"full"}
            rounded={"xl"}
            bottom={0}
            backdropFilter={"blur(4.5px)"}
          >
            <RenderMenuItems checkActive={true} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </HStack>
  );
}
