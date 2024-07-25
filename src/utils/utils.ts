export const numeralFormat = (
  price: number,
  decimal = 2,
  roundingFunction = Math.floor
) => {
  if (price >= 1e9) {
    return (
      (price / 1e9).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }) + "B"
    );
  } else if (price >= 1e6) {
    return (
      (price / 1e6).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }) + "M"
    );
  } else if (price >= 1e3) {
    return price?.toLocaleString(undefined, { maximumFractionDigits: 0 });
  } else {
    return price?.toLocaleString();
  }
};

export const imageResources: any = {
  BTC: "/bitcoin.svg",
  Bitcoin: "/bitcoin.svg",
  Aluminum: "/assets/resources/Alu.png",
  Copper: "/assets/resources/Copper.png",
  Fiber: "/assets/resources/Fiber.png",
  Steel: "/assets/resources/Steel.png",
  Titanium: "/assets/resources/Titan.png",
};

export const checkPassiveUplevel: any = {
  Steel: 0.16,
  Aluminum: 0.1,
  Copper: 0.06,
  Fiber: 0.04,
  Titanium: 0.02,
};

export const checkBtcUplevel: any = {
  BTC: 0.00002315,
};

export const convertLevelToNumber = (levelString: number): number => {
  return levelString; // Default to 0 if no match found
};
