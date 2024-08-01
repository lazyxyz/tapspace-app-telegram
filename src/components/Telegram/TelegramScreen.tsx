"use client";

import { useTelegram } from "@/lib/TelegramProvider";
import { Box } from "@chakra-ui/react";
import { redirect, useRouter } from "next/navigation"; // Import the useRouter hook
import { useEffect } from "react";
import "./TelegramScreen.css";

const TelegramScreen = (props: any) => {
  const { webApp } = useTelegram();
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    if (props.showbackbutton) {
      //@ts-ignore
      webApp.BackButton.show();
      //@ts-ignore
      webApp.BackButton.onClick(() => {
        redirect("/"); // Navigate to the home page when back button is clicked
      });
    } else {
      //@ts-ignore
      webApp.BackButton.hide();
    }

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      //@ts-ignore
      webApp.BackButton.offClick(() => {
        router.push("/");
      });
    };
  }, [webApp, props.showbackbutton, router]);

  return <Box {...props} w={"full"} h={"full"} />;
};

export default TelegramScreen;
