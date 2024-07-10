import TabPage from "@/components/Wrapper/TabPage";
import Script from "next/script";

export default function Home() {
  return (
    <>
      <TabPage />

      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="afterInteractive"
      />
    </>
  );
}
