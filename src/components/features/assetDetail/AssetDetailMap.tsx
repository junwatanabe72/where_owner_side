import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Map from '../../../map';
import LayerToggle from '../../atoms/LayerToggle';
import { MapMode, MapLayers, PrivacyLevel, LandProperty } from '../../../types';
import { isLayerAllowed } from '../../../utils';

interface AssetDetailMapProps {
  landProperties: LandProperty[];
  privacyLevel: PrivacyLevel;
  mapLayers: MapLayers;
  setMapLayers: (layers: MapLayers) => void;
}

const AssetDetailMap: React.FC<AssetDetailMapProps> = ({
  landProperties,
  privacyLevel,
  mapLayers,
  setMapLayers,
}) => {
  const [mapMode, setMapMode] = useState<MapMode>('map');
  const [showLayers, setShowLayers] = useState(false);

  const handleLayerToggle = (layer: keyof MapLayers, value: boolean) => {
    setMapLayers({ ...mapLayers, [layer]: value });
  };

  return (
    <div className="relative h-full">
      <Map
        currentStore={landProperties}
        isSample={true}
        privacyLevel={privacyLevel}
        mapMode={mapMode}
        mapLayers={mapLayers}
      />
      
      <div className="absolute top-4 left-4 flex space-x-2">
        <button
          onClick={() => setMapMode('map')}
          className={`px-3 py-2 backdrop-blur rounded-lg text-sm shadow-sm border ${
            mapMode === 'map'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white/95 hover:bg-gray-50'
          }`}
        >
          地図
        </button>
        <button
          onClick={() => setMapMode('sat')}
          className={`px-3 py-2 backdrop-blur rounded-lg text-sm shadow-sm border ${
            mapMode === 'sat'
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white/95 hover:bg-gray-50'
          }`}
        >
          航空写真
        </button>
      </div>

      <div className="absolute bottom-4 right-4">
        <button
          onClick={() => setShowLayers(!showLayers)}
          className="p-2 bg-white/95 backdrop-blur rounded-lg shadow-sm border hover:bg-gray-50"
        >
          <Layers className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <AnimatePresence>
        {showLayers && (
          <motion.div
            className="absolute bottom-16 right-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="bg-white/95 backdrop-blur rounded-lg p-3 shadow-lg border">
              <div className="space-y-2">
                <LayerToggle
                  label="用途地域"
                  checked={mapLayers.youto}
                  onChange={(v) => handleLayerToggle('youto', v)}
                  disabled={!isLayerAllowed('youto', privacyLevel)}
                />
                <LayerToggle
                  label="高度地区"
                  checked={mapLayers.koudo}
                  onChange={(v) => handleLayerToggle('koudo', v)}
                  disabled={!isLayerAllowed('koudo', privacyLevel)}
                />
                <LayerToggle
                  label="防火地域"
                  checked={mapLayers.bouka}
                  onChange={(v) => handleLayerToggle('bouka', v)}
                  disabled={!isLayerAllowed('bouka', privacyLevel)}
                />
                <LayerToggle
                  label="建物高さ"
                  checked={mapLayers.height}
                  onChange={(v) => handleLayerToggle('height', v)}
                  disabled={!isLayerAllowed('height', privacyLevel)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssetDetailMap;
