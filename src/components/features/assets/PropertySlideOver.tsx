import React, { useMemo, useState, useEffect } from 'react';
import { X, FileText, Calculator } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Asset, Proposal } from '../../../types';
import { formatArea, formatAssetStatus, filterProposalsByAsset } from '../../../utils';
import { ProposalSection } from '../proposals';
import EvaluationTab from '../assetDetail/EvaluationTab';

interface PropertySlideOverProps {
  open: boolean;
  onClose: () => void;
  asset: Asset | null;
  proposals: Proposal[];
  initialTab?: TabType;
}

type TabType = 'proposals' | 'evaluation';

const PropertySlideOver: React.FC<PropertySlideOverProps> = ({
  open,
  onClose,
  asset,
  proposals,
  initialTab = 'proposals',
}) => {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  // initialTabが変更されたら activeTab を更新
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const relatedProposals = useMemo(() => {
    if (!asset) return [];
    return filterProposalsByAsset(proposals, asset.address);
  }, [asset, proposals]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l rounded-l-2xl flex flex-col"
          >
            {/* ヘッダー */}
            <div className="h-14 flex items-center justify-between px-4 border-b">
              <div className="font-semibold">物件情報</div>
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* タブナビゲーション */}
            <div className="border-b border-gray-200 px-4">
              <nav className="-mb-px flex space-x-4">
                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition ${
                    activeTab === 'proposals'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>提案</span>
                </button>
                <button
                  onClick={() => setActiveTab('evaluation')}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 font-medium text-sm transition ${
                    activeTab === 'evaluation'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Calculator className="w-4 h-4" />
                  <span>評価シミュレーター</span>
                </button>
              </nav>
            </div>

            {/* コンテンツエリア */}
            <div className="flex-1 overflow-y-auto p-4">
              {asset ? (
                <>
                  {/* 資産基本情報 */}
                  <div className="space-y-1 text-sm mb-4 pb-4 border-b">
                    <div className="font-semibold">{asset.address}</div>
                    <div className="text-slate-600">
                      面積: {formatArea(asset.area)}
                    </div>
                    <div className="text-slate-600">所有者: {asset.owner}</div>
                    <div className="text-slate-600">
                      現況: {formatAssetStatus(asset.status)}
                    </div>
                    <div className="text-slate-600">{asset.memo}</div>
                  </div>

                  {/* タブコンテンツ */}
                  {activeTab === 'proposals' && (
                    <ProposalSection asset={asset} proposals={relatedProposals} />
                  )}

                  {activeTab === 'evaluation' && (
                    <EvaluationTab asset={asset} />
                  )}
                </>
              ) : (
                <div className="text-sm text-slate-500">
                  物件を選択してください。
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PropertySlideOver;
