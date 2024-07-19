import React, { createContext, useContext, useEffect, useState } from "react";

const resourceRates = {
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
  resources: any;
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
  const [resources, setResources] = useState(() => {
    const initialResources: any = {};
    for (const key in resourceRates) {
      initialResources[key] = 0;
    }
    return initialResources;
  });

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
        const updatedResources: any = {};
        for (const key in resourceRates) {
          updatedResources[key] =
            //@ts-ignore
            timeDifference * resourceRates[key] +
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

      setResources((prevResources: any) => {
        const updatedResources: any = {};
        for (const key in resourceRates) {
          //@ts-ignore
          updatedResources[key] = prevResources[key] + resourceRates[key];
        }
        localStorage.setItem("resources", JSON.stringify(updatedResources));
        return updatedResources;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const resetBitcoinValue = () => {
    setBitcoinValue(0);
    localStorage.setItem("bitcoinValue", "0");
    localStorage.setItem("lastClaimTime", Date.now().toString());
  };

  const resetResources = () => {
    const initialResources: any = {};
    for (const key in resourceRates) {
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
