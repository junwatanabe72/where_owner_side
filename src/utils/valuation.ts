export type UnitPriceInputs = {
  areaSqm: number;
  rosenkaPsm?: number; // 円/㎡
  kojiPsm?: number; // 円/㎡
  rosenkaToMarket?: number; // デフォルト1.15
  kojiToMarket?: number; // デフォルト0.95
  weights?: { rosenka: number; koji: number }; // 合計1.0
  sensitivity?: number; // 0.1 → ±10%
};

export type EstimateRange = {
  min: number;
  median: number;
  max: number;
  breakdown?: {
    rosenka?: number;
    koji?: number;
  };
};

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function estimateByUnitPrices({
  areaSqm,
  rosenkaPsm,
  kojiPsm,
  rosenkaToMarket = 1.15,
  kojiToMarket = 0.95,
  weights = { rosenka: 0.5, koji: 0.5 },
  sensitivity = 0.1,
}: UnitPriceInputs): EstimateRange {
  const wR = clamp01(weights.rosenka ?? 0.5);
  const wK = clamp01(weights.koji ?? 0.5);
  const wSum = wR + wK || 1;
  const wR2 = wR / wSum;
  const wK2 = wK / wSum;

  const vR = rosenkaPsm ? areaSqm * rosenkaPsm * rosenkaToMarket : 0;
  const vK = kojiPsm ? areaSqm * kojiPsm * kojiToMarket : 0;

  // 両方欠落時は0
  const median = (vR ? wR2 * vR : 0) + (vK ? wK2 * vK : 0);
  const min = median * (1 - sensitivity);
  const max = median * (1 + sensitivity);

  return { min, median, max, breakdown: { rosenka: vR || undefined, koji: vK || undefined } };
}


