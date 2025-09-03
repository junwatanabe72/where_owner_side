export type ProposalKind = 'sale' | 'lease' | 'exchange' | 'groundlease' | 'other';

export interface Proposal {
  id: number;
  kind: ProposalKind;
  company: string;
  created_at: string;
  target?: string;
  price?: number;
  monthly_rent?: number;
  annual_ground_rent?: number;
  term_years?: number;
  ratio?: number;
  description?: string;
  benefits?: string[];
  risks?: string[];
}