import { useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface ResourceRates {
  [key: string]: number;
}

const initialResourceRates: ResourceRates = {
  Steel: 0.16,
  Aluminum: 0.1,
  Copper: 0.06,
  Fiber: 0.04,
  Titanium: 0.02,
};

interface Resource {
  resource_name: string;
  level_resource: number;
}

interface QueryData {
  btc_value: number;
  resources: Resource[];
  referred_users: string[];
}

interface BitcoinContextType {
  bitcoinValue: number;
  resetBitcoinValue: () => void;
  offlineEarnings: number;
  resources: ResourceRates;
  resetResources: () => void;
}

const BitcoinContext = createContext<BitcoinContextType>({
  bitcoinValue: 0,
  resetBitcoinValue: () => {},
  offlineEarnings: 0,
  resources: {},
  resetResources: () => {},
});

export const useBitcoin = () => useContext(BitcoinContext);

interface BitcoinProviderProps {
  children: ReactNode;
}

export const BitcoinProvider: React.FC<BitcoinProviderProps> = ({
  children,
}) => {
  const [bitcoinValue, setBitcoinValue] = useState<number>(0);
  const [offlineEarnings, setOfflineEarnings] = useState<number>(0);
  const [resources, setResources] = useState<ResourceRates>(() => {
    const initialResources: ResourceRates = {};
    for (const key in initialResourceRates) {
      initialResources[key] = 0;
    }
    return initialResources;
  });
  const [resourceLevels, setResourceLevels] = useState<ResourceRates>({});

  const queryClient = useQueryClient();
  const queryKey = [`infoUser`];
  const data = queryClient.getQueryData<QueryData>(queryKey);

  const referredUsersLength = data?.referred_users.length || 0;
  const referralBonus = 1 + referredUsersLength * 0.02; // Tỷ lệ gia tăng dựa trên referred_users.length

  useEffect(() => {
    if (data) {
      const levels: ResourceRates = {};
      data.resources.forEach((resource) => {
        levels[resource.resource_name] = resource.level_resource || 1;
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

        const updatedResources: ResourceRates = {};
        for (const key in initialResourceRates) {
          updatedResources[key] =
            timeDifference * initialResourceRates[key] * referralBonus +
            (savedResources ? JSON.parse(savedResources)[key] : 0);
        }
        setResources(updatedResources);
      }
    }
  }, [referralBonus]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBitcoinValue((prevValue) => {
        const level = data?.resources ? data.resources[0]?.level_resource : 1;
        const growthRate = 0.2;
        const rate = 0.00002315 * Math.pow(1 + growthRate, level - 1);
        const updatedValue = prevValue + rate;
        localStorage.setItem("bitcoinValue", updatedValue.toString());
        return updatedValue;
      });

      setResources((prevResources) => {
        const updatedResources: ResourceRates = {};
        for (const key in initialResourceRates) {
          const level = resourceLevels[key] || 1;
          const growthRate = 0.1;
          const rate =
            initialResourceRates[key] *
            Math.pow(1 + growthRate, level - 1) *
            referralBonus;
          updatedResources[key] = (prevResources[key] || 0) + rate;
        }
        localStorage.setItem("resources", JSON.stringify(updatedResources));
        return updatedResources;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resourceLevels, data, referralBonus]);

  const resetBitcoinValue = () => {
    setBitcoinValue(0);
    localStorage.setItem("bitcoinValue", "0");
    localStorage.setItem("lastClaimTime", Date.now().toString());
  };

  const resetResources = () => {
    const initialResources: ResourceRates = {};
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
