import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ChevronRight, Menu, FileText, Download, Bell } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { PrivacyLevel, MapLayers, LandProperty } from '../types';
import { getDefaultMapLayers } from '../utils';
import useAssetStore from '../store/assetStore';
import AssetSidebar from './features/assetDetail/AssetSidebar';
import AssetDetailMap from './features/assetDetail/AssetDetailMap';
import ProposalsTab from './features/assetDetail/ProposalsTab';
import RegistryTab from './features/assetDetail/RegistryTab';
import 'mapbox-gl/dist/mapbox-gl.css';

interface AssetDetailProps {
  assetId: number;
  onBack: () => void;
  privacyLevel: PrivacyLevel;
}

const AssetDetail: React.FC<AssetDetailProps> = ({ assetId, onBack, privacyLevel }) => {
  const { getAssetById, getProposalsForAsset } = useAssetStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotification, setShowNotification] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mapLayers, setMapLayers] = useState<MapLayers>(getDefaultMapLayers(privacyLevel));

  const asset = getAssetById(assetId);
  const proposals = getProposalsForAsset(assetId);

  useEffect(() => {
    setMapLayers(getDefaultMapLayers(privacyLevel));
  }, [privacyLevel]);

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
    { id: 'overview', label: '概要' },
    { id: 'valuation', label: '評価' },
    { id: 'legal', label: '法務' },
    { id: 'documents', label: '図面・資料' },
    { id: 'history', label: '履歴' },
    { id: 'proposals', label: 'プロの提案' },
    { id: 'adjacentParcels', label: '隣地地番' },
  ];

  const landProperties = useMemo<LandProperty[]>(() => {
    if (!asset) return [];
    return [{
      nearStation: [{ min: 5, geometry: { lat: asset.lat, lng: asset.lng } }],
      wood: { originalRaito: 750 },
      address: asset.address,
      area: asset.area,
    }];
  }, [asset]);

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
              <span>WHERE</span>
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
              <div className="h-full">
                <AssetDetailMap
                  landProperties={landProperties}
                  privacyLevel={privacyLevel}
                  mapLayers={mapLayers}
                  setMapLayers={setMapLayers}
                />
              </div>
            )}

            {activeTab === 'valuation' && (
              <ValuationTab asset={asset} formatCurrency={formatCurrency} />
            )}

            {activeTab === 'legal' && (
              <LegalTab asset={asset} />
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

            {activeTab === 'adjacentParcels' && (
              <RegistryTab />
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
                  onClick={() => setActiveTab('adjacentParcels')}
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
const ValuationTab: React.FC<{ asset: any; formatCurrency: (value: number) => string }> = ({ asset, formatCurrency }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">評価詳細</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-gray-600">評価額中央値</div>
          <div className="text-2xl font-bold">{formatCurrency(asset.valuationMedian || 0)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">坪単価</div>
          <div className="text-2xl font-bold">{formatCurrency((asset.pricePerSqm || 0) * 3.3)}</div>
        </div>
      </div>
    </div>
  </div>
);

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