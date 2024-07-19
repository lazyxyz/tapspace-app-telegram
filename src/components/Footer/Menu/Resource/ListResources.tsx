import { MintItemType } from "@/components/Tabs/Resources/TotalResource/InfoMint";
import { DataMint } from "@/lib/data";
import { imageResources } from "@/utils/utils";
import {
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

const ListResources = () => {
  const [listData, setListData] = useState<MintItemType[]>(() => {
    if (typeof window !== "undefined") {
      const savedListData = localStorage.getItem("listData");
      if (savedListData) {
        return JSON.parse(savedListData) as MintItemType[];
      } else {
        const initialData = DataMint.map((item: any) => ({
          ...item,
          calculatedValue: item.capacity,
        }));
        localStorage.setItem("listData", JSON.stringify(initialData));
        return initialData;
      }
    }
    return [];
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const allFull = listData.every(
        (item) => item.calculatedValue >= item.capacity
      );

      if (allFull) {
        clearInterval(interval);
        return;
      }
      const savedListData = localStorage.getItem("listData");
      if (savedListData) {
        setListData(JSON.parse(savedListData) as MintItemType[]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [listData]);

  return (
    <>
      {listData.map((item, idx) => (
        <VStack w={"full"} key={idx}>
          <Stack bg={"#13161F"} w={"full"} px={3} py={4} rounded={"xl"}>
            <HStack justifyContent={"space-between"}>
              <HStack>
                <Box bg={"rgba(255, 255, 255, 0.12)"} p={2} rounded={"xl"}>
                  <Image
                    src={imageResources[item?.resource_name]}
                    w={"56px"}
                    h={"56px"}
                  />
                </Box>
                <VStack align={"start"}>
                  <Stack spacing={0}>
                    <Text fontWeight={"800"}>{item.resource_name}</Text>
                    <Text fontSize={"xs"}>{item.frequency_mining}/Tap</Text>
                  </Stack>
                  <HStack align={"center"} spacing={1}>
                    <Image
                      src={imageResources[item?.resource_name]}
                      w={"16px"}
                      h={"16px"}
                    />
                    <Text fontSize={"sm"} fontWeight={"800"}>
                      {item.calculatedValue}/{item.capacity}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
              <BotResource />
            </HStack>
          </Stack>
        </VStack>
      ))}
    </>
  );
};

const BotResource = () => {
  return (
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
        Level 2
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
  );
};

export default ListResources;
