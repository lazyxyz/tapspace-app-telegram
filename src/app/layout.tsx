import type { Metadata } from "next";
import ChakraProviderWrapper from "@/components/Wrapper/ChakraProvider";
import Layout from "@/components/Wrapper/Layout";
import Script from "next/script";
import { TelegramProvider } from "@/lib/TelegramProvider";

export const metadata: Metadata = {
  title: "Open space",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ChakraProviderWrapper>
          <TelegramProvider>
            <Layout>{children}</Layout>
          </TelegramProvider>
        </ChakraProviderWrapper>
      </body>
    </html>
  );
}
