type LevelRequirements = {
  Steel: number;
  Aluminum: number;
  Copper: number;
  Fiber: number;
  Titanium: number;
};

export type CheckLevel = {
  lv1: LevelRequirements;
  lv2: LevelRequirements;
  lv3: LevelRequirements;
  lv4: LevelRequirements;
  lv5: LevelRequirements;
};

export const checkLevel: CheckLevel = {
  lv1: {
    Steel: 14400,
    Aluminum: 9000,
    Copper: 5400,
    Fiber: 3600,
    Titanium: 1800,
  },
  lv2: {
    Steel: 14400 * 2,
    Aluminum: 9000 * 2,
    Copper: 5400 * 2,
    Fiber: 3600 * 2,
    Titanium: 1800 * 2,
  },
  lv3: {
    Steel: 14400 * 3,
    Aluminum: 9000 * 3,
    Copper: 5400 * 3,
    Fiber: 3600 * 3,
    Titanium: 1800 * 3,
  },
  lv4: {
    Steel: 14400 * 4,
    Aluminum: 9000 * 4,
    Copper: 5400 * 4,
    Fiber: 3600 * 4,
    Titanium: 1800 * 4,
  },
  lv5: {
    Steel: 14400 * 5,
    Aluminum: 9000 * 5,
    Copper: 5400 * 5,
    Fiber: 3600 * 5,
    Titanium: 1800 * 5,
  },
};
