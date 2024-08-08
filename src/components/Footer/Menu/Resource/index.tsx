import { HStack, Stack, Text, useDisclosure } from "@chakra-ui/react";
import FrequencyResource from "./FrequencyResource";
import ListResources from "./ListResources";
import Swap from "./Swap";

export default function ResourcesDrawer() {
  const { onOpen, isOpen, onClose } = useDisclosure();
  const HeaderResource = () => {
    return (
      <HStack w={"full"} py={3} px={2} justifyContent={"space-between"}>
        <Text fontSize={"lg"} fontWeight={800}>
          Resources
        </Text>
        <Text
          onClick={onOpen}
          fontSize={"lg"}
          fontWeight={800}
          variant={"unstyled"}
          textColor={"#D5FE4B"}
          cursor={"pointer"}
        >
          Swap
        </Text>
      </HStack>
    );
  };

  return (
    <>
      {!isOpen ? (
        <Stack
          w={"full"}
          h={"full"}
          spacing={0}
          pt={16}
          px={3}
          bgGradient={"linear(to-b, #333649 0%, #1F212E 100%)"}
        >
          <HeaderResource />
          <Stack overflow={"auto"} spacing={0}>
            <FrequencyResource />
            <ListResources />
          </Stack>
        </Stack>
      ) : (
        <Swap onClose={onClose} />
      )}
    </>
  );
}
