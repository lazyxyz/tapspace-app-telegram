import {
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import StorageAvatar from "./StoreAvatars";
import StoreResources from "./StoreResources";

export default function Store() {
  const TABS = [
    {
      label: "Spaceship",
      image: "universe.png",
      panel: <StorageAvatar />,
      link: "/home",
    },
    {
      label: "Resource",
      image: "universe.png",
      panel: <StoreResources />,
      link: "/home",
    },
    {
      label: "Avatar",
      image: "universe.png",
      panel: <StorageAvatar />,
      link: "/home",
    },
  ];

  return (
    <VStack
      w={"full"}
      h={"full"}
      spacing={0}
      pt={16}
      bgGradient={"linear(to-b, #333649 0%, #1F212E 100%)"}
    >
      {/* <Tabs variant="unstyled" display="flex" flexDirection="column" w={"full"}>
        <TabList
          px={3}
          display="flex"
          justifyContent="space-between"
          borderTopRadius="2xl"
          w={"full"}
        >
          <HStack w={"full"} justifyContent={"space-between"} pt={4}>
            {TABS.map((item) => (
              <Tab
                key={item.link}
                p={0}
                w={"full"}
                fontWeight={800}
                py={1}
                px={4}
                rounded={"xl"}
                bg={"#545978"}
                textColor={"text.100"}
                borderWidth={1}
                borderBottomWidth={3}
                borderColor={"#6C7293"}
                _selected={{
                  bgGradient: "linear(to-b, #0DD63E 0%, #00A65B 100%)",
                  color: "#FFFFFF",
                  borderWidth: 1,
                  borderBottomWidth: 3,
                  borderColor: "#018241",
                }}
              >
                {item.label}
              </Tab>
            ))}
          </HStack>
        </TabList>

        <TabPanels
          flex="1"
          overflow="auto"
          bgGradient={"linear(to-b, #333649 0%, #1F212E 100%)"}
          w={"full"}
          minH={"78vh"}
          px={0}
        >
          {TABS.map((item, index) => (
            <TabPanel key={index} px={3}>
              {item.panel}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs> */}
    </VStack>
  );
}
