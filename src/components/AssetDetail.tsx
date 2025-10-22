import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronRight,
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
import AssetOverview from './features/assetDetail/AssetOverview';
import EvaluationTab from './features/assetDetail/EvaluationTab';
import ProposalsTab from './features/assetDetail/ProposalsTab';
import RegistryTab from './features/assetDetail/RegistryTab';
import { registryParcels } from '../data/mockRegistryData';
import type { Attachment } from '../data/mockRegistryData';

interface AssetDetailProps {
  assetId: number;
  onBack: () => void;
  privacyLevel: PrivacyLevel;
}

const AssetDetail: React.FC<AssetDetailProps> = ({ assetId, onBack, privacyLevel }) => {
  const { getAssetById, getProposalsForAsset } = useAssetStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const asset = getAssetById(assetId);
  const proposals = getProposalsForAsset(assetId);

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
    { id: 'overview', label: '概要' },
    { id: 'registry', label: '登記詳細' },
    { id: 'valuation', label: '評価' },
    { id: 'simulation', label: 'シミュレーション' },
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
            {activeTab === 'overview' && (
              <AssetOverview asset={asset} privacyLevel={privacyLevel} />
            )}

            {activeTab === 'registry' && (
              <RegistryTab />
            )}

            {activeTab === 'valuation' && (
              <ValuationTab asset={asset} formatCurrency={formatCurrency} />
            )}

            {activeTab === 'simulation' && (
              <EvaluationTab asset={asset} />
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

    </div>
  );
};

// Simple placeholder components for other tabs
const ValuationTab: React.FC<{ asset: any; formatCurrency: (value: number) => string }> = ({ asset, formatCurrency }) => {
  // 5年分のダミー系列（基準値 ±8%レンジ）
  const currentYear = new Date().getFullYear();
  const baseRosenka = asset?.referenceIndicators?.rosenka?.estimatedPricePerSqm ?? 300000; // 円/㎡
  const baseKoji = asset?.referenceIndicators?.kojiKakaku?.pricePerSqm ?? 350000; // 円/㎡
  const multipliers = [0.92, 0.96, 1.0, 1.04, 1.08];
  const rosenkaSeries = multipliers.map((m, i) => ({ year: currentYear - (4 - i), psm: Math.round(baseRosenka * m) }));
  const kojiSeries = multipliers.map((m, i) => ({ year: currentYear - (4 - i), psm: Math.round(baseKoji * m) }));

  const totalLandArea = useMemo(
    () => registryParcels.reduce((sum, parcel) => sum + parcel.areaSqm, 0),
    []
  );
  const evaluationArea = totalLandArea > 0 ? totalLandArea : asset.area;

  const [selectedRYear, setSelectedRYear] = useState<number>(rosenkaSeries[4].year);
  const [selectedKYear, setSelectedKYear] = useState<number>(kojiSeries[4].year);

  const selectedRosenkaPsm = useMemo(() => rosenkaSeries.find(r => r.year === selectedRYear)?.psm, [rosenkaSeries, selectedRYear]);
  const selectedKojiPsm = useMemo(() => kojiSeries.find(k => k.year === selectedKYear)?.psm, [kojiSeries, selectedKYear]);

  const [rosenkaToMarket, setRosenkaToMarket] = useState(1.15);
  const [kojiToMarket, setKojiToMarket] = useState(0.95);
  const [wR, setWR] = useState(0.5); // 0..1（公示は1-wR）
  const [sens, setSens] = useState(0.1);

  const result = useMemo(() => {
    return estimateByUnitPrices({
      areaSqm: evaluationArea,
      rosenkaPsm: selectedRosenkaPsm,
      kojiPsm: selectedKojiPsm,
      rosenkaToMarket,
      kojiToMarket,
      weights: { rosenka: wR, koji: 1 - wR },
      sensitivity: sens,
    });
  }, [evaluationArea, selectedRosenkaPsm, selectedKojiPsm, rosenkaToMarket, kojiToMarket, wR, sens]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">土地評価（単価ベース）</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">下限値</div>
            <div className="text-xl font-bold">{formatCurrency(Math.round(result.min))}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">中央値</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(Math.round(result.median))}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">上限値</div>
            <div className="text-xl font-bold">{formatCurrency(Math.round(result.max))}</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-600 flex flex-wrap gap-3">
          {result.breakdown?.rosenka !== undefined && <span className="px-2 py-1 bg-white rounded border">路線価寄与: {formatCurrency(Math.round(result.breakdown.rosenka))}</span>}
          {result.breakdown?.koji !== undefined && <span className="px-2 py-1 bg-white rounded border">公示価格寄与: {formatCurrency(Math.round(result.breakdown.koji))}</span>}
          <span className="px-2 py-1 bg-white rounded border">面積: {evaluationArea.toLocaleString()}㎡</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">参照単価（直近5年から選択）</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <label className="text-gray-600">路線価 年度</label>
              <select value={selectedRYear} onChange={(e) => setSelectedRYear(Number(e.target.value))} className="px-2 py-1 border rounded w-40">
                {rosenkaSeries.map(r => (
                  <option key={r.year} value={r.year}>{r.year}年（{r.psm.toLocaleString()} 円/㎡）</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between gap-3">
              <label className="text-gray-600">公示価格 年度</label>
              <select value={selectedKYear} onChange={(e) => setSelectedKYear(Number(e.target.value))} className="px-2 py-1 border rounded w-40">
                {kojiSeries.map(k => (
                  <option key={k.year} value={k.year}>{k.year}年（{k.psm.toLocaleString()} 円/㎡）</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">補正・重み・感度</h4>
          <div className="space-y-4 text-sm">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-gray-600">路線価→市場 補正</label>
                <span className="text-gray-800 font-medium">× {rosenkaToMarket.toFixed(2)}</span>
              </div>
              <input type="range" min={0.9} max={1.3} step={0.01} value={rosenkaToMarket} onChange={(e) => setRosenkaToMarket(Number(e.target.value))} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500"><span>0.90</span><span>1.10</span><span>1.30</span></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-gray-600">公示価格→市場 補正</label>
                <span className="text-gray-800 font-medium">× {kojiToMarket.toFixed(2)}</span>
              </div>
              <input type="range" min={0.85} max={1.15} step={0.01} value={kojiToMarket} onChange={(e) => setKojiToMarket(Number(e.target.value))} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500"><span>0.85</span><span>1.00</span><span>1.15</span></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-gray-600">重み（路線価 ↔ 公示価格）</label>
                <span className="text-gray-800 font-medium">{Math.round(wR*100)}% / {Math.round((1-wR)*100)}%</span>
              </div>
              <input type="range" min={0} max={1} step={0.05} value={wR} onChange={(e) => setWR(Number(e.target.value))} className="w-full" />
              <div className="mt-1 h-2 rounded-full overflow-hidden bg-gray-200">
                <div className="h-full bg-blue-500" style={{ width: `${wR*100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-gray-600">感度（±）</label>
                <span className="text-gray-800 font-medium">{Math.round(sens*100)}%</span>
              </div>
              <input type="range" min={0} max={0.3} step={0.01} value={sens} onChange={(e) => setSens(Number(e.target.value))} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500"><span>0%</span><span>15%</span><span>30%</span></div>
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
