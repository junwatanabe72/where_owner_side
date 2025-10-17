import React, { useState } from 'react';
import { Eye, DollarSign } from 'lucide-react';
import { Asset, Proposal } from '../../../types';
import {
  getKindLabel,
  getBadgeColor,
  formatProposalPrice,
  calculateProposalMetrics,
} from '../../../utils';
import { formatDate } from '../../../utils/formatters';
import ProposalDetailView from '../../ProposalDetailView';

interface ProposalSectionProps {
  asset: Asset;
  proposals: Proposal[];
}

const ProposalSection: React.FC<ProposalSectionProps> = ({ asset, proposals }) => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleViewDetail = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setShowDetail(true);
  };

  if (showDetail && selectedProposal) {
    return (
      <ProposalDetailView
        proposal={selectedProposal}
        asset={asset}
        onBack={() => {
          setShowDetail(false);
          setSelectedProposal(null);
        }}
        onShowHtml={selectedProposal.htmlContent ? () => {} : undefined}
      />
    );
  }

  return (
    <div className="pt-2 border-t">
      <div className="font-semibold text-sm mb-3">プロからの提案</div>
      {proposals.length === 0 ? (
        <div className="text-xs text-slate-500">
          この物件への提案はまだありません。
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left font-medium text-gray-500">
                  種別
                </th>
                <th className="px-2 py-2 text-left font-medium text-gray-500">
                  提案者
                </th>
                <th className="px-2 py-2 text-left font-medium text-gray-500">
                  価格/賃料
                </th>
                <th className="px-2 py-2 text-left font-medium text-gray-500">
                  NPV(10年)
                </th>
                <th className="px-2 py-2 text-left font-medium text-gray-500">
                  総合スコア
                </th>
                <th className="px-2 py-2 text-left font-medium text-gray-500">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {proposals.map((proposal) => {
                const metrics = calculateProposalMetrics(proposal, asset);
                return (
                <tr key={proposal.id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-medium border ${getBadgeColor(
                        proposal.kind
                      )}`}
                    >
                      {getKindLabel(proposal.kind)}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="font-medium text-gray-900">
                      {proposal.company}
                    </div>
                    <div className="text-gray-500">
                      {formatDate(proposal.created_at)}
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="font-semibold">
                      {formatProposalPrice(proposal)}
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center">
                      <DollarSign className="w-3 h-3 text-green-500 mr-1" />
                      <span>
                        ¥{metrics.npv.toLocaleString('ja-JP')}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="text-sm font-semibold text-gray-900">
                      {metrics.overallScore}点
                    </div>
                    <div className="text-[10px] text-gray-500">
                      収益{metrics.returnScore} / 安定{metrics.stabilityScore}
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => handleViewDetail(proposal)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      提案を見る
                    </button>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProposalSection;
