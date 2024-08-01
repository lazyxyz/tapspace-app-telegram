import HomePage from "@/components/Home";
import TelegramScreen from "@/components/Telegram/TelegramScreen";

export default function Index() {
  return (
    <TelegramScreen showbackbutton={false}>
      <HomePage />;
    </TelegramScreen>
  );
}
