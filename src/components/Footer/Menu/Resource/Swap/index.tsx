import { IconBitcoin } from "@/components/Icons";
import PopupSuccessSwap from "@/components/Popup/PopupSuccessSwap";
import SelectResources from "@/components/Popup/SelectResources";
import systemService from "@/services/system.service";
import { imageResources } from "@/utils/utils";
import {
  Button,
  HStack,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";

interface Resource {
  resource_name: string;
  mining: number;
}

const conversionRates: { [key: string]: { [key: string]: number } } = {
  Steel: { Aluminum: 0.625, Copper: 0.375, Fiber: 0.25, Titanium: 0.125 },
  Aluminum: { Steel: 1.6, Copper: 0.6, Fiber: 0.4, Titanium: 0.2 },
  Copper: { Steel: 2.67, Aluminum: 1.67, Fiber: 0.67, Titanium: 0.3 },
  Fiber: { Steel: 4, Aluminum: 2.5, Copper: 1.5, Titanium: 0.5 },
  Titanium: { Steel: 8, Aluminum: 5, Copper: 3, Fiber: 2 },
};

export default function Swap() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState<"resource1" | "resource2" | null>(
    null
  );
  const queryClient = useQueryClient();
  const queryKey = [`infoUser`];
  const data = queryClient.getQueryData<{ resources: Resource[] }>(queryKey);

  const [selectedResource1, setSelectedResource1] = useState<Resource | null>(
    null
  );
  const [selectedResource2, setSelectedResource2] = useState<Resource | null>(
    null
  );
  const [inputValue, setInputValue] = useState<number | string>("");

  const handleSelect = (resource: Resource) => {
    if (modalType === "resource1") {
      setSelectedResource1(resource);
    } else if (modalType === "resource2") {
      setSelectedResource2(resource);
    }
    setModalType(null); // Close the modal after selection
    onClose(); // Close the modal
  };

  const handleOpenSelectModal = (type: "resource1" | "resource2") => {
    setModalType(type);
    onOpen();
  };

  const handleSwap = () => {
    setSelectedResource1((prev) => (prev ? selectedResource2 : null));
    setSelectedResource2((prev) => (prev ? selectedResource1 : null));
  };

  const handleMax = () => {
    if (selectedResource1) {
      setInputValue(selectedResource1.mining);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!isNaN(Number(value))) {
      setInputValue(value);
    }
  };

  const getConversionRate = (
    fromResource: string,
    toResource: string
  ): number => {
    return conversionRates[fromResource]?.[toResource] ?? 0;
  };

  const calculateConvertedMining = (
    resource1: Resource | null,
    resource2: Resource | null
  ) => {
    if (resource1 && resource2) {
      const rate = getConversionRate(
        resource1.resource_name,
        resource2.resource_name
      );
      const amountToConvert = Number(inputValue) || 0;
      return amountToConvert * rate;
    }
    return 0;
  };

  const [isLoading, setIsloading] = useState(false);

  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();

  const onSwap = async () => {
    setIsloading(true);
    if (selectedResource1 && selectedResource2 && inputValue) {
      const swap = await systemService.swapResource({
        telegram_id: "6298608837",
        from_resource: selectedResource1.resource_name,
        to_resource: selectedResource2.resource_name,
        value: Number(inputValue),
      });

      if (swap) {
        onOpenSuccess();

        setIsloading(false);
        queryClient.invalidateQueries({
          queryKey: ["infoUser"],
          exact: true,
        });

        // if (!isOpenSuccess) {
        //   setSelectedResource1(null);
        //   setSelectedResource2(null);
        // }
      }
    }
  };
  return (
    <VStack w={"full"}>
      <VStack position={"relative"} w={"full"}>
        <Image src="/assets/bannerSwap.png" w={"full"} />

        {/* Resource Selection 1 */}
        <HStack
          bg={"#13161F"}
          w={"full"}
          borderWidth={1}
          borderBottomWidth={3}
          borderColor={"#3F435A"}
          p={3}
          rounded={"xl"}
          justifyContent={"space-between"}
        >
          <Stack>
            <Text>Use</Text>
            <HStack>
              <Input
                fontSize={"xl"}
                textColor={"white"}
                fontWeight={"800"}
                border={0}
                alignContent={"start"}
                textAlign={"start"}
                value={inputValue}
                px={0}
                focusBorderColor="transparent"
                borderColor={"none"}
                outline={"none"}
                onChange={handleInputChange}
                placeholder="Enter amount"
                size="sm"
                width="80px"
                color="white"
              />
            </HStack>
          </Stack>

          <Stack align={"end"}>
            <HStack
              py={2}
              px={4}
              textColor={"white"}
              borderWidth={1}
              rounded={"3xl"}
              justifyContent={"space-between"}
              bg={"rgba(255, 255, 255, 0.05)"}
              fontSize={"sm"}
              w={"fit-content"}
              onClick={() => handleOpenSelectModal("resource1")}
            >
              {selectedResource1 && (
                <Image
                  //@ts-ignore
                  src={imageResources[selectedResource1.resource_name]}
                  w={"20px"}
                />
              )}
              <Text>
                {selectedResource1
                  ? selectedResource1.resource_name
                  : "Select Resource"}
              </Text>
              <IoChevronDown />
            </HStack>
            <HStack>
              <Text>Balance: {selectedResource1?.mining ?? "0"}</Text>
              <Button
                variant={"padding"}
                px={0}
                fontWeight={"800"}
                textColor={"#D5FE4B"}
                size="sm"
                onClick={handleMax}
              >
                Max
              </Button>
            </HStack>
          </Stack>
        </HStack>

        {/* Swap Button */}
        <Button
          variant={"solid"}
          onClick={handleSwap}
          position="absolute"
          bottom="20%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={1}
          px={3}
          py={5}
          _hover={{ bgGradient: "linear(to-b, #333649 0%, #1F212E 100%)" }}
          borderWidth={2}
          borderRadius="2xl"
          borderColor={"#3F435A"}
          bgGradient="linear(to-b, #333649 0%, #1F212E 100%)"
          color="#D5FE4B"
          fontSize={"xl"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M17 20V4M17 4L13 8M17 4L21 8M7 4V20M7 20L3 16M7 20L11 16"
              stroke="#D5FE4B"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Button>

        {/* Resource Selection 2 */}
        <HStack
          bg={"#13161F"}
          w={"full"}
          borderWidth={1}
          borderBottomWidth={3}
          borderColor={"#3F435A"}
          p={3}
          rounded={"xl"}
          justifyContent={"space-between"}
        >
          <Stack>
            <Text>For</Text>
            <Text fontSize={"xl"} textColor={"white"} fontWeight={"800"}>
              {selectedResource2
                ? calculateConvertedMining(
                    selectedResource1,
                    selectedResource2
                  ).toFixed(2)
                : "0"}
            </Text>
          </Stack>

          <Stack align={"end"}>
            <HStack
              py={2}
              px={4}
              textColor={"white"}
              borderWidth={1}
              rounded={"3xl"}
              justifyContent={"space-between"}
              bg={"rgba(255, 255, 255, 0.05)"}
              fontSize={"sm"}
              w={"fit-content"}
              onClick={() => handleOpenSelectModal("resource2")}
            >
              {selectedResource2 && (
                <Image
                  //@ts-ignore
                  src={imageResources[selectedResource2.resource_name]}
                  w={"20px"}
                />
              )}
              <Text>
                {selectedResource2
                  ? selectedResource2.resource_name
                  : "Select Resource"}
              </Text>
              <IoChevronDown />
            </HStack>
            <Text>Balance: {selectedResource2?.mining ?? "0"}</Text>
          </Stack>
        </HStack>

        <SelectResources
          isOpen={isOpen}
          resources={data?.resources || []}
          onClose={onClose}
          onSelect={handleSelect}
        />
      </VStack>

      <HStack justifyContent={"space-between"} w={"full"}>
        <Text>Transaction Fee</Text>
        <HStack textColor={"white"} fontWeight={"800"}>
          <IconBitcoin w={"20px"} />
          <Text>1 + 10% Output</Text>
        </HStack>
      </HStack>

      <Button
        w={"full"}
        rounded={"xl"}
        borderBottomWidth={3}
        py={5}
        variant={"hover"}
        fontWeight={800}
        borderColor={"#0DD63E"}
        bgGradient={"linear(to-b, #0DD63E 0%, #00A65B 100%)"}
        onClick={onSwap}
      >
        {isLoading ? <Spinner size={"sm"} /> : " Swap now"}
      </Button>

      <PopupSuccessSwap
        isOpen={isOpenSuccess}
        onClose={onCloseSuccess}
        from_resource={selectedResource1?.resource_name}
        to_resource={selectedResource2?.resource_name}
        value={Number(inputValue)}
        result={calculateConvertedMining(
          selectedResource1,
          selectedResource2
        ).toFixed(2)}
      />
    </VStack>
  );
}
