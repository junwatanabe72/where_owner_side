import React, { useState, useMemo } from 'react';
import { X, Map, List, Building2, Calculator } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Asset, Proposal, PrivacyLevel } from '../../../types';
import {
  convertAssetsToLandProperties,
  formatCurrency,
  formatAssetStatus,
  calculateAssetTotals,
} from '../../../utils';
import { useMapLayers } from '../../../hooks';
import { MapView } from '../map';
import PropertySlideOver from './PropertySlideOver';
import AssetListView from './AssetListView';

interface AssetViewProps {
  assets: Asset[];
  proposals: Proposal[];
  privacyLevel: PrivacyLevel;
  selectedAssetId: number | null;
  onAssetClick: (assetId: number) => void;
}

const AssetView: React.FC<AssetViewProps> = ({
  assets,
  proposals,
  privacyLevel,
  selectedAssetId,
  onAssetClick,
}) => {
  const [openDetail, setOpenDetail] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [showAssetSidebar, setShowAssetSidebar] = useState(false);
  const [initialTab, setInitialTab] = useState<'proposals' | 'evaluation'>('proposals');

  const { mapLayers, updateLayer, resetLayers } = useMapLayers(privacyLevel);

  const selectedAsset = useMemo(
    () => assets.find((a) => a.id === selectedAssetId) || null,
    [selectedAssetId, assets]
  );

  const { totalValuation } = useMemo(
    () => calculateAssetTotals(assets),
    [assets]
  );

  const landProperties = useMemo(
    () => convertAssetsToLandProperties(assets),
    [assets]
  );

  const handleAssetClick = (assetId: number) => {
    setInitialTab('proposals');
    setOpenDetail(true);
    onAssetClick(assetId);
  };

  const handleEvaluationClick = (assetId: number) => {
    setInitialTab('evaluation');
    setOpenDetail(true);
    onAssetClick(assetId);
  };

  return (
    <div className="relative">
      <div className="max-w-[1600px] mx-auto mt-3">

        <div className="w-full">
          <div className="mb-3 flex justify-end">
            <div className="inline-flex rounded-lg bg-white shadow-sm p-1">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'map'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Map className="w-4 h-4" />
                マップビュー
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4" />
                リストビュー
              </button>
            </div>
          </div>

          {viewMode === 'map' ? (
            <div className="bg-white rounded-2xl shadow overflow-hidden relative">
              <MapView
                landProperties={landProperties}
                privacyLevel={privacyLevel}
                mapLayers={mapLayers}
                onLayerToggle={updateLayer}
                onResetLayers={resetLayers}
              />

              {/* Floating Action Button */}
              <button
                onClick={() => setShowAssetSidebar(!showAssetSidebar)}
                className="absolute bottom-6 right-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 z-20 flex items-center gap-2 font-semibold"
              >
                <Building2 className="w-5 h-5" />
                物件一覧
              </button>

              {/* Asset List Sidebar */}
              <AnimatePresence>
                {showAssetSidebar && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black/30 z-30"
                      onClick={() => setShowAssetSidebar(false)}
                    />
                    <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-40"
                    >
                      <div className="h-full flex flex-col">
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            所有不動産一覧
                          </h2>
                          <button
                            onClick={() => setShowAssetSidebar(false)}
                            className="p-2 rounded-lg hover:bg-slate-100"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                          {assets.map((asset) => (
                            <div
                              key={asset.id}
                              className="px-6 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-slate-900">
                                    物件 {asset.id}
                                  </div>
                                  <div className="text-sm text-slate-600 mt-1">
                                    {asset.address}
                                  </div>
                                  <div className="flex items-center gap-4 mt-2 text-sm">
                                    <span className="text-slate-500">
                                      面積: {asset.area.toLocaleString('ja-JP')}㎡
                                    </span>
                                    <span className="text-slate-500">
                                      状態: {formatAssetStatus(asset.status)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-3">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAssetClick(asset.id);
                                        setShowAssetSidebar(false);
                                      }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                      <Building2 className="w-3.5 h-3.5" />
                                      詳細
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEvaluationClick(asset.id);
                                        setShowAssetSidebar(false);
                                      }}
                                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                                    >
                                      <Calculator className="w-3.5 h-3.5" />
                                      評価シミュレーター
                                    </button>
                                  </div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-sm font-medium text-slate-900">
                                    {asset.valuationMedian ? formatCurrency(asset.valuationMedian) : '-'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
                          <div className="flex items-center justify-between text-sm text-slate-600">
                            <div>全 {assets.length} 件</div>
                            <div>
                              合計評価額: {formatCurrency(totalValuation)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <AssetListView
              proposals={proposals}
              privacyLevel={privacyLevel}
              onAssetClick={handleAssetClick}
              onEvaluationClick={handleEvaluationClick}
            />
          )}
        </div>

        <PropertySlideOver
          open={openDetail}
          asset={selectedAsset}
          onClose={() => setOpenDetail(false)}
          proposals={proposals}
          initialTab={initialTab}
        />
      </div>
    </div>
  );
};

export default AssetView;
