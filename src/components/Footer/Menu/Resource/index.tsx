import { Button, Stack, Text } from "@chakra-ui/react";
import FrequencyResource from "./FrequencyResource";
import ListResources from "./ListResources";

export default function ResourcesDrawer({ isOpen, onClose }: any) {
  return (
    <Stack w={"full"}>
      <FrequencyResource />
      <ListResources />
    </Stack>
  );
}
