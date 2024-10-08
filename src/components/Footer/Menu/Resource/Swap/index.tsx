"use client";

import { IconBitcoin } from "@/components/Icons";
import { ImageWithFallback } from "@/components/ImageFallback";
import PopupSuccessSwap from "@/components/Popup/PopupSuccessSwap";
import SelectResources from "@/components/Popup/SelectResources";
import { queryClient } from "@/components/Wrapper/QueryClientProvider";
import { useTelegram } from "@/lib/TelegramProvider";
import systemService from "@/services/system.service";
import { imageResources, numeralFormat } from "@/utils/utils";
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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { MdOutlineArrowBackIos } from "react-icons/md";

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

export default function Swap({ onClose: onCloseTab }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalType, setModalType] = useState<"resource1" | "resource2" | null>(
    null
  );

  const { user } = useTelegram();
  const { data }: any = useQuery({
    queryKey: ["infoUser"],
  });

  const [selectedResource1, setSelectedResource1] = useState<Resource | null>(
    null
  );
  const [selectedResource2, setSelectedResource2] = useState<Resource | null>(
    null
  );
  const [inputValue, setInputValue] = useState<number | string>("");

  //@ts-ignore
  const resourceBalances = data?.resources.reduce(
    (acc: { [key: string]: number }, resource: Resource) => {
      acc[resource.resource_name] = resource.mining;
      return acc;
    },
    {}
  );

  const handleSelect = (resource: Resource) => {
    if (modalType === "resource1") {
      setSelectedResource1(resource);
    } else if (modalType === "resource2") {
      setSelectedResource2(resource);
    }
    setModalType(null);
    onClose();
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
        telegram_id:
          user?.id.toString() || process.env.NEXT_PUBLIC_API_ID_TELEGRAM,
        from_resource: selectedResource1.resource_name,
        to_resource: selectedResource2.resource_name,
        value: Number(inputValue),
      });

      if (swap) {
        onOpenSuccess();
        setIsloading(false);
        queryClient.refetchQueries({ queryKey: ["infoUser"] });
      }
    }
  };

  return (
    <VStack
      w={"full"}
      h={"full"}
      spacing={0}
      pt={20}
      bgGradient={"linear(to-b, #333649 0%, #1F212E 100%)"}
      align={"start"}
    >
      <HStack
        spacing={1}
        px={4}
        align={"center"}
        textColor={"#D5FE4B"}
        onClick={onCloseTab}
        cursor={"pointer"}
      >
        <MdOutlineArrowBackIos />
        <Text fontSize={"lg"} fontWeight={800} variant={"unstyled"}>
          Swap
        </Text>
      </HStack>

      <>
        <VStack w={"full"} px={3}>
          <ImageWithFallback src="/assets/bannerSwap.svg" w={"full"} py={3} /> 
          {data && data?.resources && (
            <VStack position={"relative"} w={"full"}>
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
                    <Text>
                      Balance:{" "}
                      {numeralFormat(
                        resourceBalances[selectedResource1?.resource_name || ""]
                      ) ?? "0"}
                    </Text>
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
                bottom="30%"
                left="50%"
                transform="translate(-50%, -50%)"
                zIndex={1}
                px={3}
                py={5}
                _hover={{
                  bgGradient: "linear(to-b, #333649 0%, #1F212E 100%)",
                }}
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
                      ? numeralFormat(
                          calculateConvertedMining(
                            selectedResource1,
                            selectedResource2
                          )
                        )
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
                  <Text>
                    Balance:{" "}
                    {numeralFormat(Number(selectedResource2?.mining || 0))}
                  </Text>
                </Stack>
              </HStack>

              <SelectResources
                isOpen={isOpen}
                //@ts-ignore
                resources={data?.resources || []}
                onClose={onClose}
                onSelect={handleSelect}
              />
            </VStack>
          )}

          {selectedResource1 && selectedResource2 && (
            <Stack w={"full"}>
              <HStack bg={"#333649"} p={3} rounded={"xl"} fontSize={"sm"}>
                <Text fontWeight={"800"} color={"#DADFF4"}>
                  1 {selectedResource1.resource_name} ={" "}
                  {getConversionRate(
                    selectedResource1.resource_name,
                    selectedResource2.resource_name
                  )}{" "}
                  {selectedResource2.resource_name}
                </Text>
              </HStack>
              <HStack justifyContent={"space-between"} w={"full"} pt={3}>
                <Text fontSize={"sm"} textColor={"#BBC1DE"}>
                  Swap fee
                </Text>
                <HStack textColor={"white"} spacing={3} fontWeight={"800"}>
                  <HStack spacing={1}>
                    <IconBitcoin w={"20px"} />
                    <Text>0.1</Text>
                  </HStack>

                  <HStack spacing={1}>
                    <Image
                      src={
                        imageResources[selectedResource2?.resource_name || ""]
                      }
                      w={"20px"}
                    />
                    <Text>
                      {numeralFormat(
                        Number(
                          calculateConvertedMining(
                            selectedResource1,
                            selectedResource2
                          )
                        ) * 0.1
                      )}
                    </Text>
                  </HStack>
                </HStack>
              </HStack>
            </Stack>
          )}

          <Button
            w={"full"}
            rounded={"xl"}
            borderBottomWidth={3}
            py={5}
            isDisabled={Number(inputValue) > Number(selectedResource1?.mining)}
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
      </>
    </VStack>
  );
}
