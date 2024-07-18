import { Button, Stack, Text } from "@chakra-ui/react";
import FrequencyResource from "./FrequencyResource";
import ListResources from "./ListResources";

export default function ResourcesDrawer({ isOpen, onClose }: any) {
  return (
    <Stack w={"full"}>
      <FrequencyResource />
      <ListResources />
      <Button
        mb={4}
        onClick={async () => {
          localStorage.clear();
          window.location.reload();
        }}
      >
        <Text fontSize={"sm"} fontWeight={"medium"}>
          Refresh
        </Text>
      </Button>
    </Stack>
  );
}
