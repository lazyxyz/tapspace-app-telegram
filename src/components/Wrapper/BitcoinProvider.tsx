import React, { createContext, useContext, useEffect, useState } from "react";

const BitcoinContext = createContext(0);

export const useBitcoin = () => useContext(BitcoinContext);

export const BitcoinProvider = ({ children }: any) => {
  const [bitcoinValue, setBitcoinValue] = useState(() => {
    if (typeof window !== "undefined") {
      const savedValue = localStorage.getItem("bitcoinValue");
      return savedValue ? parseFloat(savedValue) : 0;
    }
    return 0;
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBitcoinValue((prevValue) => {
        const updatedValue = prevValue + 0.15;
        localStorage.setItem("bitcoinValue", updatedValue.toString());
        return updatedValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BitcoinContext.Provider value={bitcoinValue}>
      {children}
    </BitcoinContext.Provider>
  );
};
