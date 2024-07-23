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
import { FaChevronLeft } from "react-icons/fa";
import ResourcesDrawer from "./Menu/Resource";
import Swap from "./Menu/Resource/Swap";

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
    {
      label: "Referral",
      image: "Referral.png",
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
          <Text textColor={"white"} mt={7} fontSize={"11px"} fontWeight={"900"}>
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
          <DrawerHeader borderBottomWidth="1px" border={0} pt={2} pb={1}>
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
                bgGradient="linear(to-b, #333649 0%, #1F212E 100%)"
                borderColor={"#545978"}
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
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </HStack>
  );
}
