/**
 * 定期借地権マンション（定借マンション）計算モジュール
 *
 * 土地に定期借地権を設定し、長期的に地代収入を得るシナリオのシミュレーション
 */

import type { LeaseholdCondoInput, SimulationResult, AnnualCashFlow } from '../../types/simulation';

/**
 * 定期借地権マンションのシミュレーション実行
 */
export function calculateLeaseholdCondo(input: LeaseholdCondoInput): SimulationResult {
  const {
    landAreaM2,
    landUnitPrice,
    leaseYears,
    groundRentYield,
    escalatorRate,
    upfrontPremium = 0,
    ownerUnitM2 = 0,
    ownerUnitRentPerM2 = 0,
    discountRate,
    taxRateFixedAsset = 0.017,
    maintenanceRate = 0.005,
  } = input;

  // 基本計算
  const landValue = landAreaM2 * landUnitPrice;
  const initialGroundRent = landValue * groundRentYield;

  // 年次キャッシュフロー計算
  const annualCF: AnnualCashFlow[] = [];
  let npv = 0;
  let cumulativeCF = 0;

  // 年0: 一時金受領（プラスのキャッシュフロー）
  if (upfrontPremium > 0) {
    cumulativeCF = upfrontPremium;
    annualCF.push({ year: 0, cf: upfrontPremium, cumulative: cumulativeCF });
    npv += upfrontPremium; // 割引不要（現在価値）
  }

  for (let year = 1; year <= leaseYears; year++) {
    // 地代（エスカレーション適用）
    const groundRent = initialGroundRent * Math.pow(1 + escalatorRate, year - 1);

    // オーナー住戸の賃料収入（取得した場合）
    const ownerUnitRevenue = ownerUnitM2 > 0 && ownerUnitRentPerM2 > 0
      ? ownerUnitM2 * ownerUnitRentPerM2 * 12
      : 0;

    // 税金・維持費
    const tax = landValue * taxRateFixedAsset;
    const maintenance = landValue * maintenanceRate;

    // 年次CF
    const yearCF = groundRent + ownerUnitRevenue - tax - maintenance;
    cumulativeCF += yearCF;

    annualCF.push({ year, cf: yearCF, cumulative: cumulativeCF });

    // NPV計算
    npv += yearCF / Math.pow(1 + discountRate, year);
  }

  // IRR計算（初期投資は0、一時金はCF配列に含まれている）
  const irr = calculateIRR(annualCF, 0);

  // 回収年数
  const paybackYear = findPaybackYear(annualCF);

  // 実現可否判定
  const feasible = npv > 0 && groundRentYield >= 0.02 && groundRentYield <= 0.06;

  // 注記
  const notes: string[] = [];
  notes.push(`借地期間${leaseYears}年、期間終了時に更地返還を前提としています。`);
  notes.push(`地代利回り${(groundRentYield * 100).toFixed(2)}%、年次${(escalatorRate * 100).toFixed(2)}%のエスカレーション設定。`);
  if (upfrontPremium > 0) {
    notes.push(`一時金${(upfrontPremium / 1000000).toFixed(1)}百万円を初期に受領。`);
  }
  if (ownerUnitM2 > 0) {
    notes.push(`オーナー住戸${ownerUnitM2}㎡を取得し、賃貸収入を計上。`);
  }
  if (!feasible) {
    notes.push('⚠️ 地代利回りが市場レンジ（2-6%）外、または経済性が低い可能性があります。');
  }

  return {
    npv,
    irr,
    paybackYear,
    annualCF,
    feasible,
    notes,
    initialInvestment: 0,
    totalRevenue: annualCF.reduce((sum, cf) => sum + Math.max(0, cf.cf), 0),
    totalCost: annualCF.reduce((sum, cf) => sum + Math.max(0, -cf.cf), 0),
  };
}

/**
 * IRR計算（簡易版：ニュートン法による近似）
 */
function calculateIRR(cashFlows: AnnualCashFlow[], initialInvestment: number): number | undefined {
  // 初期投資がない、またはCFが全て同符号の場合は計算不可
  const hasPositive = cashFlows.some(cf => cf.cf > 0);
  const hasNegative = initialInvestment < 0 || cashFlows.some(cf => cf.cf < 0);

  if (!hasPositive || !hasNegative) {
    return undefined;
  }

  // ニュートン法で IRR を近似（最大20回の反復）
  let rate = 0.1; // 初期値 10%
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

    // 収束しない場合は打ち切り
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
