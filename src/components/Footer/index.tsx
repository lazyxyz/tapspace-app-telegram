import { HStack, Image, Text, VStack } from "@chakra-ui/react";
import React from "react";

export default function Footer() {
  const listMenu = [
    {
      label: "Resources",
      image: "resources.png",
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
    </HStack>
  );
}
