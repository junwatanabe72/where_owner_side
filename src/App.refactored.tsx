import { useState } from 'react';
import { PrivacyLevel } from './types';
import useAssetStore from './store/assetStore';
import TopNav from './components/layout/TopNav';
import { AssetView } from './components/features/assets';
import AssetDetail from './components/AssetDetail';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function App() {
  const {
    assets,
    proposals,
    registryAlerts,
    setSelectedAssetId,
    selectedAssetId,
  } = useAssetStore();

  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('限定公開');
  const [showSettings, setShowSettings] = useState(false);
  const [showAssetDetail, setShowAssetDetail] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (showAssetDetail && selectedAssetId !== null) {
    return (
      <AssetDetail
        assetId={selectedAssetId}
        onBack={() => {
          setShowAssetDetail(false);
          setSelectedAssetId(null);
        }}
        privacyLevel={privacyLevel}
      />
    );
  }

  return (
    <div className="w-full h-full min-h-screen bg-slate-50 text-slate-900">
      <TopNav
        privacyLevel={privacyLevel}
        setPrivacyLevel={setPrivacyLevel}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="px-2 md:px-4 lg:px-6 pb-3">
        <AssetView
          assets={assets}
          proposals={proposals}
          alerts={registryAlerts}
          privacyLevel={privacyLevel}
          onAssetClick={(assetId: number) => {
            setSelectedAssetId(assetId);
            setShowAssetDetail(true);
          }}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
    </div>
  );
}