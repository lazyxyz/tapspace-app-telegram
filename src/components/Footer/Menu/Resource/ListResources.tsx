import PopupUpgradeBot from "@/components/Popup/PopupUpgradeBot";
import { MintItemType } from "@/components/Tabs/Resources/TotalResource/InfoMint";
import { imageResources, numeralFormat } from "@/utils/utils";
import {
  Box,
  Button,
  HStack,
  Image,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const ListResources = () => {
  const { data } = useQuery<any>({
    queryKey: ["infoUser"],
  });

  const [listData, setListData] = useState<MintItemType[]>(() => {
    if (typeof window !== "undefined") {
      const savedListData = localStorage.getItem("listData");
      if (savedListData) {
        return JSON.parse(savedListData) as MintItemType[];
      } else {
        //@ts-ignore
        const initialData = data?.resources.map((item: any) => ({
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

  console.log(data?.resources);

  return (
    <Stack>
      {data?.resources.map((item: any, idx: number) => (
        <Stack
          bg={"#13161F"}
          w={"full"}
          key={idx}
          px={3}
          py={4}
          rounded={"xl"}
          borderWidth={1}
          borderBottomWidth={3}
          borderColor={"#3F435A"}
        >
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
                    {/* {item.calculatedValue}/{item.capacity} */}
                    {numeralFormat(item.mining)}
                  </Text>
                </HStack>
              </VStack>
            </HStack>
            <BotResource
              item={data.resources[idx]}
              listData={listData}
              data={data}
              idx={idx}
            />
          </HStack>
        </Stack>
      ))}
    </Stack>
  );
};

const BotResource = ({ item, listData, data, idx }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      bg={"rgba(255, 255, 255, 0.12)"}
      position={"relative"}
      p={2}
      rounded={"xl"}
      onClick={() => onOpen()}
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
        Level {data?.resources[idx].level_resource}
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

      <PopupUpgradeBot
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        item={item}
        listData={listData}
        levelResource={data?.resources[idx].level_resource}
      />
    </Box>
  );
};

export default ListResources;
