import { Asset, LandProperty, MapLayers, PrivacyLevel } from '../types';

export const convertAssetsToLandProperties = (assets: Asset[]): LandProperty[] => {
  return assets.map((asset) => ({
    nearStation: [{ 
      min: 5, 
      geometry: { 
        lat: asset.lat, 
        lng: asset.lng 
      } 
    }],
    wood: { 
      originalRaito: 750 
    },
    address: asset.address,
    area: asset.area,
  }));
};

export const getDefaultMapLayers = (privacyLevel: PrivacyLevel): MapLayers => {
  const isLimited = privacyLevel !== '最小公開';
  const isFull = privacyLevel === 'フル公開';
  
  return {
    youto: true,
    admin: true,
    koudo: isLimited,
    bouka: isLimited,
    height: isFull,
    boundary: isFull,
    diff: isFull,
    night: isFull,
    potential: isFull,
  };
};