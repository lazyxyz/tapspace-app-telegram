import ComingSoon from "@/components/Footer/Menu/ComingSoon";
import TelegramScreen from "@/components/Telegram/TelegramScreen";
import React from "react";

export default function Battles() {
  return (
    <TelegramScreen showbackbutton={true}>
      <ComingSoon tab="Battles" src="/assets/battles.mp4" />
    </TelegramScreen>
  );
}
