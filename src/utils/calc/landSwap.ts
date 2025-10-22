/**
 * 等価交換（共同建替／権利変換）計算モジュール
 *
 * 土地と新築建物を等価交換し、オーナーが建物の一部を取得するシナリオのシミュレーション
 */

import type { LandSwapInput, SimulationResult, AnnualCashFlow } from '../../types/simulation';

/**
 * 等価交換のシミュレーション実行
 */
export function calculateLandSwap(input: LandSwapInput): SimulationResult {
  const {
    landAreaM2,
    landUnitPrice,
    far,
    efficiency = 0.85,
    salesPricePerM2,
    buildCostPerM2 = 400000,
    softCostRate = 0.15,
    developerMarginRate,
    financeCostRate = 0.02,
    discountRate,
    constructionYears = 2,
    unitRentPerM2 = 3000,
    sellAfterAcquisition = false,
    taxRateFixedAsset = 0.017,
    maintenanceRate = 0.005,
  } = input;

  // 基本計算
  const landValue = landAreaM2 * landUnitPrice;
  const plannedGfa = landAreaM2 * (far / 100) * efficiency; // 計画延床面積
  const gdv = plannedGfa * salesPricePerM2; // 総売上（GDV）

  // コスト計算
  const buildCost = plannedGfa * buildCostPerM2;
  const softCost = buildCost * softCostRate;
  const financeCost = (buildCost + softCost) * financeCostRate;
  const totalCost = buildCost + softCost + financeCost;

  // ディベロッパー利益
  const developerProfit = gdv * developerMarginRate;

  // 土地対価の上限
  const landBudget = gdv - totalCost - developerProfit;

  // 実現可否判定
  const feasible = landBudget >= landValue;

  // オーナー取得建物価値（下限0で負値を防ぐ）
  const ownerAcquisitionValue = Math.max(0, Math.min(landValue, landBudget));
  const ownerUnitArea = ownerAcquisitionValue / salesPricePerM2;

  // 年次キャッシュフロー計算
  const annualCF: AnnualCashFlow[] = [];
  let npv = 0;
  let cumulativeCF = 0;

  // 工期中のCF（ゼロ）
  for (let year = 1; year <= constructionYears; year++) {
    annualCF.push({ year, cf: 0, cumulative: 0 });
  }

  // 竣工時の取得
  const acquisitionYear = constructionYears + 1;

  // 不成立の場合はCFを0にするが、NPVには不足額を反映
  if (!feasible || ownerAcquisitionValue === 0) {
    annualCF.push({ year: acquisitionYear, cf: 0, cumulative: 0 });
    // 不足額をNPVに反映（意思決定のため）
    npv = landBudget - landValue;
  } else if (sellAfterAcquisition) {
    // 住戸を即売却するケース
    const saleCF = ownerAcquisitionValue;
    cumulativeCF = saleCF;
    annualCF.push({ year: acquisitionYear, cf: saleCF, cumulative: cumulativeCF });
    npv += saleCF / Math.pow(1 + discountRate, acquisitionYear);
  } else {
    // 住戸を賃貸するケース
    const annualRent = ownerUnitArea * unitRentPerM2 * 12;
    const annualTax = ownerAcquisitionValue * taxRateFixedAsset;
    const annualMaintenance = ownerAcquisitionValue * maintenanceRate;
    const netAnnualCF = annualRent - annualTax - annualMaintenance;

    // 竣工時は取得のみ（資産化）
    annualCF.push({ year: acquisitionYear, cf: 0, cumulative: 0 });

    // 運用期間（30年想定）
    const operationYears = 30;
    for (let year = acquisitionYear + 1; year <= acquisitionYear + operationYears; year++) {
      cumulativeCF += netAnnualCF;
      annualCF.push({ year, cf: netAnnualCF, cumulative: cumulativeCF });
      npv += netAnnualCF / Math.pow(1 + discountRate, year);
    }
  }

  // IRR計算
  const irr = calculateIRR(annualCF, 0);

  // 回収年数
  const paybackYear = findPaybackYear(annualCF);

  // 注記
  const notes: string[] = [];
  notes.push(`計画延床${Math.round(plannedGfa)}㎡、GDV${Math.round(gdv / 1000000)}百万円。`);
  notes.push(`総コスト${Math.round(totalCost / 1000000)}百万円、ディベ利益${Math.round(developerProfit / 1000000)}百万円。`);
  if (feasible) {
    notes.push(`✓ 成立可能。オーナー取得価値${Math.round(ownerAcquisitionValue / 1000000)}百万円（約${Math.round(ownerUnitArea)}㎡）。`);
    if (sellAfterAcquisition) {
      notes.push(`竣工後に住戸を売却して現金化。`);
    } else {
      notes.push(`取得住戸を賃貸運用（想定賃料${Math.round(unitRentPerM2 * ownerUnitArea)}円/月）。`);
    }
  } else {
    const deficit = landValue - landBudget;
    notes.push(`⚠️ 不成立。土地対価${Math.round(landBudget / 1000000)}百万円 < 土地価値${Math.round(landValue / 1000000)}百万円。`);
    notes.push(`不足額: ${Math.round(deficit / 1000000)}百万円（${(deficit / landValue * 100).toFixed(1)}%）`);

    // 改善案の計算（ゼロ除算を防ぐ）
    const improvementSuggestions: string[] = [];

    // 売却単価引き上げ案（計画延床が正の場合のみ）
    if (plannedGfa > 0) {
      const requiredPriceIncrease = deficit / plannedGfa;
      improvementSuggestions.push(`売却単価を${Math.round(requiredPriceIncrease / 1000)}千円/㎡以上引き上げ`);
    }

    // コスト削減案（総コストが正の場合のみ）
    if (totalCost > 0) {
      const requiredCostReduction = (deficit / totalCost * 100).toFixed(1);
      improvementSuggestions.push(`コスト${requiredCostReduction}%削減`);
    }

    if (improvementSuggestions.length > 0) {
      notes.push(`💡 改善案: ${improvementSuggestions.join('、または')}が必要。`);
    } else {
      notes.push(`💡 改善案: 入力条件を見直してください（計画延床またはコストが不正です）。`);
    }
  }

  return {
    npv,
    irr,
    paybackYear,
    annualCF,
    feasible,
    notes,
    initialInvestment: 0,
    totalRevenue: sellAfterAcquisition
      ? ownerAcquisitionValue
      : annualCF.reduce((sum, cf) => sum + Math.max(0, cf.cf), 0),
    totalCost: annualCF.reduce((sum, cf) => sum + Math.max(0, -cf.cf), 0),
  };
}

/**
 * IRR計算（簡易版：ニュートン法による近似）
 */
function calculateIRR(cashFlows: AnnualCashFlow[], initialInvestment: number): number | undefined {
  const hasPositive = cashFlows.some(cf => cf.cf > 0);
  const hasNegative = initialInvestment < 0 || cashFlows.some(cf => cf.cf < 0);

  if (!hasPositive || !hasNegative) {
    return undefined;
  }

  let rate = 0.1;
  for (let i = 0; i < 20; i++) {
    let npv = -initialInvestment;
    let derivative = 0;

    cashFlows.forEach(cf => {
      const factor = Math.pow(1 + rate, cf.year);
      npv += cf.cf / factor;
      derivative -= (cf.cf * cf.year) / (factor * (1 + rate));
    });

    if (Math.abs(npv) < 0.01) {
      return rate;
    }

    rate = rate - npv / derivative;

    if (rate < -0.99 || rate > 10) {
      return undefined;
    }
  }

  return rate;
}

/**
 * 回収年数を計算
 */
function findPaybackYear(cashFlows: AnnualCashFlow[]): number | undefined {
  for (const cf of cashFlows) {
    // 累積CFが正の値になった年を回収年数とする（0は含まない）
    if (cf.cumulative && cf.cumulative > 0) {
      return cf.year;
    }
  }
  return undefined;
}
