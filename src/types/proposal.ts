export type ProposalKind = 'sale' | 'lease' | 'exchange' | 'groundlease' | 'other';

export interface ProposalMetrics {
  npv: number;
  /** 実効利回り（年間ネット収益 ÷ 資産評価額） */
  netYield?: number;
  /** キャッシュフローが初期投資を回収するまでの概算年数 */
  paybackYears?: number;
  /** 0-100スケールの総合評価スコア */
  overallScore: number;
  /** 収益性の観点スコア（0-100） */
  returnScore: number;
  /** 安定性・確実性の観点スコア（0-100） */
  stabilityScore: number;
  /** 流動性・柔軟性の観点スコア（0-100） */
  liquidityScore: number;
  /** 将来価値・成長性の観点スコア（0-100） */
  growthScore: number;
  /** スコアの根拠となるハイライト */
  highlights: string[];
}

export interface ProposalBase {
  id: string | number;
  kind: ProposalKind;
  target: string;
  chiban?: string;
  company: string;
  created_at: string;
  summary?: string;
  description?: string;
  benefits?: string[];
  risks?: string[];
  attachments?: string[];
  confidence?: number;
  details?: string;
  htmlContent?: string;
  metrics?: ProposalMetrics;
  // 共通的に参照される可用フィールド（kindによって有効範囲が異なる）
  price?: number;
  monthly_rent?: number;
  annual_ground_rent?: number;
  term_years?: number;
  ratio?: number;
  completion_ym?: string;
  days_to_close?: number;
  opex_ratio?: number;
}

export interface SaleProposal extends ProposalBase {
  kind: 'sale';
  mode?: 'developer' | 'principal';
  price: number;
  costs?: { broker?: number; taxes?: number; others?: number };
  days_to_close?: number;
}

export interface LeaseProposal extends ProposalBase {
  kind: 'lease';
  monthly_rent: number;
  common_fee?: number;
  term_years: number;
  free_rent_m?: number;
  ti?: number;
  occupancy?: number;
  opex_ratio?: number;
  security_deposit?: number;
}

export interface ExchangeProposal extends ProposalBase {
  kind: 'exchange';
  ratio: number;
  acquired_area_m2: number;
  completion_ym: string;
  post_strategy?: 'sell' | 'lease' | 'mix';
  assumed_rent_psm?: number;
  opex_ratio?: number;
}

export interface GroundLeaseProposal extends ProposalBase {
  kind: 'groundlease';
  lease_type: 'fixed' | 'ordinary';
  annual_ground_rent: number;
  key_money?: number;
  deposit?: number;
  term_years: number;
  revision?: {
    every_years: number;
    index: 'CPI' | 'none';
    cap?: number;
    floor?: number;
  };
  reversion: {
    mode: 'vacant_land' | 'structure_reversion';
    residual_value_rate?: number;
  };
  expense_rate?: number;
}

export interface OtherProposal extends ProposalBase {
  kind: 'other';
  subkind: 'parking' | 'signage' | 'solar' | 'ev' | 'storage' | 'event';
  capex?: number;
  opex_ratio?: number;
  term_years: number;
  unit?: { count?: number; price?: number };
  occupancy?: number;
  revenue_year?: number;
  removal_cost?: number;
  residual_value_rate?: number;
}

export type Proposal =
  | SaleProposal
  | LeaseProposal
  | ExchangeProposal
  | GroundLeaseProposal
  | OtherProposal;
