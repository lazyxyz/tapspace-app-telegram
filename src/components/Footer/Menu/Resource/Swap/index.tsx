import {
  Button,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BiChevronDown } from "react-icons/bi";
import { FaAngleDown } from "react-icons/fa";

export default function Swap() {
  return (
    <VStack>
      <Image src="/assets/bannerSwap.svg" />

      <HStack
        bg={"#13161F"}
        w={"full"}
        p={3}
        rounded={"xl"}
        justifyContent={"space-between"}
      >
        <Stack>
          <Text>Use</Text>
          <Text>0</Text>
        </Stack>

        <Stack>
          <Button rounded={"xl"}>Steel</Button>
          <Text>Balance: 246,67B</Text>
        </Stack>
      </HStack>
    </VStack>
  );
}
