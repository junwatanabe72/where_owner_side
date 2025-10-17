import {
  Asset,
  Proposal,
  ProposalKind,
  ProposalMetrics,
  SaleProposal,
  LeaseProposal,
  ExchangeProposal,
  GroundLeaseProposal,
  OtherProposal,
} from '../types';

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const toScore = (value: number, best: number, worst: number) => {
  if (best === worst) return 50;
  const ratio = (value - worst) / (best - worst);
  return clamp(Math.round(ratio * 100));
};

const getAssetValuation = (asset?: Partial<Asset>): number | undefined => {
  if (!asset) return undefined;
  return asset.valuationMedian ?? asset.valuationMax ?? asset.valuationMin;
};

const confidenceScore = (proposal: Proposal) => clamp(proposal.confidence ?? 70);

const round = (value: number, digits = 0) => {
  const factor = Math.pow(10, digits);
  return Math.round(value * factor) / factor;
};

const calculateSaleNPV = (proposal: SaleProposal) => {
  const transactionCosts =
    (proposal.costs?.broker ?? 0) +
    (proposal.costs?.taxes ?? 0) +
    (proposal.costs?.others ?? 0);
  return Math.max(0, Math.round(proposal.price - transactionCosts));
};

const calculateLeaseNPV = (proposal: LeaseProposal) => {
  const discountRate = 0.06;
  const term = Math.min(proposal.term_years ?? 0, 15);
  const annualGross = proposal.monthly_rent * 12;
  const netAnnual = annualGross * (1 - (proposal.opex_ratio ?? 0.25));
  if (term <= 0) return 0;
  const pvFactor = (1 - Math.pow(1 + discountRate, -term)) / discountRate;
  const freeRentValue = proposal.monthly_rent * (proposal.free_rent_m ?? 0);
  const tenantImprovements = proposal.ti ?? 0;
  return Math.round(netAnnual * pvFactor - freeRentValue - tenantImprovements);
};

const calculateGroundLeaseNPV = (proposal: GroundLeaseProposal) => {
  const discountRate = 0.055;
  const term = Math.min(proposal.term_years, 30);
  const netAnnual = proposal.annual_ground_rent * (1 - (proposal.expense_rate ?? 0.08));
  const pvFactor = (1 - Math.pow(1 + discountRate, -term)) / discountRate;
  const keyMoney = proposal.key_money ?? 0;
  return Math.round(netAnnual * pvFactor + keyMoney);
};

const calculateExchangeNPV = (proposal: ExchangeProposal, assetValuation?: number) => {
  if (!assetValuation) return 0;
  const discountRate = 0.06;
  const assumedRent = (proposal.assumed_rent_psm ?? 0) * proposal.acquired_area_m2 * 12;
  const netAnnual = assumedRent * (1 - (proposal.opex_ratio ?? 0.22));
  const term = 20; // 20年分のバリューを簡易評価

  // 建替え完了までの先送りディスカウント
  let delayYears = 2;
  if (proposal.completion_ym) {
    const completionDate = new Date(`${proposal.completion_ym}-01`);
    const baseDate = new Date('2025-01-01');
    const diff = completionDate.getTime() - baseDate.getTime();
    delayYears = Math.max(0, diff / (365.25 * 24 * 60 * 60 * 1000));
  }

  const pvFactor = (1 - Math.pow(1 + discountRate, -term)) / discountRate;
  const deferredFactor = Math.pow(1 + discountRate, -delayYears);
  return Math.round(netAnnual * pvFactor * deferredFactor);
};

const calculateOtherNPV = (proposal: OtherProposal) => {
  if (!proposal.term_years) return 0;
  const discountRate = 0.07;
  const netAnnual = (proposal.revenue_year ?? 0) * (1 - (proposal.opex_ratio ?? 0.3));
  const pvFactor = (1 - Math.pow(1 + discountRate, -proposal.term_years)) / discountRate;
  const residual = (proposal.capex ?? 0) * (proposal.residual_value_rate ?? 0) / Math.pow(1 + discountRate, proposal.term_years);
  const removalCost = proposal.removal_cost ?? 0;
  return Math.round(netAnnual * pvFactor - (proposal.capex ?? 0) - removalCost + residual);
};

export const calculateNPV = (proposal: Proposal, asset?: Partial<Asset>): number => {
  switch (proposal.kind) {
    case 'sale':
      return calculateSaleNPV(proposal);
    case 'lease':
      return Math.max(0, calculateLeaseNPV(proposal));
    case 'groundlease':
      return Math.max(0, calculateGroundLeaseNPV(proposal));
    case 'exchange':
      return Math.max(0, calculateExchangeNPV(proposal, getAssetValuation(asset)));
    case 'other':
      return Math.max(0, calculateOtherNPV(proposal));
    default:
      return 0;
  }
};

const buildSaleMetrics = (proposal: SaleProposal, asset?: Partial<Asset>): ProposalMetrics => {
  const valuation = getAssetValuation(asset);
  const discountRate = valuation ? (valuation - proposal.price) / valuation : undefined;
  const npv = calculateSaleNPV(proposal);
  const discountScore =
    discountRate !== undefined ? toScore(discountRate, 0.15, -0.05) : 55;
  const closingDays = proposal.days_to_close ?? 90;
  const closingScore = clamp(100 - (closingDays - 45) * 0.5, 35, 95);
  const baseConfidence = confidenceScore(proposal);
  const stabilityScore = clamp(closingScore * 0.6 + baseConfidence * 0.4, 40, 95);
  const liquidityScore = clamp(85 - Math.max(0, closingDays - 60) * 0.3, 50, 95);
  const growthScore = clamp(discountRate !== undefined ? 35 - discountRate * 40 : 35, 10, 60);

  const highlights: string[] = [
    `想定手取り ${npv.toLocaleString('ja-JP')}円`,
  ];
  if (discountRate !== undefined) {
    highlights.push(`査定比ディスカウント ${round(discountRate * 100, 1)}%`);
  }
  highlights.push(`決済まで約${closingDays}日`);

  return {
    npv,
    overallScore: Math.round(discountScore * 0.45 + stabilityScore * 0.25 + liquidityScore * 0.2 + growthScore * 0.1),
    returnScore: discountScore,
    stabilityScore,
    liquidityScore,
    growthScore,
    paybackYears: 0,
    highlights,
  };
};

const buildLeaseMetrics = (proposal: LeaseProposal, asset?: Partial<Asset>): ProposalMetrics => {
  const valuation = getAssetValuation(asset);
  const npv = Math.max(0, calculateLeaseNPV(proposal));
  const annualGross = proposal.monthly_rent * 12;
  const netAnnual = annualGross * (1 - (proposal.opex_ratio ?? 0.25));
  const netYield = valuation ? netAnnual / valuation : undefined;
  const returnScore = netYield !== undefined ? toScore(netYield, 0.06, 0.03) : 60;
  const occupancyScore = clamp(((proposal.occupancy ?? 0.9) * 100) - 5, 40, 95);
  const term = proposal.term_years;
  const termStability = clamp(50 + term * 3, 50, 95);
  const stabilityBase = clamp((occupancyScore * 0.6) + (confidenceScore(proposal) * 0.4), 45, 95);
  const stabilityComposite = clamp((stabilityBase + termStability) / 2, 45, 95);
  const liquidityScore = clamp(70 - term * 2 - (proposal.free_rent_m ?? 0) * 1.5, 20, 80);
  const growthScore = clamp(40 + (netYield ?? 0.045) * 600 - term, 25, 80);

  const highlights: string[] = [
    `年間ネット賃料 ${Math.round(netAnnual).toLocaleString('ja-JP')}円`,
    `契約期間 ${term}年`,
  ];
  if (netYield !== undefined) {
    highlights.push(`実効利回り ${round(netYield * 100, 2)}%`);
  }

  return {
    npv,
    netYield,
    paybackYears: netAnnual > 0 ? round((proposal.ti ?? 0) / netAnnual, 1) : undefined,
    overallScore: Math.round(returnScore * 0.4 + stabilityComposite * 0.3 + liquidityScore * 0.15 + growthScore * 0.15),
    returnScore,
    stabilityScore: stabilityComposite,
    liquidityScore,
    growthScore,
    highlights,
  };
};

const buildGroundLeaseMetrics = (proposal: GroundLeaseProposal, asset?: Partial<Asset>): ProposalMetrics => {
  const valuation = getAssetValuation(asset);
  const npv = Math.max(0, calculateGroundLeaseNPV(proposal));
  const netAnnual = proposal.annual_ground_rent * (1 - (proposal.expense_rate ?? 0.08));
  const netYield = valuation ? netAnnual / valuation : undefined;
  const returnScore = netYield !== undefined ? toScore(netYield, 0.05, 0.025) : 65;
  const stabilityScore = clamp(70 + (proposal.term_years / 5), 70, 96);
  const liquidityScore = clamp(40 - (proposal.term_years / 5), 10, 55);
  const growthScore = clamp(35 + (proposal.revision?.index === 'CPI' ? 10 : 0), 25, 70);

  const highlights: string[] = [
    `年間地代 ${proposal.annual_ground_rent.toLocaleString('ja-JP')}円`,
    `契約期間 ${proposal.term_years}年`,
  ];
  if (proposal.key_money) {
    highlights.push(`一時金 ${proposal.key_money.toLocaleString('ja-JP')}円`);
  }
  if (netYield !== undefined) {
    highlights.push(`実効利回り ${round(netYield * 100, 2)}%`);
  }

  return {
    npv,
    netYield,
    overallScore: Math.round(returnScore * 0.35 + stabilityScore * 0.4 + liquidityScore * 0.1 + growthScore * 0.15),
    returnScore,
    stabilityScore,
    liquidityScore,
    growthScore,
    paybackYears: undefined,
    highlights,
  };
};

const buildExchangeMetrics = (proposal: ExchangeProposal, asset?: Partial<Asset>): ProposalMetrics => {
  const valuation = getAssetValuation(asset);
  const npv = Math.max(0, calculateExchangeNPV(proposal, valuation));
  const assumedRent = (proposal.assumed_rent_psm ?? 0) * proposal.acquired_area_m2 * 12;
  const netAnnual = assumedRent * (1 - (proposal.opex_ratio ?? 0.22));
  const netYield = valuation ? netAnnual / valuation : undefined;
  const returnScore = netYield !== undefined ? toScore(netYield, 0.07, 0.035) : 65;
  const stabilityScore = clamp(55 + confidenceScore(proposal) * 0.4, 45, 90);
  const liquidityScore = clamp(30 - (proposal.completion_ym ? 5 : 0), 15, 50);
  const growthScore = clamp(70 + (proposal.ratio - 0.5) * 80, 55, 95);

  const highlights: string[] = [
    `取得床 ${proposal.acquired_area_m2.toLocaleString('ja-JP')}㎡`,
    `交換比率 ${round(proposal.ratio * 100, 1)}%`,
  ];
  if (proposal.completion_ym) {
    highlights.push(`完成予定 ${proposal.completion_ym}`);
  }
  if (netYield !== undefined) {
    highlights.push(`想定実効利回り ${round(netYield * 100, 2)}%`);
  }

  return {
    npv,
    netYield,
    overallScore: Math.round(returnScore * 0.4 + stabilityScore * 0.2 + liquidityScore * 0.1 + growthScore * 0.3),
    returnScore,
    stabilityScore,
    liquidityScore,
    growthScore,
    paybackYears: undefined,
    highlights,
  };
};

const buildOtherMetrics = (proposal: OtherProposal, asset?: Partial<Asset>): ProposalMetrics => {
  const npv = Math.max(0, calculateOtherNPV(proposal));
  const valuation = getAssetValuation(asset);
  const netAnnual = (proposal.revenue_year ?? 0) * (1 - (proposal.opex_ratio ?? 0.3));
  const netYield = valuation ? netAnnual / valuation : undefined;
  const roi = proposal.capex ? netAnnual / proposal.capex : undefined;
  const returnScore = roi !== undefined ? toScore(roi, 0.25, 0.05) : 55;
  const stabilityScore = clamp(55 + (proposal.occupancy ?? 0.85) * 30 + confidenceScore(proposal) * 0.2, 35, 90);
  const liquidityScore = clamp(60 - proposal.term_years * 3, 20, 70);
  const growthScore = clamp(45 + (proposal.subkind === 'solar' || proposal.subkind === 'ev' ? 10 : 0), 30, 80);

  const highlights: string[] = [];
  if (proposal.revenue_year) {
    highlights.push(`年間売上 ${proposal.revenue_year.toLocaleString('ja-JP')}円`);
  }
  if (proposal.capex) {
    highlights.push(`初期投資 ${proposal.capex.toLocaleString('ja-JP')}円`);
  }
  highlights.push(`契約期間 ${proposal.term_years}年`);
  if (roi !== undefined) {
    highlights.push(`税引前ROI ${round(roi * 100, 1)}%`);
  }

  return {
    npv,
    netYield,
    paybackYears: roi ? round(1 / roi, 1) : undefined,
    overallScore: Math.round(returnScore * 0.4 + stabilityScore * 0.25 + liquidityScore * 0.2 + growthScore * 0.15),
    returnScore,
    stabilityScore,
    liquidityScore,
    growthScore,
    highlights,
  };
};

export const calculateProposalMetrics = (
  proposal: Proposal,
  asset?: Partial<Asset>
): ProposalMetrics => {
  switch (proposal.kind) {
    case 'sale':
      return buildSaleMetrics(proposal, asset);
    case 'lease':
      return buildLeaseMetrics(proposal, asset);
    case 'groundlease':
      return buildGroundLeaseMetrics(proposal, asset);
    case 'exchange':
      return buildExchangeMetrics(proposal, asset);
    case 'other':
      return buildOtherMetrics(proposal, asset);
    default:
      return {
        npv: 0,
        overallScore: 50,
        returnScore: 50,
        stabilityScore: 50,
        liquidityScore: 50,
        growthScore: 50,
        highlights: [],
      };
  }
};

export const getKindLabel = (kind: ProposalKind): string => {
  const labels: Record<ProposalKind, string> = {
    sale: '売却',
    lease: '賃貸',
    exchange: '等価交換',
    groundlease: '借地',
    other: 'その他',
  };
  return labels[kind] || kind;
};

export const getBadgeColor = (kind: ProposalKind): string => {
  const colors: Record<ProposalKind, string> = {
    sale: 'bg-red-100 text-red-700 border-red-300',
    lease: 'bg-purple-100 text-purple-700 border-purple-300',
    exchange: 'bg-blue-100 text-blue-700 border-blue-300',
    groundlease: 'bg-green-100 text-green-700 border-green-300',
    other: 'bg-gray-100 text-gray-700 border-gray-300',
  };
  return colors[kind] || 'bg-gray-100 text-gray-700 border-gray-300';
};

export const formatProposalPrice = (proposal: Proposal): string => {
  switch (proposal.kind) {
    case 'sale':
      return `¥${proposal.price.toLocaleString('ja-JP')}`;
    case 'lease':
      return `¥${proposal.monthly_rent.toLocaleString('ja-JP')}/月`;
    case 'groundlease':
      return `¥${proposal.annual_ground_rent.toLocaleString('ja-JP')}/年`;
    case 'exchange':
      return `等価交換 ${Math.round(proposal.ratio * 100)}%`;
    case 'other':
      if (proposal.revenue_year) {
        return `年間収益 ¥${proposal.revenue_year.toLocaleString('ja-JP')}`;
      }
      return proposal.summary ?? 'その他提案';
    default:
      return '-';
  }
};

export const filterProposalsByAsset = (
  proposals: Proposal[],
  assetAddress: string | undefined
): Proposal[] => {
  if (!assetAddress) return [];
  return proposals.filter((p) => p.target && assetAddress.includes(p.target));
};
