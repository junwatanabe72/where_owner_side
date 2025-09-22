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
  // 初期は衛星
  const [mapMode, setMapMode] = useState<MapMode>('sat');
  const [showLayers, setShowLayers] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showBottomBar, setShowBottomBar] = useState(true);

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
              // すべてのレイヤーをオフ
              setMapLayers({
                ...mapLayers,
                youto: false,
                admin: false,
                koudo: false,
                bouka: false,
                height: false,
                boundary: false,
                diff: false,
                night: false,
                potential: false,
              });
            }}
          >
            解除
          </button>
          {showBottomBar && (
            <div className="hidden md:flex flex-wrap items-center gap-3 text-sm">
              <label className="flex items-center gap-1">
                <input 
                  type="checkbox" 
                  className="w-4 h-4"
                  checked={mapLayers.night}
                  onChange={(e) => handleLayerToggle('night', e.target.checked)}
                /> 
                夜間光
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={mapLayers.youto}
                  onChange={(e) => handleLayerToggle('youto', e.target.checked)}
                />
                用途地域
              </label>
              <label className="flex items-center gap-1">
                <input 
                  type="checkbox" 
                  className="w-4 h-4"
                  checked={mapLayers.potential}
                  onChange={(e) => handleLayerToggle('potential', e.target.checked)}
                /> 
                産業候補ポイント
              </label>
              <label className="flex items-center gap-1">
                <input 
                  type="checkbox" 
                  className="w-4 h-4"
                  checked={mapLayers.koudo}
                  onChange={(e) => handleLayerToggle('koudo', e.target.checked)}
                /> 
                高度地区
              </label>
              <label className="flex items-center gap-1">
                <input 
                  type="checkbox" 
                  className="w-4 h-4"
                  checked={mapLayers.diff}
                  onChange={(e) => handleLayerToggle('diff', e.target.checked)}
                /> 
                差分の大きい地域
              </label>
              <label className="flex items-center gap-1">
                <input 
                  type="checkbox" 
                  className="w-4 h-4"
                  checked={mapLayers.bouka}
                  onChange={(e) => handleLayerToggle('bouka', e.target.checked)}
                /> 
                防火地域
              </label>
              <label className="flex items-center gap-1">
                <input 
                  type="checkbox" 
                  className="w-4 h-4"
                  checked={mapLayers.boundary}
                  onChange={(e) => handleLayerToggle('boundary', e.target.checked)}
                /> 
                筆界
              </label>
              <label className="flex items-center gap-1">
                <input 
                  type="checkbox" 
                  className="w-4 h-4"
                  checked={mapLayers.admin}
                  onChange={(e) => handleLayerToggle('admin', e.target.checked)}
                /> 
                行政区画
              </label>
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