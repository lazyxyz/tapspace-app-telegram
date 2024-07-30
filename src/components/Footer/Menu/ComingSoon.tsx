import { Center, Image, Stack, Text } from "@chakra-ui/react";

export default function ComingSoon({ tab }: { tab: string }) {
  const listContent: any = {
    Spaceship:
      "The ultimate hub for all your warship needs! Whether you're a seasoned captain or a new recruit, our features offer everything you need to dominate the space and planets.",
    Universe:
      "Brace yourself for an epic adventure where every battle and conquest unlocks new discoveries. Stay tuned for more details!",
    Battles:
      "Prepare your resources and warships, hone your skills, and get ready to conquer the universe. Stay tuned for more details!",
  };

  const listImage: any = {
    Spaceship: "/assets/menu/spaceship.png",
    Universe: "/assets/menu/universe.png",
    Battles: "/assets/menu/Battles.png",
  };
  return (
    <Stack h={"full"} bg={"rgba(0, 0, 0, 0.8)"} backdropFilter={"blur(4.5px)"}>
      <Center h={"full"} textAlign={"center"}>
        <Stack align={"center"} px={6} pb={24}>
          <Image src={listImage[tab]} w={"48px"} h={"48px"} />
          <Text fontSize={"2xl"} fontWeight={800} color={"white"}>
            Coming soon
          </Text>
          <Text textColor={"#BBC1DE"}>{listContent[tab]}</Text>
        </Stack>
      </Center>
    </Stack>
  );
}
