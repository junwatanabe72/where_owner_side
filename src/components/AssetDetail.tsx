import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Bell,
  Menu,
  FileText,
  Download,
  Map as MapIcon,
  Building2 as BuildingIcon,
  Layers,
  Image as ImageIcon,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrivacyLevel } from '../types';
import { estimateByUnitPrices } from '../utils';
import useAssetStore from '../store/assetStore';
import AssetSidebar from './features/assetDetail/AssetSidebar';
import ProposalsTab from './features/assetDetail/ProposalsTab';
import RegistryTab, { registryParcels } from './features/assetDetail/RegistryTab';
import type { Attachment } from './features/assetDetail/RegistryTab';
import SimulatorTab from './features/assetDetail/SimulatorTab';

interface AssetDetailProps {
  assetId: number;
  onBack: () => void;
  privacyLevel: PrivacyLevel;
}

const AssetDetail: React.FC<AssetDetailProps> = ({ assetId, onBack, privacyLevel }) => {
  const { getAssetById, getProposalsForAsset } = useAssetStore();
  const [activeTab, setActiveTab] = useState('registry');
  const [showNotification, setShowNotification] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const asset = getAssetById(assetId);
  const proposals = getProposalsForAsset(assetId);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ja-JP').format(value);
  };

  const tabs = [
    { id: 'registry', label: '登記概要' },
    { id: 'valuation', label: '評価' },
    { id: 'simulator', label: '評価シミュレーター' },
    { id: 'documents', label: '図面・資料' },
    { id: 'history', label: '履歴' },
    { id: 'proposals', label: 'プロの提案' },
  ];

  if (!asset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">資産が見つかりません</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>WHERE OWNER</span>
              <ChevronRight className="w-4 h-4" />
              <span>資産管理</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">{asset.name || asset.address}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm">編集</button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm">共有</button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              className="fixed inset-0 z-40 bg-black/30 lg:hidden" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsSidebarOpen(false)} 
            />
          )}
        </AnimatePresence>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              className="fixed top-0 left-0 h-full w-80 bg-white z-50 lg:hidden border-r border-gray-200 p-6 overflow-y-auto" 
              initial={{ x: '-100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '-100%' }} 
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <AssetSidebar 
                asset={asset} 
                formatCurrency={formatCurrency} 
                formatNumber={formatNumber} 
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200 p-6">
          <AssetSidebar 
            asset={asset} 
            formatCurrency={formatCurrency} 
            formatNumber={formatNumber} 
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 border-b-2 transition-colors text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 font-medium'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6">
            {activeTab === 'valuation' && (
              <ValuationTab asset={asset} formatCurrency={formatCurrency} />
            )}

            {activeTab === 'simulator' && (
              <SimulatorTab assetId={assetId} />
            )}

            {activeTab === 'registry' && (
              <RegistryTab />
            )}

            {activeTab === 'documents' && (
              <DocumentsTab />
            )}

            {activeTab === 'history' && (
              <HistoryTab />
            )}

            {activeTab === 'proposals' && (
              <ProposalsTab asset={asset} proposals={proposals} />
            )}
          </div>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {!showNotification && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border p-4 max-w-sm"
          >
            <div className="flex items-start space-x-3">
              <Bell className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-gray-900">隣地の登記情報が更新されました</div>
                <div className="text-xs text-gray-600 mt-1">宇田川町83-4の所有者が変更されました</div>
                <button
                  onClick={() => setActiveTab('registry')}
                  className="text-xs text-blue-600 hover:text-blue-700 mt-2"
                >
                  詳細を確認 →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple placeholder components for other tabs
const ValuationTab: React.FC<{ asset: any; formatCurrency: (value: number) => string }> = ({ asset, formatCurrency }) => {
  const currentYear = new Date().getFullYear();
  const totalLandArea = useMemo(
    () => registryParcels.reduce((sum, parcel) => sum + parcel.areaSqm, 0),
    []
  );
  const evaluationArea = totalLandArea > 0 ? totalLandArea : asset.area;
  const valuationMedian =
    asset?.valuationMedian ??
    (asset?.valuationMin != null && asset?.valuationMax != null
      ? (asset.valuationMin + asset.valuationMax) / 2
      : undefined);
  const unitPriceAnchor =
    valuationMedian && evaluationArea
      ? valuationMedian / evaluationArea
      : asset?.pricePerSqm;

  // 5年分のダミー系列（基準値 ±8%レンジ）: 路線価のみを使用
  const rawRosenka = asset?.referenceIndicators?.rosenka?.estimatedPricePerSqm ?? 300000; // 円/㎡
  const multipliers = [0.92, 0.96, 1.0, 1.04, 1.08];
  const defaultYearMultiplier = multipliers[multipliers.length - 1];
  const scaleFactor =
    unitPriceAnchor && rawRosenka
      ? unitPriceAnchor / (rawRosenka * defaultYearMultiplier)
      : 1;
  const baseRosenka = Math.round(rawRosenka * scaleFactor);
  const rosenkaSeries = multipliers.map((m, i) => ({
    year: currentYear - (4 - i),
    psm: Math.round(baseRosenka * m),
  }));

  const [selectedRYear, setSelectedRYear] = useState<number>(rosenkaSeries[4].year);
  const selectedRosenkaPsm = useMemo(
    () => rosenkaSeries.find(r => r.year === selectedRYear)?.psm,
    [rosenkaSeries, selectedRYear]
  );

  const result = useMemo(() => {
    return estimateByUnitPrices({
      areaSqm: evaluationArea,
      rosenkaPsm: selectedRosenkaPsm,
      rosenkaToMarket: 1,
      weights: { rosenka: 1, koji: 0 },
      sensitivity: 0,
    });
  }, [evaluationArea, selectedRosenkaPsm]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">土地評価（路線価ベース）</h3>
        <div className="text-center">
          <div className="text-sm text-gray-600">評価額</div>
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(Math.round(result.median))}
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-600 flex flex-wrap gap-3">
          {selectedRosenkaPsm !== undefined && (
            <span className="px-2 py-1 bg-white rounded border">
              路線価単価: {selectedRosenkaPsm.toLocaleString()} 円/㎡
            </span>
          )}
          <span className="px-2 py-1 bg-white rounded border">面積: {evaluationArea.toLocaleString()}㎡</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">参照単価（直近5年から選択）</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <label className="text-gray-600">路線価 年度</label>
              <select
                value={selectedRYear}
                onChange={(e) => setSelectedRYear(Number(e.target.value))}
                className="px-2 py-1 border rounded w-40"
              >
                {rosenkaSeries.map(r => (
                  <option key={r.year} value={r.year}>
                    {r.year}年（{r.psm.toLocaleString()} 円/㎡）
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TSUBO_PER_SQM = 1 / 3.305785;

const DocumentsTab: React.FC = () => {
  const [activeParcelId, setActiveParcelId] = useState(() => registryParcels[0]?.id ?? '');

  const activeParcel = useMemo(() => {
    if (!registryParcels.length) {
      return undefined;
    }
    return registryParcels.find((parcel) => parcel.id === activeParcelId) ?? registryParcels[0];
  }, [activeParcelId]);

  const parcelAttachments = activeParcel?.attachments ?? [];

  const buildingAttachmentRows = useMemo(() => {
    if (!activeParcel?.buildings?.length) {
      return [] as { buildingId: string; buildingName: string; attachment: Attachment }[];
    }

    return activeParcel.buildings.flatMap((building) =>
      (building.attachments ?? []).map((attachment) => ({
        buildingId: building.id,
        buildingName: building.name,
        attachment,
      }))
    );
  }, [activeParcel]);

  const renderAttachmentIcon = (type: Attachment['type']) => {
    switch (type) {
      case 'cad':
        return <Layers className="w-4 h-4 text-indigo-500" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-blue-500" />;
      default:
        return <FileText className="w-4 h-4 text-amber-500" />;
    }
  };

  const formatArea = (areaSqm: number) => {
    const tsubo = areaSqm * TSUBO_PER_SQM;
    return `${areaSqm.toLocaleString()}㎡ / ${tsubo.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}坪`;
  };

  const attachmentTypeLabel: Record<Attachment['type'], string> = {
    pdf: 'PDF',
    image: '画像',
    cad: 'CAD',
  };

  const handleAction = (action: 'view' | 'download', attachment: Attachment) => {
    // TODO: Integrate with viewer/downloader when backend endpoints are ready
    console.info(`[DocumentsTab] ${action} attachment`, attachment);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <MapIcon className="w-4 h-4 text-emerald-500" />
            土地ごとの資料
          </div>
          <div className="flex flex-wrap gap-2">
            {registryParcels.map((parcel) => {
              const isActive = activeParcel?.id === parcel.id;
              return (
                <button
                  key={parcel.id}
                  onClick={() => setActiveParcelId(parcel.id)}
                  className={`px-3 py-2 text-xs md:text-sm font-medium rounded-lg border transition ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {parcel.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeParcel ? (
          <div className="mt-6 space-y-6">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <div className="text-sm font-semibold text-slate-900">{activeParcel.label}</div>
              <div className="mt-1">{activeParcel.address}</div>
              <div className="mt-1">登記地積: {formatArea(activeParcel.areaSqm)} / 区分: {activeParcel.landCategory}</div>
              <div className="mt-1 text-[11px] text-slate-500">
                データソース: {activeParcel.metadata.dataSource}（同期: {activeParcel.metadata.lastSynced}）
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      資料名
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      種別
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      更新日
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      備考
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {parcelAttachments.length > 0 ? (
                    parcelAttachments.map((attachment) => (
                      <tr key={attachment.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                              {renderAttachmentIcon(attachment.type)}
                            </span>
                            <span className="font-medium text-slate-800">{attachment.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{attachmentTypeLabel[attachment.type]}</td>
                        <td className="px-4 py-3 text-slate-600">{attachment.updated}</td>
                        <td className="px-4 py-3 text-slate-500">{attachment.note ?? '—'}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleAction('view', attachment)}
                              className="inline-flex items-center gap-1 rounded-md border border-transparent bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                            >
                              <Eye className="h-4 w-4" />
                              <span>閲覧</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAction('download', attachment)}
                              className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600"
                            >
                              <Download className="h-4 w-4" />
                              <span>ダウンロード</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                        この土地に登録された図面・資料はありません。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            表示できる土地がありません。
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <BuildingIcon className="w-4 h-4 text-blue-500" />
          建物ごとの資料
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  建物
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  資料名
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  種別
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  更新日
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  備考
                </th>
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {buildingAttachmentRows.length > 0 ? (
                buildingAttachmentRows.map(({ buildingId, buildingName, attachment }) => (
                  <tr key={`${buildingId}-${attachment.id}`} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-700">{buildingName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                          {renderAttachmentIcon(attachment.type)}
                        </span>
                        <span className="font-medium text-slate-800">{attachment.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{attachmentTypeLabel[attachment.type]}</td>
                    <td className="px-4 py-3 text-slate-600">{attachment.updated}</td>
                    <td className="px-4 py-3 text-slate-500">{attachment.note ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleAction('view', attachment)}
                          className="inline-flex items-center gap-1 rounded-md border border-transparent bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                        >
                          <Eye className="h-4 w-4" />
                          <span>閲覧</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAction('download', attachment)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600"
                        >
                          <Download className="h-4 w-4" />
                          <span>ダウンロード</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-500">
                    この土地に関連する建物の図面・資料はありません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const HistoryTab: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">変更履歴</h3>
      <div className="space-y-3">
        {[
          { date: '2025-09-01', event: '隣地所有者変更' },
          { date: '2025-08-15', event: '評価額更新' },
          { date: '2025-07-01', event: '資産登録' },
        ].map((item) => (
          <div key={item.date} className="flex items-center space-x-3 p-3 border-l-2 border-blue-500">
            <div className="text-sm text-gray-600">{item.date}</div>
            <div className="text-sm">{item.event}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AssetDetail;
