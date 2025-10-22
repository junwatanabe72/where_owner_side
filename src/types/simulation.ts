/**
 * 評価シミュレーター型定義
 *
 * 定期借地権マンション、等価交換、一括借上の3シナリオを比較する
 * 評価シミュレーター機能の型定義
 */

// ============================================
// 基本型
// ============================================

export type Money = number; // 円単位
export type Rate = number;  // 0.03 = 3% のような小数表現

/**
 * 年次キャッシュフロー
 */
export interface AnnualCashFlow {
  year: number;
  cf: Money;
  /** 累積CF（オプション） */
  cumulative?: Money;
}

// ============================================
// 共通入力パラメータ
// ============================================

/**
 * 全シナリオ共通の入力パラメータ
 */
export interface CommonInput {
  /** 土地面積（㎡） */
  landAreaM2: number;
  /** 想定素地価格（円/㎡） */
  landUnitPrice: Money;
  /** 容積率（例: 200 = 200%） */
  far: number;
  /** 建築コスト（円/㎡）- オプション */
  buildCostPerM2?: Money;
  /** 設計・諸経費率（例: 0.1 = 10%）- オプション */
  softCostRate?: Rate;
  /** 割引率（資本コスト、例: 0.03 = 3%） */
  discountRate: Rate;
  /** 固定資産税・都市計画税率（例: 0.017 = 1.7%）- オプション */
  taxRateFixedAsset?: Rate;
  /** 保守費率（年次、対評価額）- オプション */
  maintenanceRate?: Rate;
}

// ============================================
// シミュレーション結果
// ============================================

/**
 * 各シナリオの計算結果
 */
export interface SimulationResult {
  /** 正味現在価値（NPV） */
  npv: Money;
  /** 内部収益率（IRR）- 計算可能な場合のみ */
  irr?: Rate;
  /** 回収年数 */
  paybackYear?: number;
  /** 年次キャッシュフロー */
  annualCF: AnnualCashFlow[];
  /** 実現可否（経済的妥当性） */
  feasible: boolean;
  /** 注記・補足説明 */
  notes: string[];
  /** 初期投資額 */
  initialInvestment?: Money;
  /** 総収入（期間合計） */
  totalRevenue?: Money;
  /** 総コスト（期間合計） */
  totalCost?: Money;
}

// ============================================
// C-1. 定期借地権マンション（定借マンション）
// ============================================

/**
 * 定期借地権マンションの入力パラメータ
 */
export interface LeaseholdCondoInput extends CommonInput {
  /** 借地期間（年、例: 50） */
  leaseYears: number;
  /** 借地料利回り（対素地価、例: 0.03 = 3%） */
  groundRentYield: Rate;
  /** 地代エスカレーター（年率、例: 0.01 = 1%/年） */
  escalatorRate: Rate;
  /** 一時金・保証金（任意、デフォルト0） */
  upfrontPremium?: Money;
  /** オーナー住戸取得面積（㎡、任意） */
  ownerUnitM2?: number;
  /** オーナー住戸想定賃料（円/㎡/月、住戸取得時のみ） */
  ownerUnitRentPerM2?: Money;
}

// ============================================
// C-2. 等価交換（共同建替／権利変換）
// ============================================

/**
 * 等価交換の入力パラメータ
 */
export interface LandSwapInput extends CommonInput {
  /** 事業効率（有効率、例: 0.85 = 85%） */
  efficiency: Rate;
  /** 売却単価（円/㎡、住居/商業のミックス平均） */
  salesPricePerM2: Money;
  /** ディベロッパー目標利益率（対GDV、例: 0.15 = 15%） */
  developerMarginRate: Rate;
  /** 資金調達コスト率（オプション、例: 0.02 = 2%） */
  financeCostRate?: Rate;
  /** 工期（年） */
  constructionYears?: number;
  /** オーナー取得方法: 'unit' = 住戸取得, 'cash' = 金銭清算, 'auto' = 自動判定 */
  ownerAcquisitionMode?: 'unit' | 'cash' | 'auto';
  /** 住戸取得時の想定賃料（円/㎡/月、unitモード時） */
  unitRentPerM2?: Money;
  /** 住戸売却想定（unitモード時に賃貸でなく売却する場合） */
  sellAfterAcquisition?: boolean;
}

// ============================================
// C-3. 一括借上
// ============================================

/**
 * 一括借上の入力パラメータ
 */
export interface MasterLeaseInput extends CommonInput {
  /** 保証賃料（円/㎡/月） */
  baseRentPerM2PerMonth: Money;
  /** 契約期間（年） */
  termYears: number;
  /** 年次エスカレーター（例: 0.01 = 1%/年） */
  escalatorRate: Rate;
  /** 初期整備費（オーナー負担分） */
  initialCapexOwner?: Money;
  /** 期末原状回復費用（オーナー負担分） */
  terminalCost?: Money;
  /** 変動費率（対収入、オプション） */
  variableCostRate?: Rate;
}

// ============================================
// シナリオ種別
// ============================================

/**
 * シミュレーションシナリオの種別
 */
export type SimulationScenario = 'leaseholdCondo' | 'landSwap' | 'masterLease';

/**
 * シナリオ種別のラベル
 */
export const SimulationScenarioLabels: Record<SimulationScenario, string> = {
  leaseholdCondo: '定期借地権マンション',
  landSwap: '等価交換',
  masterLease: '一括借上',
};

/**
 * シナリオ種別の説明
 */
export const SimulationScenarioDescriptions: Record<SimulationScenario, string> = {
  leaseholdCondo: '土地に定期借地権を設定し、長期的に地代収入を得る。期間終了時に更地返還。',
  landSwap: '土地と新築建物を等価交換。オーナーは建物の一部を取得し、賃貸・売却で収益化。',
  masterLease: '事業者が土地を一括賃借し、保証賃料を支払う。安定収益型。',
};

// ============================================
// UI用の複合型
// ============================================

/**
 * シナリオ別の入力パラメータの共用型
 */
export type ScenarioInput = LeaseholdCondoInput | LandSwapInput | MasterLeaseInput;

/**
 * シミュレーション実行パラメータ
 */
export interface SimulationRequest {
  scenario: SimulationScenario;
  input: ScenarioInput;
}

/**
 * シミュレーション実行結果
 */
export interface SimulationResponse {
  scenario: SimulationScenario;
  input: ScenarioInput;
  result: SimulationResult;
  calculatedAt: string; // ISO8601
}

/**
 * 3シナリオ比較用のデータ
 */
export interface ScenarioComparison {
  leaseholdCondo?: SimulationResponse;
  landSwap?: SimulationResponse;
  masterLease?: SimulationResponse;
}

// ============================================
// プリセット設定
// ============================================

/**
 * シナリオ入力のプリセット種別
 */
export type PresetType = 'urban' | 'suburban' | 'rural' | 'custom';

/**
 * プリセット設定
 */
export interface InputPreset {
  type: PresetType;
  label: string;
  description: string;
  commonDefaults: Partial<CommonInput>;
  scenarioDefaults: {
    leaseholdCondo?: Partial<LeaseholdCondoInput>;
    landSwap?: Partial<LandSwapInput>;
    masterLease?: Partial<MasterLeaseInput>;
  };
}
