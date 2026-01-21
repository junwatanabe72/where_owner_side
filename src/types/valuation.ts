/**
 * 評価シミュレーター機能の型定義
 * フェーズ1-2: UIファースト実装用の型定義
 */

/**
 * シミュレーション結果の共通インターフェース
 */
export interface SimulationResult {
  id: string;
  assetId: number;
  scenarioType: 'leaseholdCondo' | 'landSwap' | 'masterLease';
  createdAt: string; // ISO 8601形式
  calculatedAt: string; // ISO 8601形式
  summary: SimulationSummary;
}

/**
 * シミュレーション結果のサマリー
 */
export interface SimulationSummary {
  totalValue: number; // 総評価額（円）
  annualRevenue?: number; // 年間収益（円）
  roi?: number; // 投資利回り（%）
  paybackPeriod?: number; // 回収期間（年）
  npv?: number; // 正味現在価値（円）
  irr?: number; // 内部収益率（%）
}

/**
 * 借地権マンション（leasehold condo）シミュレーション
 */
export interface LeaseholdCondoSimulation extends SimulationResult {
  scenarioType: 'leaseholdCondo';
  parameters: {
    landArea: number; // 土地面積（㎡）
    buildingArea: number; // 建物延床面積（㎡）
    floorAreaRatio: number; // 容積率（%）
    coverageRatio: number; // 建蔽率（%）
    constructionCost: number; // 建築費（円/㎡）
    unitCount: number; // 住戸数
    averageUnitPrice: number; // 平均販売価格（円/戸）
    leaseholdRatio: number; // 借地権割合（%）
  };
  financials: {
    totalConstructionCost: number; // 総建築費
    totalSalesRevenue: number; // 総売上
    grossProfit: number; // 粗利益
    groundRent: number; // 地代（年額）
    taxes: number; // 税金
    netProfit: number; // 純利益
  };
  timeline: {
    constructionStart: string; // 着工予定日
    constructionEnd: string; // 完工予定日
    salesStart: string; // 販売開始予定日
    salesEnd: string; // 販売完了予定日
  };
}

/**
 * 土地交換（land swap）シミュレーション
 */
export interface LandSwapSimulation extends SimulationResult {
  scenarioType: 'landSwap';
  parameters: {
    currentLandArea: number; // 現在の土地面積（㎡）
    currentLandValue: number; // 現在の土地評価額（円）
    swapLandArea: number; // 交換先の土地面積（㎡）
    swapLandValue: number; // 交換先の土地評価額（円）
    cashAdjustment: number; // 交換差金（円）
    transferTaxRate: number; // 譲渡税率（%）
  };
  financials: {
    currentAssetValue: number; // 現在の資産価値
    swapAssetValue: number; // 交換後の資産価値
    taxBenefit: number; // 税制優遇額
    netGain: number; // 純利益
    capitalGainsTax: number; // 譲渡所得税
    totalCost: number; // 総費用（登記費用等）
  };
  comparison: {
    beforeYield: number; // 交換前の利回り（%）
    afterYield: number; // 交換後の利回り（%）
    valueIncrease: number; // 資産価値上昇額（円）
    valueIncreaseRate: number; // 資産価値上昇率（%）
  };
}

/**
 * マスターリース（master lease）シミュレーション
 */
export interface MasterLeaseSimulation extends SimulationResult {
  scenarioType: 'masterLease';
  parameters: {
    totalFloorArea: number; // 総床面積（㎡）
    guaranteedRent: number; // 保証賃料（円/月）
    leaseTerm: number; // 契約期間（年）
    occupancyRate: number; // 想定稼働率（%）
    marketRent: number; // 市場賃料（円/月・㎡）
    managementFeeRate: number; // 管理手数料率（%）
  };
  financials: {
    annualGuaranteedRevenue: number; // 年間保証収益
    annualMarketRevenue: number; // 年間市場収益（参考）
    annualExpenses: number; // 年間経費
    netOperatingIncome: number; // 純営業収益（NOI）
    operatingExpenseRatio: number; // 経費率（%）
    capRate: number; // 還元利回り（%）
  };
  cashflow: {
    year: number;
    revenue: number;
    expenses: number;
    noi: number;
    cumulativeNoi: number;
  }[];
  risks: {
    vacancyRisk: 'low' | 'medium' | 'high';
    tenantDefaultRisk: 'low' | 'medium' | 'high';
    marketRentDeclineRisk: 'low' | 'medium' | 'high';
  };
}

/**
 * 3シナリオ比較データ
 */
export interface ScenarioComparison {
  assetId: number;
  scenarios: {
    leaseholdCondo?: LeaseholdCondoSimulation;
    landSwap?: LandSwapSimulation;
    masterLease?: MasterLeaseSimulation;
  };
  recommendation: {
    preferred: 'leaseholdCondo' | 'landSwap' | 'masterLease';
    reason: string;
    score: {
      leaseholdCondo: number; // 0-100
      landSwap: number;
      masterLease: number;
    };
  };
  createdAt: string;
}
