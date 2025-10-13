import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ChevronRight, Bell, Menu, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PrivacyLevel } from '../types';
import { estimateByUnitPrices } from '../utils';
import useAssetStore from '../store/assetStore';
import AssetSidebar from './features/assetDetail/AssetSidebar';
import ProposalsTab from './features/assetDetail/ProposalsTab';
import RegistryTab from './features/assetDetail/RegistryTab';

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
    { id: 'legal', label: '法務' },
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

            {activeTab === 'legal' && (
              <LegalTab asset={asset} />
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
              <ProposalsTab proposals={proposals} />
            )}
          </div>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {showNotification && (
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
  // 5年分のダミー系列（基準値 ±8%レンジ）
  const currentYear = new Date().getFullYear();
  const baseRosenka = asset?.referenceIndicators?.rosenka?.estimatedPricePerSqm ?? 300000; // 円/㎡
  const baseKoji = asset?.referenceIndicators?.kojiKakaku?.pricePerSqm ?? 350000; // 円/㎡
  const multipliers = [0.92, 0.96, 1.0, 1.04, 1.08];
  const rosenkaSeries = multipliers.map((m, i) => ({ year: currentYear - (4 - i), psm: Math.round(baseRosenka * m) }));
  const kojiSeries = multipliers.map((m, i) => ({ year: currentYear - (4 - i), psm: Math.round(baseKoji * m) }));

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
      areaSqm: asset.area,
      rosenkaPsm: selectedRosenkaPsm,
      kojiPsm: selectedKojiPsm,
      rosenkaToMarket,
      kojiToMarket,
      weights: { rosenka: wR, koji: 1 - wR },
      sensitivity: sens,
    });
  }, [asset.area, selectedRosenkaPsm, selectedKojiPsm, rosenkaToMarket, kojiToMarket, wR, sens]);

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
          <span className="px-2 py-1 bg-white rounded border">面積: {asset.area.toLocaleString()}㎡</span>
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

const LegalTab: React.FC<{ asset: any }> = ({ asset }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">法務情報</h3>
      <div className="space-y-2 text-sm">
        <div>所有者: {asset.owner}</div>
        <div>地目: 宅地</div>
        <div>登記日: {(asset as any).registrationDate || '2020-01-01'}</div>
      </div>
    </div>
  </div>
);

const DocumentsTab: React.FC = () => (
  <div className="space-y-4">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">図面・資料</h3>
      <div className="space-y-3">
        {['測量図.pdf', '登記簿謄本.pdf', '建築図面.pdf'].map((doc) => (
          <div key={doc} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="text-sm">{doc}</span>
            </div>
            <button className="p-1 hover:bg-gray-200 rounded">
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

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
