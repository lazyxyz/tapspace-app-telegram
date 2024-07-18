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
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import ResourcesDrawer from "./Menu/Resource";
import Swap from "./Menu/Resource/Swap";
import { useRouter } from "next/navigation";
import { BiArrowBack } from "react-icons/bi";
import { BsArrowLeft } from "react-icons/bs";
import { FaAngleLeft, FaChevronLeft } from "react-icons/fa";

export default function Footer() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMenuItem, setSelectedMenuItem] = useState<number>(0);
  const listMenu = [
    {
      label: "Resources",
      image: "resources.png",
      drawerContent: <ResourcesDrawer isOpen={isOpen} onClose={onClose} />,
    },
    {
      label: "Spaceship",
      image: "spaceship.png",
    },
    {
      label: "Universe",
      image: "universe.png",
    },
    {
      label: "Battle",
      image: "battle.png",
    },
  ];

  const handleMenuClick = (index: number) => {
    setSelectedMenuItem(index);
    onOpen();
  };

  const [tab, setTab] = useState(false);

  return (
    <HStack
      position={"sticky"}
      bottom={0}
      w={"full"}
      justifyContent={"space-between"}
      zIndex={1000}
      spacing={0}
    >
      {listMenu.map((item, idx) => (
        <VStack
          key={idx}
          w={"full"}
          borderWidth={1}
          borderTopWidth={"3px"}
          bgGradient="linear(to-b, #333649 0%, #1F212E 100%)"
          borderColor={"#545978"}
          py={1}
          roundedTop={"2xl"}
          position={"relative"}
          minH={"80px"}
          justifyContent={"end"}
          onClick={() => handleMenuClick(idx)}
          cursor="pointer"
        >
          <Image
            src={`/assets/menu/${item.image}`}
            position={"absolute"}
            top={-3}
          />
          <Text textColor={"white"} fontSize={"11px"} fontWeight={"900"}>
            {item.label}
          </Text>
        </VStack>
      ))}

      <Drawer placement={"bottom"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />

        <DrawerContent
          h={"82vh"}
          px={"0 !"}
          mx={"0 !"}
          bgGradient="linear(to-b, #333649 0%, #1F212E 100%)"
          borderTopWidth={3}
          borderColor={"#545978"}
          roundedTop={"xl"}
        >
          <DrawerHeader borderBottomWidth="1px" border={0}>
            <HStack w={"full"} justifyContent={"space-between"}>
              {!tab && <Text> {listMenu[selectedMenuItem]?.label}</Text>}
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
          </DrawerHeader>
          <DrawerBody px={3}>
            {tab ? <Swap /> : listMenu[selectedMenuItem]?.drawerContent}
          </DrawerBody>
          <DrawerFooter p={0} position={"sticky"} bottom={0}>
            {listMenu.map((item, idx) => (
              <VStack
                key={idx}
                w={"full"}
                borderWidth={1}
                borderTopWidth={"3px"}
                bgGradient={
                  selectedMenuItem === idx
                    ? "linear(to-b, #0DD63E 0%, #00A65B 100%)"
                    : "linear(to-b, #333649 0%, #1F212E 100%)"
                }
                borderColor={selectedMenuItem === idx ? "#7CEE22" : "#545978"}
                py={1}
                roundedTop={"2xl"}
                position={"relative"}
                minH={"80px"}
                justifyContent={"end"}
                onClick={() => handleMenuClick(idx)}
                cursor="pointer"
              >
                <Image
                  src={`/assets/menu/${item.image}`}
                  position={"absolute"}
                  top={-3}
                />
                <Text textColor={"white"} fontSize={"11px"} fontWeight={"900"}>
                  {item.label}
                </Text>
              </VStack>
            ))}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </HStack>
  );
}
