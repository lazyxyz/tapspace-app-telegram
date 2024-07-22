import { ComponentStyleConfig, extendTheme } from "@chakra-ui/react";
import "@fontsource/nunito";

const fonts = {
  heading: `'Nunito',sans-serif`,
  body: `'Nunito',sans-serif`,
};

const breakpoints = {
  sm: "40em",
  md: "64em",
  lg: "80em",
  xl: "90em",
};
const colors = {
  primary: {
    DEFAULT: "#30417a",
    "100": "#30417a",
  },

  gray: {
    100: "#545978",
  },

  box: {
    "50": "rgba(39, 39, 42, 0.45)",
    "65": "rgba(63, 63, 70, 0.65)",
    "100": "#52525B",
    "150": "#27272A",
    "200": "#272727",
  },
  text: {
    "100": "#D4D4D8",
  },
};
const styles = {};

const Button: ComponentStyleConfig = {
  variants: {
    link: {
      color: "primary.50",
    },
  },
};

const components = {
  Link: {
    baseStyle: {
      _focus: {
        boxShadow: "none",
      },
      _hover: {
        textDecoration: "none",
      },
    },
  },
  Button,
};
const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: true,
  },

  styles,
  fonts,
  breakpoints,
  components,
  shadows: {
    outline: "none",
  },
  colors,
  sizes: {
    container: {
      ...breakpoints,
    },
  },
});

export default theme;
