import React, { useState } from "react";
import {
  Box,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { IconBitcoin } from "@/components/Icons";
import PopupBuyResources from "@/components/Popup/PopupBuyResources";
export default function StoreResources() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [item, setItem] = useState();

  const listResources = [
    {
      label: "Steel",
      value: 500,
      image: "/assets/resources/material-steel.png",
      color: "#BBC1DE",
    },
    {
      label: "Aluminum",
      value: 312.5,
      image: "/assets/resources/material-alu.png",
      color: "white",
    },
    {
      label: "Copper",
      value: 187.5,
      image: "/assets/resources/material-copper.png",
      color: "#FDBF25",
    },
    {
      label: "Fiber",
      value: 125,
      image: "/assets/resources/material-fiber.png",
      color: "#D5FE4B",
    },
    {
      label: "Titanium",
      value: 62.5,
      image: "/assets/resources/material-titan.png",
      color: "#1EA2ED",
    },
  ];

  const handleBuyResources = (item: any) => {
    onOpen();
    setItem(item);
  };

  return (
    <SimpleGrid columns={2} w={"full"} spacing={2}>
      {listResources.map((item, idx) => (
        <Stack
          py={3}
          key={idx}
          align={"center"}
          rounded={"xl"}
          bg={"#1F212E"}
          borderWidth={1}
          borderBottomWidth={3}
          borderColor={"#3F435A"}
          onClick={() => handleBuyResources(item)}
          spacing={0}
        >
          <Text fontWeight={800}>
            <Box as="span" color={item.color}>
              {" "}
              {item.value}{" "}
            </Box>
            {item.label}
          </Text>
          <Text
            fontSize={"10px"}
            fontWeight={"semibold"}
            textColor={"text.100"}
          >
            <Box as="span" textColor={"white"}>
              +{item.value}
            </Box>{" "}
            for each miner level
          </Text>

          <Image src={item.image || ""} />
          <HStack spacing={1}>
            <IconBitcoin />
            <Text fontWeight={800}>{item.value}</Text>
          </HStack>
        </Stack>
      ))}

      <PopupBuyResources
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        item={item}
      />
    </SimpleGrid>
  );
}
