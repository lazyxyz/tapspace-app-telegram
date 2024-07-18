"use client";

import {
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
          minH={"80vh"}
          px={"0 !"}
          mx={"0 !"}
          bgGradient="linear(to-b, #333649 0%, #1F212E 100%)"
          borderTopWidth={3}
          borderColor={"#545978"}
          roundedTop={"xl"}
        >
          <DrawerHeader borderBottomWidth="1px" border={0}>
            {listMenu[selectedMenuItem]?.label}
          </DrawerHeader>
          <DrawerBody px={3}>
            {listMenu[selectedMenuItem]?.drawerContent}
          </DrawerBody>
          <DrawerFooter p={0} position={"sticky"} bottom={0}>
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
                zIndex={1100}
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
