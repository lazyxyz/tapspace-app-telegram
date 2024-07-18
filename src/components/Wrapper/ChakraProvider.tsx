"use client";

import theme from "@/theme/theme";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";

const ChakraProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider
        options={{
          initialColorMode: "dark",
          useSystemColorMode: true,
        }}
      >
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  );
};

export default ChakraProviderWrapper;
