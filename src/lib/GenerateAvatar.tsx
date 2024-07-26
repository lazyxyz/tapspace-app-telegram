import { AvatarProps, Avatar as ChakraAvatar } from "@chakra-ui/react";
import { glass } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";

export default function GenerateAvatar({
  jazzicon,
  ...rest
}: AvatarProps & {
  jazzicon: {
    diameter: number;
    seed: string;
  };
}) {
  let avatarSvg;

  avatarSvg = createAvatar(glass, {
    seed: jazzicon.seed,
  });

  const iconElement = (
    <img
      src={`data:image/svg+xml;utf8,${encodeURIComponent(String(avatarSvg))}`}
    />
  );

  return (
    <ChakraAvatar
      {...rest}
      bg={"transparent"}
      icon={iconElement}
      alt={"Avatar"}
    />
  );
}
