import React, { useMemo, useState } from 'react';
import { Asset, Proposal } from '../types';
import { ArrowLeft, TrendingUp, Calendar, DollarSign, Shield, Building, AlertCircle, ChevronRight, BarChart3, PieChart, Activity, FileText } from 'lucide-react';
import { calculateProposalMetrics, getKindLabel as getKindLabelFromUtil, getBadgeColor } from '../utils';

interface ProposalDetailViewProps {
  proposal: Proposal;
  onBack: () => void;
  onShowHtml?: () => void;
  asset?: Asset;
}

const DetailRow: React.FC<{ label: string; value: React.ReactNode; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className={`py-3 sm:grid sm:grid-cols-3 sm:gap-4 ${highlight ? 'bg-blue-50 -mx-4 px-4 rounded-lg' : ''}`}>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className={`mt-1 text-sm ${highlight ? 'text-blue-900 font-semibold' : 'text-gray-900'} sm:mt-0 sm:col-span-2`}>{value || '-'}</dd>
  </div>
);

const KPICard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; trend?: string; color?: string }> = ({ 
  icon, label, value, trend, color = 'blue' 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  return (
    <div className={`p-4 rounded-xl border-2 ${colorClasses[color as keyof typeof colorClasses]} transition-all hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'}`}>
            {icon}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
            {trend && (
              <p className="mt-1 text-xs text-gray-500">{trend}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProposalDetailView: React.FC<ProposalDetailViewProps> = ({ proposal, onBack, onShowHtml, asset }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const metrics = useMemo(() => calculateProposalMetrics(proposal, asset), [proposal, asset]);
  const valuation = asset?.valuationMedian ?? asset?.valuationMax ?? asset?.valuationMin;
  const discountRate = proposal.kind === 'sale' && valuation
    ? (valuation - (proposal.price ?? 0)) / valuation
    : undefined;
  const effectiveYield = proposal.kind === 'sale' ? discountRate : metrics.netYield;
  const saleCosts = proposal.kind === 'sale' ? proposal.costs : undefined;
  
  const formatValue = (value: any) => {
    if (typeof value === 'number') return value.toLocaleString('ja-JP');
    if (typeof value === 'boolean') return value ? 'はい' : 'いいえ';
    return value || '-';
  };

  const getKindLabel = getKindLabelFromUtil;

  const getKindColor = (kind: Proposal['kind']) => getBadgeColor(kind);

  const calculateNPV = () => metrics.npv;

  const calculateIRR = () => {
    if (effectiveYield === undefined) return '―';
    if (proposal.kind === 'sale') {
      return `${(effectiveYield * 100).toFixed(1)}%`;
    }
    return `${(effectiveYield * 100).toFixed(2)}%`;
  };

  const calculatePayback = () => {
    if (proposal.kind === 'sale') return '即時';
    if (metrics.paybackYears === undefined) return '―';
    if (metrics.paybackYears === 0) return '即時';
    return `${metrics.paybackYears.toFixed(1)}年`;
  };

  const getRiskScore = () => {
    if (metrics.overallScore >= 85) return { score: 'A', label: '低リスク', color: 'green' } as const;
    if (metrics.overallScore >= 70) return { score: 'B', label: '適正リスク', color: 'blue' } as const;
    if (metrics.overallScore >= 55) return { score: 'C', label: '注意要', color: 'orange' } as const;
    return { score: 'D', label: '要精査', color: 'orange' } as const;
  };

  const riskInfo = getRiskScore();

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* ヘッダー部分 */}
      <div className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button onClick={onBack} className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>提案一覧に戻る</span>
            </button>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium border ${getKindColor(proposal.kind)}`}>
                {getKindLabel(proposal.kind)}
              </span>
              <span className="text-xs sm:text-sm text-gray-500">
                提案日: {new Date(proposal.created_at).toLocaleDateString('ja-JP')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* 提案概要ヘッダー */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <Building className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
                <span>{proposal.company}からの提案</span>
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">{proposal.summary}</p>
            </div>
            {proposal.confidence && (
              <div className="flex flex-col items-center p-2 sm:p-3 bg-blue-50 rounded-lg flex-shrink-0">
                <span className="text-xs text-gray-600">信頼度</span>
                <span className="text-xl sm:text-2xl font-bold text-blue-600">{proposal.confidence}%</span>
              </div>
            )}
          </div>
          {proposal.htmlContent && onShowHtml && (
            <div className="mt-4 sm:mt-6">
              <button
                type="button"
                onClick={onShowHtml}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                オリジナル提案書を開く
              </button>
            </div>
          )}
        </div>

        {/* 主要KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <KPICard 
            icon={<DollarSign className="w-6 h-6" />}
            label="NPV (10年)"
            value={`¥${formatValue(calculateNPV())}`}
            trend={metrics.highlights[0] ?? '10年想定キャッシュフロー'}
            color="green"
          />
          <KPICard 
            icon={<TrendingUp className="w-6 h-6" />}
            label="リターン指標"
            value={calculateIRR()}
            trend={`リターンスコア ${metrics.returnScore}点`}
            color="blue"
          />
          <KPICard 
            icon={<Calendar className="w-6 h-6" />}
            label="回収期間"
            value={calculatePayback()}
            trend={metrics.paybackYears !== undefined ? '投資回収目安' : 'キャッシュインまでの期間'}
            color="purple"
          />
          <KPICard 
            icon={<Shield className="w-6 h-6" />}
            label="リスク評価"
            value={`${riskInfo.score} / ${metrics.overallScore}点`}
            trend={riskInfo.label}
            color={riskInfo.color as 'blue' | 'green' | 'purple' | 'orange'}
          />
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-xl shadow-sm mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-2 sm:space-x-8 px-3 sm:px-6 overflow-x-auto" aria-label="Tabs">
              {[
                { id: 'overview', label: '概要', icon: <BarChart3 className="w-4 h-4" /> },
                { id: 'financial', label: '財務分析', icon: <PieChart className="w-4 h-4" /> },
                { id: 'details', label: '詳細条件', icon: <FileText className="w-4 h-4" /> },
                { id: 'risks', label: 'リスク評価', icon: <AlertCircle className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* タブコンテンツ */}
          <div className="p-4 sm:p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <div className="flex items-start">
                    <Activity className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-900">提案のポイント</h3>
                      <p className="mt-1 text-sm text-blue-700">
                        {proposal.kind === 'sale' && '即時の現金化が可能で、市場価格を上回る条件での買取提案です。'}
                        {proposal.kind === 'lease' && '安定した長期収入が見込め、管理負担も軽減される賃貸提案です。'}
                        {proposal.kind === 'exchange' && '初期投資なしで資産価値の向上が期待できる等価交換提案です。'}
                        {proposal.kind === 'groundlease' && '土地を保有しながら安定収入を得られる借地提案です。'}
                        {proposal.kind === 'other' && '特殊な活用方法による収益最大化の提案です。'}
                      </p>
                      {metrics.highlights.length > 0 && (
                        <ul className="mt-3 space-y-1 text-xs sm:text-sm text-blue-800">
                          {metrics.highlights.slice(0, 3).map((highlight, index) => (
                            <li key={index} className="flex items-start">
                              <span className="mt-1 mr-2 block w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h3>
                  <dl className="divide-y divide-gray-200 border rounded-lg">
                    <DetailRow label="提案種別" value={getKindLabel(proposal.kind)} highlight={true} />
                    {proposal.price && <DetailRow label="提案価格" value={`¥${formatValue(proposal.price)}`} highlight={true} />}
                    {proposal.monthly_rent && <DetailRow label="月額賃料" value={`¥${formatValue(proposal.monthly_rent)}`} highlight={true} />}
                    {proposal.annual_ground_rent && <DetailRow label="年間地代" value={`¥${formatValue(proposal.annual_ground_rent)}`} highlight={true} />}
                    {proposal.term_years && <DetailRow label="契約期間" value={`${proposal.term_years}年`} />}
                    {proposal.completion_ym && <DetailRow label="完了予定" value={proposal.completion_ym} />}
                    {proposal.days_to_close && <DetailRow label="決済期間" value={`${proposal.days_to_close}日`} />}
                  </dl>
                </div>
              </div>
            )}

            {activeTab === 'financial' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">収支シミュレーション</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-gray-600">5年NPV</span>
                        <span className="font-semibold">¥{formatValue(metrics.npv * 0.6)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-gray-600">10年NPV</span>
                        <span className="font-semibold">¥{formatValue(metrics.npv)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm text-gray-600">20年NPV</span>
                        <span className="font-semibold">¥{formatValue(metrics.npv * 1.5)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">実質利回り</span>
                        <span className="font-semibold text-green-600">{calculateIRR()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">コスト内訳</h3>
                    <div className="space-y-3">
                      {saleCosts && (
                        <>
                          {saleCosts.broker && (
                            <div className="flex justify-between items-center py-2 border-b">
                              <span className="text-sm text-gray-600">仲介手数料</span>
                              <span className="font-semibold">¥{formatValue(saleCosts.broker)}</span>
                            </div>
                          )}
                          {saleCosts.taxes && (
                            <div className="flex justify-between items-center py-2 border-b">
                              <span className="text-sm text-gray-600">税金</span>
                              <span className="font-semibold">¥{formatValue(saleCosts.taxes)}</span>
                            </div>
                          )}
                          {saleCosts.others && (
                            <div className="flex justify-between items-center py-2">
                              <span className="text-sm text-gray-600">その他費用</span>
                              <span className="font-semibold">¥{formatValue(saleCosts.others)}</span>
                            </div>
                          )}
                        </>
                      )}
                      {proposal.opex_ratio && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm text-gray-600">運営費率</span>
                          <span className="font-semibold">{proposal.opex_ratio}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">提案詳細</h3>
                  <div className="bg-gray-50 rounded-lg p-6 whitespace-pre-wrap text-gray-700">
                    {proposal.details || '詳細情報は提供されていません。'}
                  </div>
                </div>
                
                {proposal.attachments && proposal.attachments.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">添付資料</h3>
                    <div className="space-y-2">
                      {proposal.attachments.map((attachment: string, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-600" />
                            <span className="text-sm text-gray-700">{attachment}</span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'risks' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-900">リスク評価サマリー</h3>
                      <p className="mt-1 text-sm text-yellow-700">
                        総合リスクスコア: <span className="font-bold">{riskInfo.score}</span> ({riskInfo.label})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">主要リスク要因</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="block w-2 h-2 bg-orange-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                        <div>
                          <p className="font-medium text-gray-900">市場リスク</p>
                          <p className="text-sm text-gray-600">不動産市況の変動による影響</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="block w-2 h-2 bg-yellow-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                        <div>
                          <p className="font-medium text-gray-900">信用リスク</p>
                          <p className="text-sm text-gray-600">取引先の信用力に関する懸念</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="block w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                        <div>
                          <p className="font-medium text-gray-900">流動性リスク</p>
                          <p className="text-sm text-gray-600">資産の換金性に関する評価</p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">リスク緩和策</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">契約条件の精査</p>
                          <p className="text-sm text-gray-600">専門家による契約内容の詳細確認</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">保証・保険の活用</p>
                          <p className="text-sm text-gray-600">適切な保証制度の導入検討</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <Shield className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">段階的実行</p>
                          <p className="text-sm text-gray-600">リスクを最小化する実行計画</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* アクションボタンセクションを削除 */}
      </div>
    </div>
  );
};

export default ProposalDetailView;
