import { useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";

const initialResourceRates = {
  Steel: 0.16,
  Aluminum: 0.1,
  Copper: 0.06,
  Fiber: 0.04,
  Titanium: 0.02,
};

const BitcoinContext = createContext<{
  bitcoinValue: number;
  resetBitcoinValue: () => void;
  offlineEarnings: number;
  resources: { [key: string]: number };
  resetResources: () => void;
}>({
  bitcoinValue: 0,
  resetBitcoinValue: () => {},
  offlineEarnings: 0,
  resources: {},
  resetResources: () => {},
});

export const useBitcoin = () => useContext(BitcoinContext);

export const BitcoinProvider = ({ children }: any) => {
  const [bitcoinValue, setBitcoinValue] = useState(0);
  const [offlineEarnings, setOfflineEarnings] = useState(0);
  const [resources, setResources] = useState<{ [key: string]: number }>(() => {
    const initialResources: { [key: string]: number } = {};
    for (const key in initialResourceRates) {
      initialResources[key] = 0;
    }
    return initialResources;
  });
  const [resourceLevels, setResourceLevels] = useState<{
    [key: string]: number;
  }>({});

  const queryClient = useQueryClient();
  const queryKey = [`infoUser`];
  const data = queryClient.getQueryData<{
    btc_value: number;
    resources: { [key: string]: { level_resource: string } };
  }>(queryKey);

  useEffect(() => {
    if (data) {
      // Extract levels for resources based on resource name
      const levels: { [key: string]: number } = {};
      //@ts-ignore
      data.resources?.map((resource: any, index: number) => {
        const levelString = resource.level_resource || "lv1";

        levels[resource.resource_name] = convertLevelToNumber(levelString);
      });
      setResourceLevels(levels);
    }
  }, [data]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedValue = localStorage.getItem("bitcoinValue");
      const lastClaimTime = localStorage.getItem("lastClaimTime");
      const savedResources = localStorage.getItem("resources");

      if (savedValue) {
        setBitcoinValue(parseFloat(savedValue));
      }

      if (savedResources) {
        setResources(JSON.parse(savedResources));
      }

      if (lastClaimTime) {
        const currentTime = Date.now();
        const timeDifference =
          (currentTime - parseInt(lastClaimTime, 10)) / 1000;
        const offlineBitcoinEarnings = timeDifference * 0.00002315;
        setOfflineEarnings(parseFloat(offlineBitcoinEarnings.toFixed(4)));

        // Calculate offline earnings for each resource
        const updatedResources: { [key: string]: number } = {};
        for (const key in initialResourceRates) {
          updatedResources[key] =
            //@ts-ignore
            timeDifference * initialResourceRates[key] +
            (savedResources ? JSON.parse(savedResources)[key] : 0);
        }
        setResources(updatedResources);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBitcoinValue((prevValue) => {
        const updatedValue = prevValue + 0.00002315;
        localStorage.setItem("bitcoinValue", updatedValue.toString());
        return updatedValue;
      });

      setResources((prevResources) => {
        const updatedResources: { [key: string]: number } = {};
        for (const key in initialResourceRates) {
          const level = resourceLevels[key] || 1; // Default to level 1 if not found
          const growthRate = 0.1; // 10% growth
          const rate =
            //@ts-ignore
            initialResourceRates[key] * Math.pow(1 + growthRate, level - 1);
          updatedResources[key] = (prevResources[key] || 0) + rate;
        }
        localStorage.setItem("resources", JSON.stringify(updatedResources));
        return updatedResources;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resourceLevels]);

  const convertLevelToNumber = (levelString: string): number => {
    const match = levelString.match(/lv(\d+)/);
    return match ? parseInt(match[1], 10) : 1; // Default to level 1 if no match found
  };

  const resetBitcoinValue = () => {
    setBitcoinValue(0);
    localStorage.setItem("bitcoinValue", "0");
    localStorage.setItem("lastClaimTime", Date.now().toString());
  };

  const resetResources = () => {
    const initialResources: { [key: string]: number } = {};
    for (const key in initialResourceRates) {
      initialResources[key] = 0;
    }
    setResources(initialResources);
    localStorage.setItem("resources", JSON.stringify(initialResources));
  };

  return (
    <BitcoinContext.Provider
      value={{
        bitcoinValue,
        resetBitcoinValue,
        offlineEarnings,
        resources,
        resetResources,
      }}
    >
      {children}
    </BitcoinContext.Provider>
  );
};
