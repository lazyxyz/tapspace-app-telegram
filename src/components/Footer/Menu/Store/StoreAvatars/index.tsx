import { IconBitcoin } from "@/components/Icons";
import { ImageWithFallback } from "@/components/ImageFallback";
import {
  Box,
  Button,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function StorageAvatar() {
  return (
    <VStack w={"full"}>
      <HStack
        bg={"#1F212E"}
        p={3}
        rounded={"xl"}
        justifyContent={"space-between"}
        w={"full"}
      >
        <Stack align={"center"} w={"40%"}>
          <Box>
            <ImageWithFallback
              src={"/assets/avatar/avatar.png"}
              alt=""
              width={"102px"}
              height={"140px"}
              style={{
                filter: "drop-shadow(0px 0px 7px rgba(38, 177, 255, 0.65))",
              }}
            />
          </Box>
        </Stack>
        <Stack w={"50%"} spacing={1}>
          <Text fontWeight={800}>Tony Stark</Text>
          <Text fontSize={"sm"} fontWeight={400}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt.
          </Text>

          <Button
            rounded={"xl"}
            ml={"auto"}
            mt={3}
            borderBottomWidth={3}
            py={2}
            gap={2}
            variant={"hover"}
            w={"full"}
            fontWeight={800}
            borderColor={"#0DD63E"}
            bgGradient={"linear(to-b, #0DD63E 0%, #00A65B 100%)"}
          >
            Select
          </Button>
        </Stack>
      </HStack>

      <SimpleGrid columns={3} w={"full"} spacing={2}>
        {Array.from(Array(9)).map((_, idx) => (
          <Stack
            align={"center"}
            key={idx}
            borderWidth={1}
            borderColor={"#3F435A"}
            py={4}
            bg={"#1F212E"}
            rounded={"xl"}
            w={"full"}
          >
            <ImageWithFallback
              src={"/assets/avatar/avatar.png"}
              alt=""
              width={"32px"}
              height={"44px"}
              style={{
                filter: "drop-shadow(0px 0px 7px rgba(38, 177, 255, 0.65))",
              }}
            />
            <Text fontWeight={600} textColor={"text.100"}>
              Tony Stark
            </Text>

            <HStack spacing={1}>
              <IconBitcoin w={"12px"} h={"12px"} />
              <Text fontWeight={800} textColor={"white"} fontSize={"sm"}>
                10,000
              </Text>
            </HStack>
          </Stack>
        ))}
      </SimpleGrid>
    </VStack>
  );
}
