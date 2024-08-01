import ResourcesDrawer from "@/components/Footer/Menu/Resource";
import TelegramScreen from "@/components/Telegram/TelegramScreen";
import React from "react";

export default function Index() {
  return (
    <TelegramScreen showbackbutton={true}>
      <ResourcesDrawer />;
    </TelegramScreen>
  );
}
