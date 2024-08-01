import ComingSoon from "@/components/Footer/Menu/ComingSoon";
import TelegramScreen from "@/components/Telegram/TelegramScreen";
import React from "react";

export default function Universe() {
  return (
    <TelegramScreen showbackbutton={true}>
      <ComingSoon tab="Universe" src="/assets/menu/bgUniverse.png" />;
    </TelegramScreen>
  );
}
