export type ProposalKind = 'sale' | 'lease' | 'exchange' | 'groundlease' | 'other';

export interface Proposal {
  id: string | number;
  kind: ProposalKind;
  company: string;
  created_at: string;
  target?: string;
  chiban?: string;
  price?: number;
  monthly_rent?: number;
  annual_ground_rent?: number;
  term_years?: number;
  ratio?: number;
  description?: string;
  benefits?: string[];
  risks?: string[];
  summary?: string;
  attachments?: string[];
  confidence?: number;
  details?: string;
  htmlContent?: string;
}
