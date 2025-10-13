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
  onLayerToggle: (layer: keyof MapLayers, value: boolean) => void;
  onResetLayers: () => void;
}

const MapView: React.FC<MapViewProps> = ({
  landProperties,
  privacyLevel,
  mapLayers,
  onLayerToggle,
  onResetLayers,
}) => {
  // 初期は衛星
  const [mapMode, setMapMode] = useState<MapMode>('sat');
  const [showLayers, setShowLayers] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showBottomBar, setShowBottomBar] = useState(true);

  const handleLayerToggle = (layer: keyof MapLayers, value: boolean) => {
    if (!isLayerAllowed(layer, privacyLevel)) {
      return;
    }
    onLayerToggle(layer, value);
  };

  const layerOptions: Array<{ key: keyof MapLayers; label: string }> = [
    { key: 'youto', label: '用途地域' },
    { key: 'koudo', label: '高度地区' },
    { key: 'bouka', label: '防火地域' },
    { key: 'height', label: '建物高さ' },
  ];

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
        <div className="flex gap-2 items-center">
          <div className="flex bg-white/95 rounded-lg shadow-sm border overflow-hidden">
            <button
              onClick={() => setMapMode('map')}
              className={`px-3 py-2 text-sm ${mapMode === 'map' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
            >
              地図
            </button>
            <button
              onClick={() => setMapMode('sat')}
              className={`px-3 py-2 text-sm ${mapMode === 'sat' ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
            >
              航空写真
            </button>
          </div>
          <div className="flex-1">
            <SearchInput
              placeholder="例: 東京都中央区…"
              value={searchValue}
              onChange={setSearchValue}
              className="w-full"
            />
          </div>
        </div>
      </div>      
      {/* 下部中央のレイヤーバー（常時） */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white/95 backdrop-blur shadow-md border rounded-full px-3 py-2 flex items-center gap-3">
          <button
            className="text-white bg-red-500 text-xs px-3 py-1 rounded-full"
            onClick={() => {
              onResetLayers();
            }}
          >
            解除
          </button>
          {showBottomBar && (
            <div className="hidden md:flex flex-wrap items-center gap-3 text-sm">
              {layerOptions.map(({ key, label }) => (
                <LayerToggle
                  key={key}
                  label={label}
                  checked={mapLayers[key]}
                  onChange={(checked) => handleLayerToggle(key, checked)}
                  disabled={!isLayerAllowed(key, privacyLevel)}
                />
              ))}
            </div>
          )}
          <button onClick={() => setShowBottomBar(!showBottomBar)} className="ml-1 p-1 rounded-full hover:bg-gray-100">
            <span className="inline-block rotate-0">{showBottomBar ? '▾' : '▴'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapView;
