import { IconBitcoin } from "@/components/Icons";
import PopupBuyResources from "@/components/Popup/PopupBuyResources";
import { Toaster, toast } from "sonner";
import {
  Box,
  HStack,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
export default function StoreResources() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data }: any = useQuery({
    queryKey: ["infoUser"],
  });

  const [item, setItem] = useState();
  const [total, setTotal] = useState(0);

  const listResources = [
    {
      label: "Steel",
      value: 500,
      image: "/assets/resources/material-steel.png",
      color: "#BBC1DE",
    },
    {
      label: "Aluminum",
      value: 312,
      image: "/assets/resources/material-alu.png",
      color: "white",
    },
    {
      label: "Copper",
      value: 188,
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
      value: 62,
      image: "/assets/resources/material-titan.png",
      color: "#1EA2ED",
    },
  ];

  const handleBuyResources = (item: any, idx: number) => {
    onOpen();
    setItem(item);
    setTotal(Number(data?.resources[idx].level_resource) * item.value);
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
          onClick={() => handleBuyResources(item, idx)}
          spacing={0}
        >
          <Text fontWeight={800}>
            <Box as="span" color={item.color}>
              {" "}
              {Number(data?.resources[idx].level_resource) * item.value}{" "}
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
            <IconBitcoin w={"20px"} h={"20px"} />
            <Text fontWeight={800}>0.1</Text>
          </HStack>
        </Stack>
      ))}

      <PopupBuyResources
        isOpen={isOpen}
        onClose={onClose}
        onOpen={onOpen}
        item={item}
        total={total}
      />
    </SimpleGrid>
  );
}
