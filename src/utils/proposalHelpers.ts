import { Proposal, ProposalKind } from '../types';

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
  if (proposal.kind === 'sale' && proposal.price) {
    return `¥${proposal.price.toLocaleString('ja-JP')}`;
  }
  if (proposal.kind === 'lease' && proposal.monthly_rent) {
    return `¥${proposal.monthly_rent.toLocaleString('ja-JP')}/月`;
  }
  if (proposal.kind === 'groundlease' && proposal.annual_ground_rent) {
    return `¥${proposal.annual_ground_rent.toLocaleString('ja-JP')}/年`;
  }
  if (proposal.kind === 'exchange') {
    return `等価交換${proposal.ratio ? ` ${proposal.ratio}%` : ''}`;
  }
  return '-';
};

export const calculateNPV = (proposal: Proposal): number => {
  if (proposal.kind === 'sale' && proposal.price) {
    return Math.round(proposal.price * 0.85);
  }
  if (proposal.kind === 'lease' && proposal.monthly_rent && proposal.term_years) {
    return Math.round(proposal.monthly_rent * 12 * proposal.term_years * 0.7);
  }
  if (proposal.kind === 'groundlease' && proposal.annual_ground_rent && proposal.term_years) {
    return Math.round(proposal.annual_ground_rent * proposal.term_years * 0.75);
  }
  return 0;
};

export const filterProposalsByAsset = (
  proposals: Proposal[],
  assetAddress: string | undefined
): Proposal[] => {
  if (!assetAddress) return [];
  return proposals.filter(
    (p) => p.target && assetAddress.includes(p.target)
  );
};