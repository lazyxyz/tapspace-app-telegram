import { Stack, Text } from "@chakra-ui/react";
import FrequencyResource from "./FrequencyResource";
import { BitcoinProvider } from "@/components/Wrapper/BitcoinProvider";

export default function ResourcesDrawer({ isOpen, onClose }: any) {
  return (
    <Stack w={"full"}>
      <FrequencyResource />

      <Text
        fontSize={"sm"}
        fontWeight={"medium"}
        onClick={async () => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        Refresh
      </Text>
    </Stack>
  );
}
