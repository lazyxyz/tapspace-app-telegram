import { Button, Stack, Text } from "@chakra-ui/react";
import FrequencyResource from "./FrequencyResource";
import ListResources from "./ListResources";

export default function ResourcesDrawer({ isOpen, onClose }: any) {
  return (
    <Stack w={"full"} spacing={0} px={3} pb={24}>
      <FrequencyResource />
      <ListResources />
    </Stack>
  );
}
