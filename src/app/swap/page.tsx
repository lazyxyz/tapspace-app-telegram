import Swap from "@/components/Footer/Menu/Resource/Swap";
import TelegramScreen from "@/components/Telegram/TelegramScreen";
import React from "react";

export default function Index() {
  return (
    <TelegramScreen showbackbutton={true}>
      <Swap />;
    </TelegramScreen>
  );
}
