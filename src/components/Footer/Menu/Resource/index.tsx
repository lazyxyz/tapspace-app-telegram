import { Button, HStack, Link, Stack, Text } from "@chakra-ui/react";
import FrequencyResource from "./FrequencyResource";
import ListResources from "./ListResources";
import { FaChevronLeft } from "react-icons/fa";
import NextLink from "next/link";

export default function ResourcesDrawer({ isOpen, onClose }: any) {
  const HeaderResource = () => {
    return (
      <HStack w={"full"} py={3} px={2} justifyContent={"space-between"}>
        <Text fontSize={"lg"} fontWeight={800}>
          Resources
        </Text>
        <Link
          as={NextLink}
          href="/swap"
          fontSize={"lg"}
          fontWeight={800}
          variant={"unstyled"}
          textColor={"#D5FE4B"}
        >
          <Text>Swap</Text>
        </Link>
      </HStack>
    );
  };

  return (
    <Stack
      w={"full"}
      h={"full"}
      spacing={0}
      px={3}
      pb={24}
      bgGradient={"linear(to-b, #333649 0%, #1F212E 100%)"}
    >
      <HeaderResource />
      <Stack overflow={"auto"} maxH={"80vh"} spacing={0}>
        <FrequencyResource />
        <ListResources />
      </Stack>
    </Stack>
  );
}
