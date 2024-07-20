import {
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import BitcoinDisplay from "./Bitcoin";
interface QueryData {
  bot_level?: string;
}
const FrequencyResource = () => {
  const convertLevelToNumber = (levelString: string) => {
    const match = levelString.match(/lv(\d+)/);
    return match ? parseInt(match[1], 10) : NaN;
  };
  const queryClient = useQueryClient();
  const queryKey = [`infoUser`];

  const data = queryClient.getQueryData<QueryData>(queryKey);
  const botLevel = data?.bot_level
    ? convertLevelToNumber(data.bot_level)
    : undefined;

  return (
    <VStack w={"full"}>
      <Stack bg={"#13161F"} w={"full"} px={3} py={4} rounded={"xl"}>
        <HStack justifyContent={"space-between"}>
          <BitcoinDisplay levelBot={Number(botLevel)} />

          <Box
            bg={"rgba(255, 255, 255, 0.12)"}
            position={"relative"}
            p={2}
            rounded={"xl"}
          >
            <Image src="/bot.svg" w={"56px"} h={"56px"} />
            <Text
              fontSize={"10px"}
              fontWeight={800}
              position={"absolute"}
              bg={"#1EA2ED"}
              px={2}
              py={1}
              rounded={"xl"}
              left={2.5}
              top={-2}
            >
              Level {botLevel}
            </Text>
            <Button
              bottom={0}
              w={"full"}
              left={0}
              right={0}
              roundedTop={0}
              rounded={"xl"}
              variant={"unsyled"}
              fontSize={"xs"}
              h={"24px"}
              position={"absolute"}
              bgGradient="linear(to-b, #0DD63E 0%, #00A65B 100%)"
            >
              Upgrade
            </Button>
          </Box>
        </HStack>
      </Stack>
    </VStack>
  );
};

export default FrequencyResource;
