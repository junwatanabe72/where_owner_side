import React, { useState } from 'react';
import { Eye, DollarSign, FileText } from 'lucide-react';
import { Asset, Proposal } from '../../../types';
import {
  getKindLabel,
  getBadgeColor,
  formatProposalPrice,
  calculateProposalMetrics,
  formatDate
} from '../../../utils';
import ProposalDetailView from '../../ProposalDetailView';
import ProposalComparison from '../../ProposalComparison';
import ProposalHtmlModal from '../ProposalHtmlModal';

interface ProposalsTabProps {
  proposals: Proposal[];
  asset: Asset;
}

const ProposalsTab: React.FC<ProposalsTabProps> = ({ proposals, asset }) => {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);

  const handleViewDetail = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsHtmlModalOpen(false);
    setShowDetail(true);
  };

  const handleOpenHtml = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    if (proposal.htmlContent) {
      setIsHtmlModalOpen(true);
      setShowDetail(false);
    }
  };

  const handleComparisonToggle = (proposalId: string | number) => {
    const id = String(proposalId);
    setSelectedForComparison(prev =>
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleShowComparison = () => {
    const selected = proposals.filter(p => 
      selectedForComparison.includes(String(p.id))
    );
    if (selected.length >= 2) {
      setShowComparison(true);
    }
  };

  if (showDetail && selectedProposal) {
    return (
      <>
        <ProposalDetailView
          proposal={selectedProposal}
          asset={asset}
          onBack={() => {
            setShowDetail(false);
            setSelectedProposal(null);
            setIsHtmlModalOpen(false);
          }}
          onShowHtml={selectedProposal.htmlContent ? () => setIsHtmlModalOpen(true) : undefined}
        />
        {isHtmlModalOpen && selectedProposal.htmlContent && (
          <ProposalHtmlModal
            htmlContent={selectedProposal.htmlContent}
            onClose={() => setIsHtmlModalOpen(false)}
          />
        )}
      </>
    );
  }

  if (showComparison) {
    const selected = proposals.filter(p => 
      selectedForComparison.includes(String(p.id))
    );
    return (
      <ProposalComparison
        asset={asset}
        proposals={selected as any}
        onClose={() => {
          setShowComparison(false);
          setSelectedForComparison([]);
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {selectedForComparison.length >= 2 && (
        <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            {selectedForComparison.length}件の提案を選択中
          </span>
          <button
            onClick={handleShowComparison}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            提案を比較
          </button>
        </div>
      )}

      {proposals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          この物件への提案はまだありません
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  選択
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  種別
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  提案者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  価格/賃料
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NPV(10年)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  総合スコア
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {proposals.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4">
                    <input
                      type="checkbox"
                      checked={selectedForComparison.includes(String(proposal.id))}
                      onChange={() => handleComparisonToggle(proposal.id)}
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getBadgeColor(proposal.kind)}`}>
                      {getKindLabel(proposal.kind)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {proposal.company}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(proposal.created_at)}
                    </div>
                  </td>
                  {(() => {
                    const metrics = calculateProposalMetrics(proposal, asset);
                    return (
                      <>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold">
                            {formatProposalPrice(proposal)}
                          </div>
                          {metrics.highlights[0] && (
                            <div className="text-xs text-gray-500 mt-1">
                              {metrics.highlights[0]}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                            <span>¥{metrics.npv.toLocaleString('ja-JP')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {metrics.overallScore}点
                          </div>
                          <div className="text-xs text-gray-500">
                            収益{metrics.returnScore} / 安定{metrics.stabilityScore}
                          </div>
                        </td>
                      </>
                    );
                  })()}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetail(proposal)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        詳細を見る
                      </button>
                      {proposal.htmlContent && (
                        <button
                          onClick={() => handleOpenHtml(proposal)}
                          className="inline-flex items-center px-3 py-1 border border-blue-200 shadow-sm text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          提案書
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isHtmlModalOpen && selectedProposal?.htmlContent && (
        <ProposalHtmlModal
          htmlContent={selectedProposal.htmlContent}
          onClose={() => setIsHtmlModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProposalsTab;
