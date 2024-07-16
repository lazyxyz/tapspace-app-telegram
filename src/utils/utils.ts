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
    Steel: 144,
    Aluminum: 90,
    Copper: 54,
    Fiber: 36,
    Titanium: 18,
  },
  lv2: {
    Steel: 144 * 2,
    Aluminum: 90 * 2,
    Copper: 54 * 2,
    Fiber: 36 * 2,
    Titanium: 18 * 2,
  },
  lv3: {
    Steel: 144 * 3,
    Aluminum: 90 * 3,
    Copper: 54 * 3,
    Fiber: 36 * 3,
    Titanium: 18 * 3,
  },
  lv4: {
    Steel: 144 * 4,
    Aluminum: 90 * 4,
    Copper: 54 * 4,
    Fiber: 36 * 4,
    Titanium: 18 * 4,
  },
  lv5: {
    Steel: 144 * 5,
    Aluminum: 90 * 5,
    Copper: 54 * 5,
    Fiber: 36 * 5,
    Titanium: 18 * 5,
  },
};
