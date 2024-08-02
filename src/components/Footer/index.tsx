"use client";

import {
  Box,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import Leaderboard from "../Leaderboard";
import ComingSoon from "./Menu/ComingSoon";
import ReferralDrawer from "./Menu/Referral";
import ResourcesDrawer from "./Menu/Resource";
import HomePage from "../Home";
import TelegramScreen from "../Telegram/TelegramScreen";

const Footer = React.memo(function FooterComponent() {
  const listMenu = useMemo(
    () => [
      {
        label: "Home",
        image: "resources.png",
        panel: <HomePage />,
        link: "/home",
      },
      {
        label: "Miner",
        image: "miner.png",
        panel: <ResourcesDrawer />,
        link: "/miner",
      },
      {
        label: "Spaceship",
        image: "spaceship.png",
        panel: (
          <ComingSoon tab="Spaceship" src="/assets/menu/bgSpaceship.png" />
        ),
        link: "/spaceship",
      },
      {
        label: "Universe",
        image: "universe.png",
        panel: <ComingSoon tab="Universe" src="/assets/menu/bgUniverse.png" />,
        link: "/universe",
      },
      {
        label: "Battles",
        image: "Battles.png",
        panel: <ComingSoon tab="Battles" src="/assets/battles.mp4" />,
        link: "/battles",
      },
      {
        label: "Referral",
        image: "Referral.png",
        panel: <ReferralDrawer />,
        link: "/referral",
      },
    ],
    []
  );

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

  const handleTabChange = (index: number) => {
    setSelectedTabIndex(index);
  };

  return (
    <Box position="fixed" bottom={0} w="full" zIndex={1000}>
      <Tabs
        onChange={handleTabChange}
        index={selectedTabIndex}
        variant="unstyled"
        h={"100vh"}
        display="flex"
        flexDirection="column"
      >
        <TabPanels flex="1" overflow="auto">
          {listMenu.map((item, idx) => (
            <TabPanel key={idx} p={0} h="full">
              <TelegramScreen
                showbackbutton={selectedTabIndex !== 0}
                setSelectedTabIndex={setSelectedTabIndex}
              >
                {item.panel}
              </TelegramScreen>
            </TabPanel>
          ))}
        </TabPanels>
        <TabList
          display="flex"
          justifyContent="space-between"
          borderTopRadius="2xl"
        >
          {listMenu.map((item, idx) => (
            <Tab
              key={idx}
              width={"62.5px"}
              flex="1"
              textAlign="center"
              p={4}
              borderTopRadius="2xl"
              bgGradient="linear(to-b, #333649 0%, #1F212E 100%)"
              color={selectedTabIndex === idx ? "#7CEE22" : "#545978"}
              _selected={{
                color: "white",
                fontWeight: "bold",
                bgGradient: "linear(to-b, #0DD63E 0%, #00A65B 100%)",
                borderColor: "#7CEE22",
              }}
              display={"flex"}
              alignItems={"center"}
              borderWidth={1}
              borderTopWidth={"3px"}
              borderColor={"#545978"}
              roundedTop={"2xl"}
              position={"relative"}
              maxH={"64px"}
              justifyContent={"center"}
            >
              <Stack align="center">
                <Box position={"absolute"} top={-5} w={"44px"} h={"44px"}>
                  <Image
                    src={`/assets/menu/${item.image}`}
                    alt={item.label}
                    fill
                  />
                </Box>
                <Text
                  textColor={"white"}
                  mt={2}
                  fontSize={"11px"}
                  fontWeight={"900"}
                >
                  {item.label}
                </Text>
              </Stack>
            </Tab>
          ))}
        </TabList>
      </Tabs>

      {selectedTabIndex === 0 && (
        <Box
          w={"44px"}
          h={"44px"}
          position={"absolute"}
          bottom={24}
          right={4}
          borderWidth={1}
          borderBottom={"2px"}
          borderColor={"rgba(255, 255, 255, 0.15)"}
          bg={"rgba(255, 255, 255, 0.15)"}
          rounded={"xl"}
          onClick={onOpen}
          zIndex={"9999"}
        >
          <Image
            src={"/assets/leaderboard.png"}
            alt="leaderboard"
            width={"40"}
            height={"40"}
          />
        </Box>
      )}
      <Leaderboard isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
    </Box>
  );
});

export default Footer;
