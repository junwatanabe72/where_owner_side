/**
 * インタラクティブシミュレーター用の計算関数
 * パラメータを変更して再計算するためのヘルパー関数
 */

import type {
  LeaseholdCondoSimulation,
  LandSwapSimulation,
  MasterLeaseSimulation,
} from '../types/valuation';

/**
 * 借地権マンションシミュレーションを再計算
 */
export const calculateLeaseholdCondo = (params: {
  landArea: number;
  floorAreaRatio: number;
  coverageRatio: number;
  constructionCost?: number;
  averageUnitPrice?: number;
  leaseholdRatio?: number;
  groundRentRate?: number; // 地代率（年率%）デフォルト0.6%
}): Partial<LeaseholdCondoSimulation> => {
  const {
    landArea,
    floorAreaRatio,
    coverageRatio,
    constructionCost = 0,
    averageUnitPrice = 0,
    leaseholdRatio,
    groundRentRate = 0.6,
  } = params;

  // 建物延床面積を計算
  const buildingArea = Math.floor((landArea * floorAreaRatio) / 100);

  // 住戸数を概算（1戸あたり60㎡と仮定）
  const unitCount = Math.floor(buildingArea / 60);

  // 地代（年額）と土地評価（参考）
  const landValue = landArea * 1800000; // 仮定: 180万円/㎡
  const groundRent = Math.floor((landValue * groundRentRate) / 100);

  return {
    summary: {
      totalValue: landValue,
      annualRevenue: groundRent,
      roi: groundRentRate,
      paybackPeriod: undefined,
      npv: undefined,
      irr: undefined,
    },
    parameters: {
      landArea,
      buildingArea,
      floorAreaRatio,
      coverageRatio,
      unitCount,
      constructionCost,
      averageUnitPrice,
      leaseholdRatio: leaseholdRatio ?? 0,
    },
    financials: {
      groundRent,
      totalConstructionCost: 0,
      totalSalesRevenue: 0,
      grossProfit: 0,
      taxes: 0,
      netProfit: 0,
    },
  };
};

/**
 * 土地交換シミュレーションを再計算
 */
export const calculateLandSwap = (params: {
  currentLandArea: number;
  currentLandValue: number;
  swapLandArea: number;
  swapLandValue: number;
  transferTaxRate?: number; // デフォルト20.315%
}): Partial<LandSwapSimulation> => {
  const {
    currentLandArea,
    currentLandValue,
    swapLandArea,
    swapLandValue,
    transferTaxRate = 20.315,
  } = params;

  // 交換差金
  const cashAdjustment = swapLandValue - currentLandValue;

  // 譲渡所得税（差金に対する税金）
  const capitalGainsTax = Math.floor((cashAdjustment * transferTaxRate) / 100);

  // 総費用（登記費用等、評価額の1.5%と仮定）
  const totalCost = Math.floor(swapLandValue * 0.015);

  // 税制優遇（等価交換特例を想定）
  const taxBenefit = capitalGainsTax;

  // 純利益（差金 - 税金 - 登記等費用 + 税制優遇）
  const netGain = cashAdjustment - capitalGainsTax - totalCost + taxBenefit;

  // 利回り計算（簡易版）
  const beforeYield = 3.0; // 仮定
  const afterYield = 3.0 + (netGain / currentLandValue) * 2; // 純増加額ベースに調整

  // 資産価値上昇
  const valueIncrease = cashAdjustment;
  const valueIncreaseRate = (valueIncrease / currentLandValue) * 100;

  // ROI（純増加額 / 現資産価値）
  const roi = (netGain / currentLandValue) * 100;

  // NPV（簡易）：割引率5%、2年での実現を想定
  const npv = Math.floor(netGain / Math.pow(1 + 0.05, 2));

  return {
    summary: {
      totalValue: swapLandValue,
      roi,
      npv,
    },
    parameters: {
      currentLandArea,
      currentLandValue,
      swapLandArea,
      swapLandValue,
      cashAdjustment,
      transferTaxRate,
    },
    financials: {
      currentAssetValue: currentLandValue,
      swapAssetValue: swapLandValue,
      taxBenefit,
      netGain,
      capitalGainsTax,
      totalCost,
    },
    comparison: {
      beforeYield,
      afterYield,
      valueIncrease,
      valueIncreaseRate,
    },
  };
};

/**
 * マスターリースシミュレーションを再計算
 */
export const calculateMasterLease = (params: {
  totalFloorArea: number;
  guaranteedRent: number; // 月額
  leaseTerm: number; // 年数
  managementFeeRate?: number; // デフォルト5%
  occupancyRate?: number; // デフォルト90%
}): Partial<MasterLeaseSimulation> => {
  const {
    totalFloorArea,
    guaranteedRent,
    leaseTerm,
    managementFeeRate = 5,
    occupancyRate = 90,
  } = params;

  // 年間保証収益（マスターリースは稼働率に依存せず一定の想定）
  const annualGuaranteedRevenue = guaranteedRent * 12;

  // 市場賃料（参考値）
  const marketRent = Math.floor(guaranteedRent / totalFloorArea);
  const annualMarketRevenue = marketRent * totalFloorArea * 12;

  // 年間経費：管理手数料率を反映（その他経費はここでは含めない簡易版）
  const annualExpenses = Math.floor(annualGuaranteedRevenue * (managementFeeRate / 100));

  // 純営業収益（NOI）
  const netOperatingIncome = annualGuaranteedRevenue - annualExpenses;

  // 経費率
  const operatingExpenseRatio = (annualExpenses / annualGuaranteedRevenue) * 100;

  // 還元利回り（Cap Rate）と評価額：市場CapRateを仮定し一貫性を担保
  const assumedCapRate = 0.0425; // 4.25%
  const totalValue = Math.floor(netOperatingIncome / assumedCapRate);
  const capRate = (netOperatingIncome / totalValue) * 100;

  // ROI
  const roi = capRate;

  // NPV（簡易）：割引率3%、年次NOIの現在価値合計（等比級数の近似）
  const discountRate = 0.03;
  const npv = Math.floor(
    Array.from({ length: leaseTerm }, (_, i) => netOperatingIncome / Math.pow(1 + discountRate, i + 1))
      .reduce((a, b) => a + b, 0)
  );

  // キャッシュフロー
  const cashflow = Array.from({ length: leaseTerm }, (_, i) => ({
    year: i + 1,
    revenue: annualGuaranteedRevenue,
    expenses: annualExpenses,
    noi: netOperatingIncome,
    cumulativeNoi: netOperatingIncome * (i + 1),
  }));

  // リスク評価（簡易判定）
  const vacancyRisk = occupancyRate > 90 ? 'low' : occupancyRate > 75 ? 'medium' : 'high';
  const tenantDefaultRisk = guaranteedRent > 1000000 ? 'low' : 'medium';
  const marketRentDeclineRisk = 'medium'; // 固定

  return {
    summary: {
      totalValue,
      annualRevenue: annualGuaranteedRevenue,
      roi,
      npv,
    },
    parameters: {
      totalFloorArea,
      guaranteedRent,
      leaseTerm,
      occupancyRate,
      marketRent,
      managementFeeRate,
    },
    financials: {
      annualGuaranteedRevenue,
      annualMarketRevenue,
      annualExpenses,
      netOperatingIncome,
      operatingExpenseRatio,
      capRate,
    },
    cashflow,
    risks: {
      vacancyRisk: vacancyRisk as 'low' | 'medium' | 'high',
      tenantDefaultRisk: tenantDefaultRisk as 'low' | 'medium' | 'high',
      marketRentDeclineRisk: marketRentDeclineRisk as 'low' | 'medium' | 'high',
    },
  };
};

/**
 * シナリオスコアを計算
 */
export const calculateScenarioScore = (
  roi: number,
  npv: number,
  riskLevel: 'low' | 'medium' | 'high'
): number => {
  // ROIベーススコア（0-50点）
  const roiScore = Math.min(roi * 8, 50);

  // NPVベーススコア（0-30点）
  const npvScore = Math.min((npv / 10000000) * 3, 30);

  // リスク調整（0-20点）
  const riskScore = riskLevel === 'low' ? 20 : riskLevel === 'medium' ? 12 : 5;

  return Math.round(roiScore + npvScore + riskScore);
};

/**
 * 推奨シナリオを判定
 */
export const determineRecommendedScenario = (scores: {
  leaseholdCondo?: number;
  landSwap?: number;
  masterLease?: number;
}): 'leaseholdCondo' | 'landSwap' | 'masterLease' => {
  const entries = Object.entries(scores).filter(([_, score]) => score !== undefined);
  entries.sort((a, b) => (b[1] as number) - (a[1] as number));

  return entries[0][0] as 'leaseholdCondo' | 'landSwap' | 'masterLease';
};
