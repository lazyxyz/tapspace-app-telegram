import { imageResources, numeralFormat } from "@/utils/utils";
import {
  Box,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IconClose } from "../Icons";

interface Resource {
  resource_name: string;
  mining: number;
}

interface SelectResourcesProps {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
  onSelect: (resource: Resource) => void;
}

export default function SelectResources({
  isOpen,
  onClose,
  resources,
  onSelect,
}: SelectResourcesProps) {
  return (
    <Box>
      <Modal
        isOpen={isOpen}
        closeOnOverlayClick={false}
        isCentered
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent
          borderWidth={1}
          borderBottomWidth={3}
          borderColor={"#3F435A"}
          mx={4}
          bg={"#1F212E"}
          rounded={"xl"}
        >
          <ModalHeader>Select Resources</ModalHeader>
          <Box
            position={"absolute"}
            right={3}
            top={3}
            zIndex={99}
            onClick={onClose}
          >
            <Icon as={IconClose} right={0} position={"absolute"} w={"full"} />
          </Box>
          <ModalBody>
            <VStack
              py={3}
              spacing={5}
              w={"full"}
              rounded={"xl"}
              position={"relative"}
              align={"start"}
            >
              {resources.map((item) => (
                <HStack
                  key={item.resource_name}
                  align={"center"}
                  onClick={() => onSelect(item)}
                >
                  <Box bg={"rgba(255, 255, 255, 0.10)"} p={2} rounded={"xl"}>
                    <Image
                      src={imageResources[item.resource_name]}
                      w={"22px"}
                    />
                  </Box>
                  <Stack spacing={0} fontSize={"sm"} textColor={"white"}>
                    <Text fontWeight={800}>{item.resource_name}</Text>
                    <Text fontWeight={700}>
                      <Box fontWeight={600} as="span" textColor={"#BBC1DE"}>
                        Balance: {""}
                      </Box>
                      {numeralFormat(item.mining)}
                    </Text>
                  </Stack>
                </HStack>
              ))}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
