"use client";

import {
  Box,
  StackProps,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import Resources from "../Tabs/Resources";
import MySpaceShip from "../Tabs/MySpaceShip";
import Universe from "../Tabs/Universe";
import Battle from "../Tabs/Battle";

export default function TabPage({ children, ...rest }: StackProps) {
  const TABS = [
    {
      title: "Resources",
      panel: <Resources />,
    },
    {
      title: "My Spaceship",
      panel: <MySpaceShip />,
    },
    {
      title: "Universe",
      panel: <Universe />,
    },
    {
      title: "Battle",
      panel: <Battle />,
    },
  ];

  return (
    <Box w={"100%"} {...rest} mx={"auto"}>
      <Tabs variant="soft-rounded" colorScheme="green" w={"full"}>
        <TabList justifyContent={"space-between"} px={2}>
          {TABS.map((tab, index) => (
            <Tab
              bg={"#eff5ff"}
              _selected={{ color: "white", bg: "#6C8BC3" }}
              rounded={"xl"}
              py={[4, 5]}
              fontSize={["10px", "xl"]}
              key={index}
            >
              {tab.title}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          {TABS.map((tab, index) => (
            <TabPanel px={0} key={index}>
              {tab.panel}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
      {children}
    </Box>
  );
}
