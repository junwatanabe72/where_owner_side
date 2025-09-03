import { useState, useEffect } from 'react';
import { MapLayers, PrivacyLevel } from '../types';
import { getDefaultMapLayers } from '../utils';

export const useMapLayers = (privacyLevel: PrivacyLevel) => {
  const [mapLayers, setMapLayers] = useState<MapLayers>(
    getDefaultMapLayers(privacyLevel)
  );

  useEffect(() => {
    setMapLayers(getDefaultMapLayers(privacyLevel));
  }, [privacyLevel]);

  const updateLayer = (layer: keyof MapLayers, value: boolean) => {
    setMapLayers((prev) => ({ ...prev, [layer]: value }));
  };

  return {
    mapLayers,
    setMapLayers,
    updateLayer,
  };
};