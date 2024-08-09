import { ImageWithFallback } from "@/components/ImageFallback";
import PopupUpgradeSpacship from "@/components/Popup/PopupUpgradeSpaceship";
import { imageSkills } from "@/utils/utils";
import {
  Box,
  Button,
  HStack,
  Icon,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";

interface Item {
  level: number;
  pro_spaceship_name: string;
}

export default function Spaceship() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const { data } = useQuery<any>({
    queryKey: ["infoUser"],
  });

  return (
    <VStack
      h={"full"}
      w={"full"}
      spacing={0}
      pt={16}
      px={3}
      bgGradient={"linear(to-b, #333649 0%, #1F212E 100%)"}
    >
      <Header />

      <VStack
        w={"full"}
        borderWidth={1}
        rounded={"xl"}
        borderBottomWidth={3}
        borderColor={"#3F435A"}
        overflowX={"hidden"}
      >
        <VStack
          position={"relative"}
          w={"full"}
          justifyContent={"center"}
          spacing={4}
        >
          <Stack zIndex={99} py={6}>
            <Text fontWeight={800}>THE EGG</Text>
            <ImageWithFallback
              src={"/assets/spaceship.png"}
              alt="spaceship.png"
              width={75}
              height={120}
            />
          </Stack>

          <Box
            position={"absolute"}
            w={"full"}
            h={"full"}
            bgImage={"/background.png"}
            filter="blur(5px)"
            top={0}
            left={0}
          />
        </VStack>
      </VStack>

      <Stack w={"full"} pt={4} overflow={"auto"}>
        {data?.properties_spaceship.map((item: Item) => {
          return (
            <HStack
              key={item.pro_spaceship_name}
              spacing={3}
              p={3}
              w={"full"}
              bg={"#13161F"}
              borderWidth={1}
              rounded={"xl"}
              borderBottomWidth={3}
              borderColor={"#3F435A"}
            >
              <Box rounded={"xl"} overflow={"hidden"}>
                <ImageWithFallback
                  width={"44px"}
                  height={"44px"}
                  alt=""
                  src={imageSkills[item.pro_spaceship_name]}
                />
              </Box>
              <Stack fontWeight={800} spacing={0}>
                <Text fontSize={"sm"}>{item.pro_spaceship_name}</Text>
                <Text fontSize={"xs"} textColor={"#D5FE4B"}>
                  Level {item.level}
                </Text>
              </Stack>

              <Button
                rounded={"xl"}
                ml={"auto"}
                borderBottomWidth={3}
                gap={2}
                onClick={() => {
                  setSelectedItem(item);
                  onOpen();
                }}
                py={0}
                variant={"hover"}
                borderColor={"#0DD63E"}
                bgGradient={"linear(to-b, #0DD63E 0%, #00A65B 100%)"}
              >
                <Text fontWeight={800}>Upgrade</Text>
              </Button>
            </HStack>
          );
        })}
      </Stack>

      {selectedItem && (
        <PopupUpgradeSpacship
          data={data}
          isDisabled={false}
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          item={selectedItem}
        />
      )}
    </VStack>
  );
}

const Header = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <HStack w={"full"} py={3} px={2} justifyContent={"space-between"}>
      <Text fontSize={"lg"} fontWeight={800}>
        Upgrade
      </Text>

      {/* <HStack textColor={"#D5FE4B"}>
        <Icon as={FaCartShopping} fontSize={"xl"} />
        <Text
          onClick={onOpen}
          fontSize={"lg"}
          fontWeight={800}
          variant={"unstyled"}
          textColor={"#D5FE4B"}
          cursor={"pointer"}
        >
          Store
        </Text>
      </HStack> */}
    </HStack>
  );
};
