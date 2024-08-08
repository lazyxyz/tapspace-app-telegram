import { useMemo } from "react";

const baseValues = {
  Steel: 1440,
  Aluminum: 900,
  Copper: 540,
  Fiber: 360,
  Titanium: 180,
};

const baseBTC = 0.1;

const fibonacci = (n: number) => {
  let fibSequence = [0, 1];
  while (fibSequence.length <= n) {
    fibSequence.push(
      fibSequence[fibSequence.length - 1] + fibSequence[fibSequence.length - 2]
    );
  }
  return fibSequence;
};

const calculateBTCSequence = (n: number) => {
  let btcSequence = [baseBTC];
  for (let i = 1; i < n; i++) {
    btcSequence.push(btcSequence[btcSequence.length - 1] * 1.5);
  }
  return btcSequence;
};

const useResourceCapacity = (numLevel: number) => {
  const miningRequirements = useMemo(() => {
    let requirements = {} as any;
    let fibSequence = fibonacci(numLevel + 1);
    let btcSequence = calculateBTCSequence(numLevel);

    for (let lv = 1; lv <= numLevel; lv++) {
      requirements[`lv${lv}`] = {
        Steel: baseValues.Steel * fibSequence[lv + 1],
        Aluminum: baseValues.Aluminum * fibSequence[lv + 1],
        Copper: baseValues.Copper * fibSequence[lv + 1],
        Fiber: baseValues.Fiber * fibSequence[lv + 1],
        Titanium: baseValues.Titanium * fibSequence[lv + 1],
        "TS-BTC": btcSequence[lv - 1],
      };
    }
    return requirements;
  }, [numLevel]);

  return miningRequirements;
};

export default useResourceCapacity;
