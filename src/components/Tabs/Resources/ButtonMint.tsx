import { Box, Button, ButtonProps, Stack } from "@chakra-ui/react";

const ThreeDButton = ({ children, ...rest }: ButtonProps) => {
  return (
    <Stack position="relative" display="inline-block" width="fit-content">
      <Button
        position="relative"
        zIndex={1}
        fontFamily="'Rubik', sans-serif"
        fontWeight="600"
        color="white"
        variant={"hover"}
        padding="1rem 4em"
        w={"full"}
        background="#FA0048"
        borderRadius="0.75em"
        transformStyle="preserve-3d"
        transition="transform 150ms cubic-bezier(0, 0, 0.58, 1), background 150ms cubic-bezier(0, 0, 0.58, 1)"
        // _hover={{
        //   background: "#ffe9e9",
        //   transform: "translate(0, 0.25em)",
        // }}
        _active={{
          background: "#ffe9e9",
          transform: "translate(0em, 0.5em)",
        }}
        {...rest}
      >
        {children}
      </Button>
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        background="#f9c4d2"
        borderRadius="0.75em"
        boxShadow="0 0 0 0px #FA0048, 0 0.2em 0 0 #ffe3e2"
        transform="translate3d(0, 0.5em, -1em)"
        zIndex={0}
        transition="transform 150ms cubic-bezier(0, 0, 0.58, 1), box-shadow 150ms cubic-bezier(0, 0, 0.58, 1)"
      />
    </Stack>
  );
};

export default ThreeDButton;
