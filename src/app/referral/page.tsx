import ReferralDrawer from "@/components/Footer/Menu/Referral";
import TelegramScreen from "@/components/Telegram/TelegramScreen";
import React from "react";

export default function Index() {
  return (
    <TelegramScreen showbackbutton={true}>
      <ReferralDrawer />;
    </TelegramScreen>
  );
}
