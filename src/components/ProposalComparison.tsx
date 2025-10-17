import React, { useState, useMemo } from 'react';
import { Asset, Proposal, ProposalMetrics } from '../types';
import { BarChart, ArrowLeft, CheckSquare, XSquare, X, Eye, TrendingUp, DollarSign, Gauge } from 'lucide-react';
import { calculateProposalMetrics, formatProposalPrice, getKindLabel, getBadgeColor } from '../utils';
import ProposalDetailView from './ProposalDetailView';

interface ProposalComparisonProps {
  proposals: Proposal[];
  asset?: Asset;
  onClose: () => void;
}

const ProposalTable: React.FC<{
  proposals: Proposal[];
  compareIds: string[];
  onCompare: (id: string) => void;
  onViewDetail: (proposal: Proposal) => void;
  metricsMap: Map<string | number, ProposalMetrics>;
  asset?: Asset;
}> = ({ proposals, compareIds, onCompare, onViewDetail, metricsMap, asset }) => {

  const formatTerm = (proposal: Proposal) => {
    if ((proposal.kind === 'lease' || proposal.kind === 'groundlease' || proposal.kind === 'other') && proposal.term_years) {
      return `${proposal.term_years}年`;
    }
    if (proposal.kind === 'exchange' && proposal.completion_ym) return proposal.completion_ym;
    if (proposal.kind === 'sale' && proposal.days_to_close) return `${proposal.days_to_close}日`;
    return '-';
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
              比較
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              種別
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              提案者
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              提案内容
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              価格/賃料
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              期間
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              NPV(10年)
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              リターン指標
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
          {proposals.map((proposal) => {
            const idStr = String(proposal.id);
            const isComparing = compareIds.includes(idStr);
            const metrics = metricsMap.get(proposal.id) ?? calculateProposalMetrics(proposal, asset);
            const yieldDisplay = (() => {
              if (proposal.kind === 'sale') {
                return metrics.highlights.find((h) => h.includes('ディスカウント')) ?? '―';
              }
              if (metrics.netYield !== undefined) {
                return `${(metrics.netYield * 100).toFixed(2)}%`;
              }
              return '―';
            })();
            return (
              <tr key={proposal.id} className={`hover:bg-gray-50 ${isComparing ? 'bg-blue-50' : ''}`}>
                <td className="px-3 py-4 whitespace-nowrap sticky left-0 bg-inherit z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    onCompare(idStr);
                    }}
                    className={`p-1 rounded ${isComparing ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {isComparing ? <CheckSquare className="w-5 h-5" /> : <XSquare className="w-5 h-5" />}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getBadgeColor(proposal.kind)}`}>
                    {getKindLabel(proposal.kind)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{proposal.company}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(proposal.created_at).toLocaleDateString('ja-JP')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs truncate">{proposal.summary}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{formatProposalPrice(proposal)}</div>
                  {metrics.highlights[0] && (
                    <div className="text-xs text-gray-500 mt-1">{metrics.highlights[0]}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatTerm(proposal)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm">
                    <DollarSign className="w-4 h-4 text-green-500 mr-1" />
                    <span className="font-semibold">¥{metrics.npv.toLocaleString('ja-JP')}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
                    <span className="font-semibold">{yieldDisplay}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm">
                    <Gauge className="w-4 h-4 text-indigo-500 mr-1" />
                    <span className="font-semibold">{metrics.overallScore}点</span>
                  </div>
                  <div className="text-xs text-gray-500">安定 {metrics.stabilityScore} / 流動 {metrics.liquidityScore}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => onViewDetail(proposal)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    詳細
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {proposals.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          このカテゴリの提案はありません
        </div>
      )}
    </div>
  );
}

const ComparisonView: React.FC<{
  proposals: Proposal[];
  metricsMap: Map<string | number, ProposalMetrics>;
  onBack: () => void;
}> = ({ proposals, metricsMap, onBack }) => {
  const headers = ['指標', ...proposals.map(p => p.company)];
  
  const rows = [
    { label: '種別', getValue: (p: Proposal) => getKindLabel(p.kind) },
    { label: '概要', getValue: (p: Proposal) => p.summary },
    { label: '価格/賃料', getValue: (p: Proposal) => formatProposalPrice(p) },
    {
      label: '期間',
      getValue: (p: Proposal) => {
        if (p.kind === 'lease' || p.kind === 'groundlease' || p.kind === 'other') {
          return p.term_years ? `${p.term_years}年` : '-';
        }
        if (p.kind === 'exchange') {
          return p.completion_ym ? `完了: ${p.completion_ym}` : '-';
        }
        if (p.kind === 'sale') {
          return p.days_to_close ? `${p.days_to_close}日` : '即時';
        }
        return '-';
      },
    },
    {
      label: 'NPV(10年)',
      getValue: (p: Proposal) => `¥${(metricsMap.get(p.id)?.npv ?? 0).toLocaleString('ja-JP')}`,
    },
    {
      label: '総合スコア',
      getValue: (p: Proposal) => {
        const metrics = metricsMap.get(p.id);
        if (!metrics) return '-';
        return `${metrics.overallScore}点 (収益${metrics.returnScore} / 安定${metrics.stabilityScore})`;
      },
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <button onClick={onBack} className="flex items-center space-x-2 text-sm text-blue-600 hover:underline mb-4">
        <ArrowLeft className="w-4 h-4" />
        <span>一覧に戻る</span>
      </button>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              {headers.map((h, i) => <th key={i} className={`p-3 text-left font-semibold text-gray-700 border-b ${i > 0 ? 'text-center' : ''}`}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b last:border-b-0">
                <td className="p-3 font-medium text-gray-600 bg-gray-50">{row.label}</td>
                {proposals.map(p => (
                  <td key={p.id} className="p-3 text-center">{row.getValue(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const ProposalComparison: React.FC<ProposalComparisonProps> = ({ proposals, asset, onClose }) => {
  const [activeTab, setActiveTab] = useState<Proposal['kind']>('sale');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'compare' | 'detail'>('list');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const proposalCategories: Proposal['kind'][] = ['sale', 'lease', 'exchange', 'groundlease', 'other'];

  const getCategoryLabel = (cat: Proposal['kind']) => {
    const labels = {
      sale: '売却',
      lease: '賃貸',
      exchange: '等価交換',
      groundlease: '借地',
      other: 'その他'
    };
    return labels[cat] || cat;
  };

  const filteredProposals = useMemo(() => {
    return proposals.filter(p => p.kind === activeTab);
  }, [proposals, activeTab]);

  const comparisonProposals = useMemo(() => {
    return proposals.filter(p => compareIds.includes(String(p.id)));
  }, [proposals, compareIds]);

  const handleCompareToggle = (id: string) => {
    setCompareIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  }

  const handleViewDetail = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setViewMode('detail');
  }

  const handleBackToList = () => {
    setSelectedProposal(null);
    setViewMode('list');
  }

  const metricsMap = useMemo(() => {
    const map = new Map<string | number, ProposalMetrics>();
    proposals.forEach((p) => {
      map.set(p.id, calculateProposalMetrics(p, asset));
    });
    return map;
  }, [proposals, asset]);

  const renderContent = () => {
    if (viewMode === 'detail' && selectedProposal) {
      return (
        <div className="max-w-full">
          <ProposalDetailView proposal={selectedProposal} asset={asset} onBack={handleBackToList} />
        </div>
      );
    }
    if (viewMode === 'compare') {
      return <ComparisonView proposals={comparisonProposals} metricsMap={metricsMap} onBack={() => setViewMode('list')} />;
    }
    return (
      <ProposalTable 
        proposals={filteredProposals}
        compareIds={compareIds}
        onCompare={handleCompareToggle}
        onViewDetail={handleViewDetail}
        metricsMap={metricsMap}
        asset={asset}
      />
    );
  }

  return (
    <div className="bg-gray-50 h-full flex flex-col">
       <div className="bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">提案一覧・比較</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        {viewMode === 'list' && (
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap gap-2 sm:gap-0 sm:space-x-6 overflow-x-auto">
              {proposalCategories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setActiveTab(cat)}
                  className={`whitespace-nowrap py-2 sm:py-3 px-3 sm:px-1 border-b-2 font-medium text-sm ${
                    activeTab === cat 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  }`}>
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      <div className="flex-1 p-2 sm:p-4 overflow-auto">
        {renderContent()}
      </div>

      {viewMode === 'list' && compareIds.length > 0 && (
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-white shadow-inner">
          <h3 className="font-semibold text-sm">比較中の提案 ({compareIds.length}件)</h3>
          <div className="mt-2 text-xs text-gray-600 truncate">
            {comparisonProposals.map(p => p.company).join('、')}
          </div>
          <button 
            onClick={() => setViewMode('compare')}
            className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors"
          >
            <BarChart className="w-4 h-4" />
            <span>この{compareIds.length}件を比較する</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default ProposalComparison;
