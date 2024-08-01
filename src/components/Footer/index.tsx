"use client";

import {
  Box,
  HStack,
  Image,
  Link,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ReferralDrawer from "./Menu/Referral";

const MotionBox = motion(Box);
const listMenu = [
  {
    label: "Home",
    image: "resources.png",
    status: true,
    link: "/home",
  },
  {
    label: "Miner",
    image: "miner.png",
    bgIncoming: "/assets/menu/bgSpaceship.png",
    status: false,
    link: "/miner",
  },
  {
    label: "Spaceship",
    image: "spaceship.png",
    bgIncoming: "/assets/menu/bgSpaceship.png",
    status: false,
    link: "/spaceship",
  },
  {
    label: "Universe",
    image: "universe.png",
    status: false,
    bgIncoming: "/assets/menu/bgUniverse.png",
    link: "/universe",
  },
  {
    label: "Battles",
    image: "Battles.png",
    status: false,
    bgIncoming: "/assets/battles.mp4",
    link: "/battles",
  },
  {
    label: "Referral",
    image: "Referral.png",
    drawerContent: (isOpen: boolean, onClose: () => void) => <ReferralDrawer />,
    status: true,
    link: "/referral",
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

  const pathName = usePathname();

  const RenderMenuItems = ({ checkActive }: { checkActive?: boolean }) => {
    return (
      <HStack w={"full"} spacing={0}>
        {listMenu.map((item, idx) => {
          const isActive =
            pathName === item.link ||
            (pathName === "/" && item.link === "/home");

          return (
            <Link
              display={"flex"}
              alignItems={"center"}
              as={NextLink}
              href={item.link || ""}
              key={idx}
              w={"full"}
              borderWidth={1}
              borderTopWidth={"3px"}
              bgGradient={
                isActive && idx === selectedMenuItem
                  ? "linear(to-b, #0DD63E 0%, #00A65B 100%)"
                  : "linear(to-b, #333649 0%, #1F212E 100%)"
              }
              borderColor={
                isActive && idx === selectedMenuItem ? "#7CEE22" : "#545978"
              }
              roundedTop={"2xl"}
              position={"relative"}
              minH={"64px"}
              justifyContent={"center"}
              onClick={() => handleMenuClick(idx)}
              cursor="pointer"
            >
              <Stack align={"center"}>
                <Image
                  src={`/assets/menu/${item.image}`}
                  position={"absolute"}
                  top={-5}
                  w={"44px"}
                  h={"44px"}
                  objectFit="contain"
                />
                <Text
                  textColor={"white"}
                  mt={4}
                  fontSize={"11px"}
                  fontWeight={"900"}
                >
                  {item.label}
                </Text>
              </Stack>
            </Link>
          );
        })}
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
    </HStack>
  );
}
