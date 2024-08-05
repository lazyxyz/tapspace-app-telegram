import { useMemo } from "react";

interface ResourceRequirements {
  "TS-BTC": number;
  Steel: number;
  Aluminum: number;
  Copper: number;
  Fiber: number;
  Titanium: number;
}

const baseValues: Record<string, number> = {
  Steel: 4000,
  Aluminum: 2500,
  Copper: 1500,
  Fiber: 1000,
  Titanium: 500,
};

const baseTsBtc = 1;

const triangularNumber = (n: number): number => {
  return (n * (n + 1)) / 2;
};

const useSpaceshipRequirements = (
  level: number
): ResourceRequirements | null => {
  const miningRequirements = useMemo(() => {
    if (level < 2) return null;

    const Tn = triangularNumber(level);

    return {
      "TS-BTC": baseTsBtc * Tn,
      Steel: baseValues.Steel * Tn,
      Aluminum: baseValues.Aluminum * Tn,
      Copper: baseValues.Copper * Tn,
      Fiber: baseValues.Fiber * Tn,
      Titanium: baseValues.Titanium * Tn,
    };
  }, [level]);

  return miningRequirements;
};

export default useSpaceshipRequirements;
