import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import systemService from "@/services/system.service";

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
  resources: any;
  resetResources: () => void;
}>({
  bitcoinValue: 0,
  resetBitcoinValue: () => {},
  resources: {},
  resetResources: () => {},
});

export const useBitcoin = () => useContext(BitcoinContext);

const convertLevelToNumber = (levelString: string): number => {
  const match = levelString.match(/lv(\d+)/);
  return match ? parseInt(match[1], 10) : 0; // Default to 0 if no match found
};

export const BitcoinProvider = ({ children }: any) => {
  const [bitcoinValue, setBitcoinValue] = useState(0);
  const [resources, setResources] = useState(() => {
    const initialResources: any = {};
    for (const key in initialResourceRates) {
      initialResources[key] = 0;
    }
    return initialResources;
  });
  const [botLevel, setBotLevel] = useState(0);

  const { data, error, isLoading } = useQuery({
    queryKey: ["infoUser"],
    queryFn: async () => {
      const rs = await systemService.getUserInfo({
        telegram_id: "1341419583",
        planets: "Earth",
      });
      return rs.data[0];
    },
    staleTime: Infinity,
    enabled: true,
  });

  useEffect(() => {
    if (data) {
      const botLevelNumber = convertLevelToNumber(data.bot_level);
      setBotLevel(botLevelNumber);
    }
  }, [data]);

  useEffect(() => {
    if (botLevel > 0) {
      const interval = setInterval(() => {
        setBitcoinValue((prevValue) => {
          const miningRate = 0.00002315 * Math.pow(1.2, botLevel - 1);
          const updatedValue = prevValue + miningRate;
          localStorage.setItem("bitcoinValue", updatedValue.toString());
          return updatedValue;
        });

        setResources((prevResources: any) => {
          const updatedResources: any = {};
          for (const key in initialResourceRates) {
            const resourceRate =
              initialResourceRates[key] * Math.pow(1.1, botLevel - 1);
            updatedResources[key] = prevResources[key] + resourceRate;
          }
          localStorage.setItem("resources", JSON.stringify(updatedResources));
          return updatedResources;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [botLevel]);

  const resetBitcoinValue = () => {
    setBitcoinValue(0);
    localStorage.setItem("bitcoinValue", "0");
    localStorage.setItem("lastClaimTime", Date.now().toString());
  };

  const resetResources = () => {
    const initialResources: any = {};
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
        resources,
        resetResources,
      }}
    >
      {children}
    </BitcoinContext.Provider>
  );
};
