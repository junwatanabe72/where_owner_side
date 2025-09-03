import React, { useState, useMemo } from 'react';
import { X, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Asset, Proposal, RegistryAlert, PrivacyLevel } from '../../../types';
import { convertAssetsToLandProperties } from '../../../utils';
import { useInfoTip, useMapLayers } from '../../../hooks';
import AssetListSidebar from '../../layout/AssetListSidebar';
import { MapView } from '../map';
import PropertySlideOver from './PropertySlideOver';

interface AssetViewProps {
  assets: Asset[];
  proposals: Proposal[];
  alerts: RegistryAlert[];
  privacyLevel: PrivacyLevel;
  onAssetClick: (assetId: number) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const AssetView: React.FC<AssetViewProps> = ({
  assets,
  proposals,
  alerts,
  privacyLevel,
  onAssetClick,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  
  const { showInfoTip, setShowInfoTip, tipAlert } = useInfoTip(alerts, selected);
  const { mapLayers, setMapLayers } = useMapLayers(privacyLevel);

  const selectedAsset = useMemo(
    () => assets.find((a) => a.id === selected) || null,
    [selected, assets]
  );

  const totalValuation = useMemo(() => {
    return assets.reduce((sum, asset) => sum + (asset.valuationMedian || 0), 0);
  }, [assets]);

  const landProperties = useMemo(
    () => convertAssetsToLandProperties(assets),
    [assets]
  );

  const handleAssetClick = (assetId: number) => {
    setSelected(assetId);
    onAssetClick(assetId);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed inset-0 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 h-full w-full max-w-sm bg-transparent p-4"
            >
              <AssetListSidebar
                assets={assets}
                selected={selected}
                onAssetClick={handleAssetClick}
                totalValuation={totalValuation}
                setIsSidebarOpen={setIsSidebarOpen}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-3 mt-3">
        <div className="hidden lg:block col-span-12 lg:col-span-4 xl:col-span-3">
          <AssetListSidebar
            assets={assets}
            selected={selected}
            onAssetClick={handleAssetClick}
            totalValuation={totalValuation}
          />
        </div>

        <div className="col-span-12 lg:col-span-8 xl:col-span-9 bg-white rounded-2xl shadow overflow-hidden relative">
          <MapView
            landProperties={landProperties}
            privacyLevel={privacyLevel}
            mapLayers={mapLayers}
            setMapLayers={setMapLayers}
          />
          
          <AnimatePresence>
            {showInfoTip && tipAlert && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-12 right-4 bg-white/95 shadow-lg border rounded-xl p-2 pr-8 text-xs max-w-xs z-20"
              >
                <button
                  className="absolute top-1.5 right-1.5 p-1 rounded hover:bg-slate-100"
                  onClick={() => setShowInfoTip(false)}
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-sky-600" />
                  <div>
                    <div className="text-sky-700 font-medium">
                      隣地 登記変更を検出
                    </div>
                    <div className="mt-0.5">
                      {tipAlert.parcel ?? '（サンプル）堺市中区…'}
                    </div>
                    <div className="text-slate-500">
                      {tipAlert.change ?? '所有者変更'} / {tipAlert.date ?? '2025-09-01'}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <PropertySlideOver
          open={openDetail}
          asset={selectedAsset}
          onClose={() => setOpenDetail(false)}
          proposals={proposals}
        />
      </div>
    </div>
  );
};

export default AssetView;