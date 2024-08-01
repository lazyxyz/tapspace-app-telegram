import ComingSoon from "@/components/Footer/Menu/ComingSoon";
import TelegramScreen from "@/components/Telegram/TelegramScreen";
import React from "react";

export default function Spaceship() {
  return (
    <TelegramScreen showbackbutton={true}>
      <ComingSoon tab="Spaceship" src="/assets/menu/bgSpaceship.png" />;
    </TelegramScreen>
  );
}
