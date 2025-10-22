/**
 * 一括借上計算モジュール
 *
 * 事業者が土地を一括賃借し、保証賃料を支払うシナリオのシミュレーション
 */

import type { MasterLeaseInput, SimulationResult, AnnualCashFlow } from '../../types/simulation';

/**
 * 一括借上のシミュレーション実行
 */
export function calculateMasterLease(input: MasterLeaseInput): SimulationResult {
  const {
    landAreaM2,
    landUnitPrice,
    baseRentPerM2PerMonth,
    termYears,
    escalatorRate = 0,
    initialCapexOwner = 0,
    terminalCost = 0,
    variableCostRate = 0,
    discountRate,
    taxRateFixedAsset = 0.017,
  } = input;

  // 基本計算
  const landValue = landAreaM2 * landUnitPrice;
  const initialAnnualRent = landAreaM2 * baseRentPerM2PerMonth * 12;

  // 年次キャッシュフロー計算
  const annualCF: AnnualCashFlow[] = [];
  let npv = -initialCapexOwner; // 初期整備費（マイナス）
  let cumulativeCF = -initialCapexOwner;

  for (let year = 1; year <= termYears; year++) {
    // 賃料（エスカレーション適用）
    const rent = initialAnnualRent * Math.pow(1 + escalatorRate, year - 1);

    // 税金
    const tax = landValue * taxRateFixedAsset;

    // 変動費
    const variableCost = rent * variableCostRate;

    // 年次CF
    const yearCF = rent - tax - variableCost;
    cumulativeCF += yearCF;

    annualCF.push({ year, cf: yearCF, cumulative: cumulativeCF });

    // NPV計算
    npv += yearCF / Math.pow(1 + discountRate, year);
  }

  // 期末原状回復費用
  if (terminalCost > 0) {
    const terminalYear = termYears;
    npv -= terminalCost / Math.pow(1 + discountRate, terminalYear);
    cumulativeCF -= terminalCost;

    // 最終年のCFに反映
    if (annualCF.length > 0) {
      const lastCF = annualCF[annualCF.length - 1];
      lastCF.cf -= terminalCost;
      lastCF.cumulative = cumulativeCF;
    }
  }

  // IRR計算（簡易版）
  const irr = calculateIRR(annualCF, initialCapexOwner);

  // 回収年数
  const paybackYear = findPaybackYear(annualCF);

  // 実現可否判定
  const feasible = npv > 0 && baseRentPerM2PerMonth > 0;

  // 期待利回り（簡易版：初年度賃料 / 土地評価額）
  const expectedYield = initialAnnualRent / landValue;

  // 注記
  const notes: string[] = [];
  notes.push(`契約期間${termYears}年、保証賃料${baseRentPerM2PerMonth.toLocaleString()}円/㎡/月。`);
  notes.push(`年間賃料収入${Math.round(initialAnnualRent / 1000000)}百万円（初年度）。`);
  if (escalatorRate > 0) {
    notes.push(`年次${(escalatorRate * 100).toFixed(2)}%のエスカレーション設定。`);
  }
  if (initialCapexOwner > 0) {
    notes.push(`初期整備費${Math.round(initialCapexOwner / 1000000)}百万円（オーナー負担）。`);
  }
  if (terminalCost > 0) {
    notes.push(`期末原状回復費用${Math.round(terminalCost / 1000000)}百万円を考慮。`);
  }
  notes.push(`期待利回り${(expectedYield * 100).toFixed(2)}%。`);
  if (!feasible) {
    notes.push('⚠️ 経済性が低い可能性があります。賃料条件や初期投資の見直しを検討してください。');
  }

  return {
    npv,
    irr,
    paybackYear,
    annualCF,
    feasible,
    notes,
    initialInvestment: initialCapexOwner,
    totalRevenue: annualCF.reduce((sum, cf) => sum + Math.max(0, cf.cf), 0),
    // terminalCostはannualCFの最終年に既に含まれているため、ここでは加算しない
    totalCost: annualCF.reduce((sum, cf) => sum + Math.max(0, -cf.cf), 0) + initialCapexOwner,
  };
}

/**
 * IRR計算（簡易版：ニュートン法による近似）
 */
function calculateIRR(cashFlows: AnnualCashFlow[], initialInvestment: number): number | undefined {
  const hasPositive = cashFlows.some(cf => cf.cf > 0);
  const hasNegative = initialInvestment > 0 || cashFlows.some(cf => cf.cf < 0);

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
    if (cf.cumulative && cf.cumulative >= 0) {
      return cf.year;
    }
  }
  return undefined;
}
