import { Image } from "@chakra-ui/react";

export const IconBitcoin = ({ w, h }: { w?: any; h?: any }) => {
  return <Image src="/bitcoin.svg" w={w || "32px"} h={h || "32px"} />;
};

export const IconArrowRight = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
    >
      <path
        d="M3.16663 8H13.8333M13.8333 8L9.83329 4M13.8333 8L9.83329 12"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
