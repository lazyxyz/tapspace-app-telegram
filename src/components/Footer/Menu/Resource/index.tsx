import { Stack } from "@chakra-ui/react";
import FrequencyResource from "./FrequencyResource";
import { BitcoinProvider } from "@/components/Wrapper/BitcoinProvider";

export default function ResourcesDrawer({ isOpen, onClose }: any) {
  return (
    <Stack w={"full"}>
      <FrequencyResource />
    </Stack>
  );
}
