import React, { useEffect } from "react";
import "./TelegramScreen.css";
import { useTelegram } from "@/lib/TelegramProvider";
import { Box } from "@chakra-ui/react";

const TelegramScreen = (props: any) => {
  const { webApp } = useTelegram();
  useEffect(() => {
    if (props.showbackbutton) {
      //@ts-ignore
      webApp.BackButton.show();
    } else {
      //@ts-ignore
      webApp.BackButton.hide();
    }
  }, [webApp]);

  return (
    <Box {...props} display={"flex"} w={"full"} flexDirection={"column"} />
  );
};

export default TelegramScreen;
