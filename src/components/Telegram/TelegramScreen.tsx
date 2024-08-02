"use client";

import { useTelegram } from "@/lib/TelegramProvider";
import { Box } from "@chakra-ui/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";
import "./TelegramScreen.css";

const TelegramScreen = (props: any) => {
  const { webApp } = useTelegram();

  useEffect(() => {
    if (props.showbackbutton) {
      //@ts-ignore
      webApp.BackButton.show();
      //@ts-ignore
      webApp.BackButton.onClick(() => {
        props.setSelectedTabIndex(0);
      });
    } else {
      //@ts-ignore
      webApp.BackButton.hide();
    }

    return () => {
      //@ts-ignore
      webApp.BackButton.offClick(() => {
        props.setSelectedTabIndex(0);
      });
    };
  }, [webApp, props.showbackbutton, props.setSelectedTabIndex]);

  return <Box {...props} w={"full"} h={"full"} />;
};

export default TelegramScreen;
