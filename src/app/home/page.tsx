import HomePage from "@/components/Home";
import TelegramScreen from "@/components/Telegram/TelegramScreen";
import { Text, VStack } from "@chakra-ui/react";
import React from "react";

export default function Index() {
  return (
    <TelegramScreen showbackbutton={true}>
      <HomePage />;
    </TelegramScreen>
  );
}
