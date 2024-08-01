import useSocket from "@/hooks/useSocket";
import { useTelegram } from "@/lib/TelegramProvider";
import { VStack } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
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
  resourcesSocket: any;
  isSocketConnected: boolean;
}

const BitcoinContext = createContext<BitcoinContextType>({
  bitcoinValue: 0,
  resetBitcoinValue: () => {},
  offlineEarnings: 0,
  resources: {},
  resetResources: () => {},
  resourcesSocket: [],
  isSocketConnected: false,
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
  const [resourcesSocket, setResourcesSocket] = useState<any>([]);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  const [resourceLevels, setResourceLevels] = useState<ResourceRates>({});

  const { emit, on } = useSocket();
  const { user } = useTelegram();

  const queryClient = useQueryClient();
  const queryKey = [`infoUser`];
  const data = queryClient.getQueryData<QueryData>(queryKey);

  const referredUsersLength = data?.referred_users.length || 0;
  const referralBonus = 1 + referredUsersLength * 0.02;

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
      // Calculate new bitcoin value based on rate
      setBitcoinValue(() => {
        const level = data?.resources ? data.resources[0]?.level_resource : 1;
        const growthRate = 0.2;
        const rate = 0.00002315 * Math.pow(1 + growthRate, level - 1);

        const dataBtc = {
          telegram_id: process.env.NEXT_PUBLIC_API_ID_TELEGRAM,
          mining_value: rate,
        };

        // emit("update_miningbtc", dataBtc);
        // on("mining_update_response", (response: any) => {
        //   setBitcoinValue(response.value);
        // });
        return rate;
      });

      // Calculate new resources value based on rate
      setResources(() => {
        const updatedResources: ResourceRates = {};
        for (const key in initialResourceRates) {
          const level = resourceLevels[key] || 1;
          const growthRate = 0.1;
          const rate =
            initialResourceRates[key] *
            Math.pow(1 + growthRate, level - 1) *
            referralBonus;
          updatedResources[key] = rate;
        }

        // Emit data via socket
        const miningValues = Object.fromEntries(
          Object.entries(updatedResources).map(([key, value]) => [key, value])
        );

        const data = {
          telegram_id:
            Number(process.env.NEXT_PUBLIC_API_ID_TELEGRAM) || Number(user?.id),
          mining_values: miningValues,
        };

        emit("update_mining", data);
        on("update_response", (response: any) => {
          setResourcesSocket(response);
          setIsSocketConnected(true);
        });

        return updatedResources;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resourceLevels, data, referralBonus, emit]);

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
        resourcesSocket,
        bitcoinValue,
        resetBitcoinValue,
        offlineEarnings,
        resources,
        resetResources,
        isSocketConnected,
      }}
    >
      {children}
    </BitcoinContext.Provider>
  );
};
