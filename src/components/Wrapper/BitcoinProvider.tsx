import useSocket from "@/hooks/useSocket";
import { useTelegram } from "@/lib/TelegramProvider";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  BitcoinContextType,
  QueryData,
  Resource,
  ResourceRates,
} from "../../../types/typeResources";

const initialResourceRates: ResourceRates = {
  Steel: 0.16,
  Aluminum: 0.1,
  Copper: 0.06,
  Fiber: 0.04,
  Titanium: 0.02,
};

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
  const [resources, setResources] = useState<ResourceRates>({});
  const [resourcesSocket, setResourcesSocket] = useState<any>([]);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);
  const [resourceLevels, setResourceLevels] = useState<ResourceRates>({});

  const { emit, on } = useSocket();
  const { user } = useTelegram();

  const queryClient = useQueryClient();
  const queryKey = [`infoUser`];
  const data: any = queryClient.getQueryData<QueryData>(queryKey);

  const referredUsersLength = data?.referred_users.length || 0;
  const referralBonus = 1 + referredUsersLength * 0.02;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        const lastVisitTime = Date.now().toString();
        localStorage.setItem("lastVisitTime", lastVisitTime);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const savedValue = localStorage.getItem("bitcoinValue");
    const lastClaimTime = localStorage.getItem("lastVisitTime");
    const savedResources = localStorage.getItem("resources");

    if (savedValue) {
      setBitcoinValue(parseFloat(savedValue));
    }

    if (savedResources) {
      setResources(JSON.parse(savedResources));
    } else {
      const initialResources: ResourceRates = {};
      for (const key in initialResourceRates) {
        initialResources[key] = 0;
      }
      setResources(initialResources);
    }

    if (lastClaimTime) {
      const currentTime = Date.now();
      const lastClaimTimeParsed =
        parseInt(lastClaimTime, 10) * (lastClaimTime.length === 10 ? 1000 : 1);
      const timeDifference = (currentTime - lastClaimTimeParsed) / 1000;

      const passiveBtc = data?.frequency_miining;

      const offlineBitcoinEarnings = timeDifference * passiveBtc;
      setOfflineEarnings(parseFloat(offlineBitcoinEarnings.toFixed(8)));

      const listData = data?.resources.reduce((acc: any, item: any) => {
        acc[item.resource_name] = item.passive * timeDifference;
        return acc;
      }, {});

      setResources(listData);
    }
  }, [referralBonus, resourceLevels, data?.resources]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updateBitcoinValue = async () => {
        const dataBtc = {
          telegram_id:
            Number(user?.id) || process.env.NEXT_PUBLIC_API_ID_TELEGRAM,
          mining_value: data?.frequency_miining,
        };

        emit("update_miningbtc", dataBtc);
        on("mining_update_response", (response: any) => {
          setBitcoinValue(response.value);
        });
      };

      const updateResources = async () => {
        const listData = data?.resources.reduce((acc: any, item: any) => {
          acc[item.resource_name] = item.passive;
          return acc;
        }, {});

        const data2 = {
          telegram_id:
            Number(user?.id) || Number(process.env.NEXT_PUBLIC_API_ID_TELEGRAM),
          mining_values: listData,
        };

        emit("update_mining", data2);
        on("update_response", (response: any) => {
          setResourcesSocket(response);
          setIsSocketConnected(true);
          localStorage.setItem("resources", JSON.stringify(response));
        });
      };

      updateBitcoinValue();
      updateResources();
    }, 1000);

    return () => clearInterval(interval);
  }, [resourceLevels, data, referralBonus, emit, on, user?.id]);

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
