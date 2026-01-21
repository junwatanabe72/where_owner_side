/**
 * 評価シミュレーター機能のモックデータ
 * フェーズ1-2: UIファースト実装用
 * 3シナリオ: 借地権マンション、土地交換、マスターリース
 */

import {
  LeaseholdCondoSimulation,
  LandSwapSimulation,
  MasterLeaseSimulation,
  ScenarioComparison,
} from '../types/valuation';

/**
 * モック: 借地権マンションシミュレーション
 * 対象物件: 渋谷区宇田川町31-2
 */
export const mockLeaseholdCondoSimulation: LeaseholdCondoSimulation = {
  id: 'sim-lc-001',
  assetId: 1,
  scenarioType: 'leaseholdCondo',
  createdAt: '2025-10-20T10:00:00+09:00',
  calculatedAt: '2025-10-20T10:00:00+09:00',
  summary: {
    totalValue: 850000000, // 8.5億円
    annualRevenue: 42500000, // 4,250万円/年
    roi: 5.0, // 5.0%
    paybackPeriod: 20, // 20年
    npv: 125000000, // 1.25億円
    irr: 6.2, // 6.2%
  },
  parameters: {
    landArea: 350, // 350㎡
    buildingArea: 2100, // 2,100㎡（延床面積）
    floorAreaRatio: 600, // 容積率600%
    coverageRatio: 80, // 建蔽率80%
    constructionCost: 350000, // 35万円/㎡
    unitCount: 24, // 24戸
    averageUnitPrice: 52000000, // 5,200万円/戸
    leaseholdRatio: 70, // 借地権割合70%
  },
  financials: {
    totalConstructionCost: 735000000, // 7.35億円
    totalSalesRevenue: 1248000000, // 12.48億円
    grossProfit: 513000000, // 5.13億円
    groundRent: 8400000, // 840万円/年
    taxes: 128250000, // 1.28億円
    netProfit: 376350000, // 3.76億円
  },
  timeline: {
    constructionStart: '2026-04-01',
    constructionEnd: '2027-09-30',
    salesStart: '2027-04-01',
    salesEnd: '2028-03-31',
  },
};

/**
 * モック: 土地交換シミュレーション
 * 対象物件: 千代田区丸の内1-1-1
 */
export const mockLandSwapSimulation: LandSwapSimulation = {
  id: 'sim-ls-001',
  assetId: 4,
  scenarioType: 'landSwap',
  createdAt: '2025-10-20T10:00:00+09:00',
  calculatedAt: '2025-10-20T10:00:00+09:00',
  summary: {
    totalValue: 1250000000, // 12.5億円
    roi: 4.8, // 4.8%
    npv: 185000000, // 1.85億円
  },
  parameters: {
    currentLandArea: 450, // 450㎡
    currentLandValue: 900000000, // 9億円
    swapLandArea: 380, // 380㎡
    swapLandValue: 1140000000, // 11.4億円
    cashAdjustment: 240000000, // 2.4億円（差金）
    transferTaxRate: 20.315, // 譲渡税率20.315%
  },
  financials: {
    currentAssetValue: 900000000, // 9億円
    swapAssetValue: 1140000000, // 11.4億円
    taxBenefit: 48756000, // 約4,876万円（等価交換特例適用）
    netGain: 191244000, // 約1.91億円
    capitalGainsTax: 48756000, // 約4,876万円
    totalCost: 15000000, // 1,500万円（登記費用等）
  },
  comparison: {
    beforeYield: 3.2, // 3.2%
    afterYield: 4.8, // 4.8%
    valueIncrease: 240000000, // 2.4億円
    valueIncreaseRate: 26.67, // 26.67%
  },
};

/**
 * モック: マスターリースシミュレーション
 * 対象物件: 世田谷区太子堂4-1-1
 */
export const mockMasterLeaseSimulation: MasterLeaseSimulation = {
  id: 'sim-ml-001',
  assetId: 2,
  scenarioType: 'masterLease',
  createdAt: '2025-10-20T10:00:00+09:00',
  calculatedAt: '2025-10-20T10:00:00+09:00',
  summary: {
    totalValue: 540000000, // 5.4億円
    annualRevenue: 21600000, // 2,160万円/年
    roi: 4.0, // 4.0%
    npv: 94500000, // 9,450万円
  },
  parameters: {
    totalFloorArea: 800, // 800㎡
    guaranteedRent: 1800000, // 180万円/月
    leaseTerm: 10, // 10年契約
    occupancyRate: 92, // 稼働率92%
    marketRent: 2400, // 2,400円/㎡・月
    managementFeeRate: 5, // 管理手数料5%
  },
  financials: {
    annualGuaranteedRevenue: 21600000, // 2,160万円/年
    annualMarketRevenue: 23040000, // 2,304万円/年（参考）
    annualExpenses: 3240000, // 324万円/年
    netOperatingIncome: 18360000, // 1,836万円/年（NOI）
    operatingExpenseRatio: 15.0, // 15.0%
    capRate: 4.25, // 4.25%
  },
  cashflow: [
    { year: 1, revenue: 21600000, expenses: 3240000, noi: 18360000, cumulativeNoi: 18360000 },
    { year: 2, revenue: 21600000, expenses: 3240000, noi: 18360000, cumulativeNoi: 36720000 },
    { year: 3, revenue: 21600000, expenses: 3240000, noi: 18360000, cumulativeNoi: 55080000 },
    { year: 4, revenue: 21600000, expenses: 3240000, noi: 18360000, cumulativeNoi: 73440000 },
    { year: 5, revenue: 21600000, expenses: 3240000, noi: 18360000, cumulativeNoi: 91800000 },
    { year: 6, revenue: 21600000, expenses: 3240000, noi: 18360000, cumulativeNoi: 110160000 },
    { year: 7, revenue: 21600000, expenses: 3240000, noi: 18360000, cumulativeNoi: 128520000 },
    { year: 8, revenue: 21600000, expenses: 3240000, noi: 18360000, cumulativeNoi: 146880000 },
    { year: 9, revenue: 21600000, expenses: 3240000, noi: 18360000, cumulativeNoi: 165240000 },
    { year: 10, revenue: 21600000, expenses: 3240000, noi: 18360000, cumulativeNoi: 183600000 },
  ],
  risks: {
    vacancyRisk: 'low',
    tenantDefaultRisk: 'low',
    marketRentDeclineRisk: 'medium',
  },
};

/**
 * モック: 3シナリオ比較データ
 * 対象物件: 渋谷区宇田川町31-2
 */
export const mockScenarioComparison: ScenarioComparison = {
  assetId: 1,
  scenarios: {
    leaseholdCondo: mockLeaseholdCondoSimulation,
    landSwap: {
      id: 'sim-ls-002',
      assetId: 1,
      scenarioType: 'landSwap',
      createdAt: '2025-10-20T10:00:00+09:00',
      calculatedAt: '2025-10-20T10:00:00+09:00',
      summary: {
        totalValue: 720000000,
        roi: 3.5,
        npv: 82000000,
      },
      parameters: {
        currentLandArea: 350,
        currentLandValue: 630000000,
        swapLandArea: 300,
        swapLandValue: 720000000,
        cashAdjustment: 90000000,
        transferTaxRate: 20.315,
      },
      financials: {
        currentAssetValue: 630000000,
        swapAssetValue: 720000000,
        taxBenefit: 18283500,
        netGain: 71716500,
        capitalGainsTax: 18283500,
        totalCost: 12000000,
      },
      comparison: {
        beforeYield: 2.8,
        afterYield: 3.5,
        valueIncrease: 90000000,
        valueIncreaseRate: 14.29,
      },
    },
    masterLease: {
      id: 'sim-ml-002',
      assetId: 1,
      scenarioType: 'masterLease',
      createdAt: '2025-10-20T10:00:00+09:00',
      calculatedAt: '2025-10-20T10:00:00+09:00',
      summary: {
        totalValue: 680000000,
        annualRevenue: 27200000,
        roi: 4.2,
        npv: 95000000,
      },
      parameters: {
        totalFloorArea: 1000,
        guaranteedRent: 2266667,
        leaseTerm: 10,
        occupancyRate: 90,
        marketRent: 2800,
        managementFeeRate: 5,
      },
      financials: {
        annualGuaranteedRevenue: 27200000,
        annualMarketRevenue: 30240000,
        annualExpenses: 4080000,
        netOperatingIncome: 23120000,
        operatingExpenseRatio: 15.0,
        capRate: 4.1,
      },
      cashflow: [
        { year: 1, revenue: 27200000, expenses: 4080000, noi: 23120000, cumulativeNoi: 23120000 },
        { year: 2, revenue: 27200000, expenses: 4080000, noi: 23120000, cumulativeNoi: 46240000 },
        { year: 3, revenue: 27200000, expenses: 4080000, noi: 23120000, cumulativeNoi: 69360000 },
        { year: 4, revenue: 27200000, expenses: 4080000, noi: 23120000, cumulativeNoi: 92480000 },
        { year: 5, revenue: 27200000, expenses: 4080000, noi: 23120000, cumulativeNoi: 115600000 },
        { year: 6, revenue: 27200000, expenses: 4080000, noi: 23120000, cumulativeNoi: 138720000 },
        { year: 7, revenue: 27200000, expenses: 4080000, noi: 23120000, cumulativeNoi: 161840000 },
        { year: 8, revenue: 27200000, expenses: 4080000, noi: 23120000, cumulativeNoi: 184960000 },
        { year: 9, revenue: 27200000, expenses: 4080000, noi: 23120000, cumulativeNoi: 208080000 },
        { year: 10, revenue: 27200000, expenses: 4080000, noi: 23120000, cumulativeNoi: 231200000 },
      ],
      risks: {
        vacancyRisk: 'medium',
        tenantDefaultRisk: 'low',
        marketRentDeclineRisk: 'medium',
      },
    },
  },
  recommendation: {
    preferred: 'leaseholdCondo',
    reason: '土地を保有したまま安定した地代収入が見込めるため、オーナー視点で最もバランスが良いと判断されます。',
    score: {
      leaseholdCondo: 92,
      landSwap: 73,
      masterLease: 78,
    },
  },
  createdAt: '2025-10-20T10:00:00+09:00',
};

/**
 * モック: 太子堂駐車場のシミュレーション（物件ID: 3）
 */
const mockScenarioComparison3: ScenarioComparison = {
  assetId: 3,
  scenarios: {
    masterLease: {
      id: 'sim-ml-003',
      assetId: 3,
      scenarioType: 'masterLease',
      createdAt: '2025-10-20T10:00:00+09:00',
      calculatedAt: '2025-10-20T10:00:00+09:00',
      summary: {
        totalValue: 132000000,
        annualRevenue: 2880000,
        roi: 2.2,
        npv: 12500000,
      },
      parameters: {
        totalFloorArea: 220,
        guaranteedRent: 240000,
        leaseTerm: 10,
        occupancyRate: 87.5,
        marketRent: 1200,
        managementFeeRate: 5,
      },
      financials: {
        annualGuaranteedRevenue: 2880000,
        annualMarketRevenue: 3168000,
        annualExpenses: 432000,
        netOperatingIncome: 2448000,
        operatingExpenseRatio: 15.0,
        capRate: 2.8,
      },
      cashflow: Array.from({ length: 10 }, (_, i) => ({
        year: i + 1,
        revenue: 2880000,
        expenses: 432000,
        noi: 2448000,
        cumulativeNoi: 2448000 * (i + 1),
      })),
      risks: {
        vacancyRisk: 'low',
        tenantDefaultRisk: 'low',
        marketRentDeclineRisk: 'low',
      },
    },
    leaseholdCondo: {
      id: 'sim-lc-003',
      assetId: 3,
      scenarioType: 'leaseholdCondo',
      createdAt: '2025-10-20T10:00:00+09:00',
      calculatedAt: '2025-10-20T10:00:00+09:00',
      summary: {
        totalValue: 180000000,
        annualRevenue: 9000000,
        roi: 5.0,
        paybackPeriod: 20,
        npv: 25000000,
        irr: 5.8,
      },
      parameters: {
        landArea: 220,
        buildingArea: 440,
        floorAreaRatio: 200,
        coverageRatio: 60,
        constructionCost: 400000,
        unitCount: 6,
        averageUnitPrice: 35000000,
        leaseholdRatio: 70,
      },
      financials: {
        totalConstructionCost: 176000000,
        totalSalesRevenue: 210000000,
        grossProfit: 34000000,
        groundRent: 1500000,
        taxes: 8500000,
        netProfit: 24000000,
      },
      timeline: {
        constructionStart: '2026-06-01',
        constructionEnd: '2027-03-31',
        salesStart: '2026-12-01',
        salesEnd: '2027-09-30',
      },
    },
  },
  recommendation: {
    preferred: 'masterLease',
    reason: '駐車場として安定運営中のため、マスターリースによる低リスク運用が最適です。',
    score: {
      leaseholdCondo: 62,
      landSwap: 45,
      masterLease: 88,
    },
  },
  createdAt: '2025-10-20T10:00:00+09:00',
};

/**
 * モック: 丸の内オフィスビルのシミュレーション（物件ID: 4）
 */
const mockScenarioComparison4: ScenarioComparison = {
  assetId: 4,
  scenarios: {
    landSwap: mockLandSwapSimulation,
    leaseholdCondo: {
      id: 'sim-lc-004',
      assetId: 4,
      scenarioType: 'leaseholdCondo',
      createdAt: '2025-10-20T10:00:00+09:00',
      calculatedAt: '2025-10-20T10:00:00+09:00',
      summary: {
        totalValue: 2800000000,
        annualRevenue: 140000000,
        roi: 5.0,
        paybackPeriod: 20,
        npv: 420000000,
        irr: 6.8,
      },
      parameters: {
        landArea: 450,
        buildingArea: 4500,
        floorAreaRatio: 1000,
        coverageRatio: 100,
        constructionCost: 500000,
        unitCount: 45,
        averageUnitPrice: 75000000,
        leaseholdRatio: 60,
      },
      financials: {
        totalConstructionCost: 2250000000,
        totalSalesRevenue: 3375000000,
        grossProfit: 1125000000,
        groundRent: 27000000,
        taxes: 281250000,
        netProfit: 816750000,
      },
      timeline: {
        constructionStart: '2026-04-01',
        constructionEnd: '2028-03-31',
        salesStart: '2027-10-01',
        salesEnd: '2029-03-31',
      },
    },
  },
  recommendation: {
    preferred: 'leaseholdCondo',
    reason: '一等地の地代水準が高く、土地を維持しながら安定収益を確保できるため最適です。',
    score: {
      leaseholdCondo: 95,
      landSwap: 78,
      masterLease: 0,
    },
  },
  createdAt: '2025-10-20T10:00:00+09:00',
};

/**
 * モック: 六本木開発用地のシミュレーション（物件ID: 5）
 */
const mockScenarioComparison5: ScenarioComparison = {
  assetId: 5,
  scenarios: {
    leaseholdCondo: {
      id: 'sim-lc-005',
      assetId: 5,
      scenarioType: 'leaseholdCondo',
      createdAt: '2025-10-20T10:00:00+09:00',
      calculatedAt: '2025-10-20T10:00:00+09:00',
      summary: {
        totalValue: 3500000000,
        annualRevenue: 175000000,
        roi: 5.0,
        paybackPeriod: 20,
        npv: 525000000,
        irr: 7.2,
      },
      parameters: {
        landArea: 580,
        buildingArea: 4060,
        floorAreaRatio: 700,
        coverageRatio: 80,
        constructionCost: 600000,
        unitCount: 52,
        averageUnitPrice: 85000000,
        leaseholdRatio: 70,
      },
      financials: {
        totalConstructionCost: 2436000000,
        totalSalesRevenue: 4420000000,
        grossProfit: 1984000000,
        groundRent: 34800000,
        taxes: 496000000,
        netProfit: 1453200000,
      },
      timeline: {
        constructionStart: '2026-10-01',
        constructionEnd: '2028-09-30',
        salesStart: '2028-04-01',
        salesEnd: '2029-09-30',
      },
    },
    landSwap: {
      id: 'sim-ls-005',
      assetId: 5,
      scenarioType: 'landSwap',
      createdAt: '2025-10-20T10:00:00+09:00',
      calculatedAt: '2025-10-20T10:00:00+09:00',
      summary: {
        totalValue: 1450000000,
        roi: 5.2,
        npv: 215000000,
      },
      parameters: {
        currentLandArea: 580,
        currentLandValue: 1160000000,
        swapLandArea: 500,
        swapLandValue: 1500000000,
        cashAdjustment: 340000000,
        transferTaxRate: 20.315,
      },
      financials: {
        currentAssetValue: 1160000000,
        swapAssetValue: 1500000000,
        taxBenefit: 69071000,
        netGain: 270929000,
        capitalGainsTax: 69071000,
        totalCost: 18000000,
      },
      comparison: {
        beforeYield: 3.5,
        afterYield: 5.2,
        valueIncrease: 340000000,
        valueIncreaseRate: 29.31,
      },
    },
  },
  recommendation: {
    preferred: 'leaseholdCondo',
    reason: '再開発エリアのため地代上昇が期待でき、長期安定収益を見込めるため適しています。',
    score: {
      leaseholdCondo: 98,
      landSwap: 82,
      masterLease: 0,
    },
  },
  createdAt: '2025-10-20T10:00:00+09:00',
};

/**
 * 複数物件の3シナリオ比較データ
 */
export const mockScenarioComparisons: ScenarioComparison[] = [
  mockScenarioComparison,
  {
    assetId: 2,
    scenarios: {
      masterLease: mockMasterLeaseSimulation,
    },
    recommendation: {
      preferred: 'masterLease',
      reason: 'マスターリースにより安定収益を確保しながら、将来の開発オプションを保持できます。',
      score: {
        leaseholdCondo: 65,
        landSwap: 58,
        masterLease: 85,
      },
    },
    createdAt: '2025-10-20T10:00:00+09:00',
  },
  mockScenarioComparison3,
  mockScenarioComparison4,
  mockScenarioComparison5,
];

/**
 * 物件IDからシナリオ比較データを取得
 */
export const getScenarioComparisonByAssetId = (assetId: number): ScenarioComparison | undefined => {
  return mockScenarioComparisons.find(comparison => comparison.assetId === assetId);
};
