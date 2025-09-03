import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Map from '../../../map';
import LayerToggle from '../../atoms/LayerToggle';
import SearchInput from '../../common/SearchInput';
import { MapMode, MapLayers, PrivacyLevel, LandProperty } from '../../../types';
import { isLayerAllowed } from '../../../utils';

interface MapViewProps {
  landProperties: LandProperty[];
  privacyLevel: PrivacyLevel;
  mapLayers: MapLayers;
  setMapLayers: (layers: MapLayers) => void;
}

const MapView: React.FC<MapViewProps> = ({
  landProperties,
  privacyLevel,
  mapLayers,
  setMapLayers,
}) => {
  const [mapMode, setMapMode] = useState<MapMode>('map');
  const [showLayers, setShowLayers] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleLayerToggle = (layer: keyof MapLayers, value: boolean) => {
    setMapLayers({ ...mapLayers, [layer]: value });
  };

  return (
    <div className="relative h-[66vh] min-h-[520px]">
      <Map
        currentStore={landProperties}
        isSample={true}
        privacyLevel={privacyLevel}
        mapMode={mapMode}
        mapLayers={mapLayers}
      />
      
      <div className="absolute top-3 left-3 right-3 z-10">
        <div className="flex gap-2">
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
          <SearchInput
            placeholder="マップを検索"
            value={searchValue}
            onChange={setSearchValue}
            className="flex-1"
          />
        </div>
      </div>

      <div className="absolute bottom-3 right-3 z-10">
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
            className="absolute bottom-16 right-3 z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <div className="w-auto bg-white/95 backdrop-blur rounded-lg p-2 shadow-lg border">
              <div className="flex flex-wrap gap-2">
                <LayerToggle
                  label="用途地域"
                  checked={mapLayers.youto}
                  onChange={(v) => handleLayerToggle('youto', v)}
                  disabled={!isLayerAllowed('youto', privacyLevel)}
                />
                <LayerToggle
                  label="行政区画"
                  checked={mapLayers.admin}
                  onChange={(v) => handleLayerToggle('admin', v)}
                  disabled={!isLayerAllowed('admin', privacyLevel)}
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
                <LayerToggle
                  label="筆界"
                  checked={mapLayers.boundary}
                  onChange={(v) => handleLayerToggle('boundary', v)}
                  disabled={!isLayerAllowed('boundary', privacyLevel)}
                />
                <LayerToggle
                  label="差異検出"
                  checked={mapLayers.diff}
                  onChange={(v) => handleLayerToggle('diff', v)}
                  disabled={!isLayerAllowed('diff', privacyLevel)}
                />
                <LayerToggle
                  label="夜間光"
                  checked={mapLayers.night}
                  onChange={(v) => handleLayerToggle('night', v)}
                  disabled={!isLayerAllowed('night', privacyLevel)}
                />
                <LayerToggle
                  label="高ポテンシャル"
                  checked={mapLayers.potential}
                  onChange={(v) => handleLayerToggle('potential', v)}
                  disabled={!isLayerAllowed('potential', privacyLevel)}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapView;