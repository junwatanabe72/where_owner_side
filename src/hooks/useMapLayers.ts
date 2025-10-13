import { useState, useEffect } from 'react';
import { MapLayers, PrivacyLevel } from '../types';
import { getDefaultMapLayers, isLayerAllowed } from '../utils';

export const useMapLayers = (privacyLevel: PrivacyLevel) => {
  const [mapLayers, setMapLayers] = useState<MapLayers>(() =>
    getDefaultMapLayers(privacyLevel)
  );

  useEffect(() => {
    setMapLayers((prev) => {
      const defaults = getDefaultMapLayers(privacyLevel);
      const next: MapLayers = { ...prev };

      (Object.keys(next) as Array<keyof MapLayers>).forEach((layerKey) => {
        if (!isLayerAllowed(layerKey, privacyLevel)) {
          next[layerKey] = false;
        }
      });

      return { ...defaults, ...next };
    });
  }, [privacyLevel]);

  const updateLayer = (layer: keyof MapLayers, value: boolean) => {
    if (value && !isLayerAllowed(layer, privacyLevel)) {
      return;
    }
    setMapLayers((prev) => ({ ...prev, [layer]: value }));
  };

  const resetLayers = () => {
    setMapLayers(getDefaultMapLayers(privacyLevel));
  };

  return {
    mapLayers,
    setMapLayers,
    updateLayer,
    resetLayers,
  };
};
