import { Image } from "@chakra-ui/react";

export const IconBitcoin = ({ w, h }: { w?: any; h?: any }) => {
  return <Image src="/bitcoin.svg" w={w || "32px"} h={h || "32px"} />;
};
