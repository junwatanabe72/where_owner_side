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

export const getDefaultMapLayers = (_privacyLevel: PrivacyLevel): MapLayers => {
  // 初期状態は全レイヤーを非表示にする
  return {
    youto: false,
    admin: false,
    koudo: false,
    bouka: false,
    height: false,
    boundary: false,
    diff: false,
    night: false,
    potential: false,
  };
};