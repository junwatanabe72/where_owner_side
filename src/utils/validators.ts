import { PrivacyLevel, MapLayers } from '../types';

export const isLayerAllowed = (
  layer: keyof MapLayers,
  privacyLevel: PrivacyLevel
): boolean => {
  const restrictions: Record<keyof MapLayers, PrivacyLevel[]> = {
    youto: ['最小公開', '限定公開', 'フル公開'],
    admin: ['最小公開', '限定公開', 'フル公開'],
    koudo: ['限定公開', 'フル公開'],
    bouka: ['限定公開', 'フル公開'],
    height: ['フル公開'],
    boundary: ['フル公開'],
    diff: ['フル公開'],
    night: ['フル公開'],
    potential: ['フル公開'],
  };

  return restrictions[layer].includes(privacyLevel);
};

export const validateAssetData = (asset: any): boolean => {
  return !!(
    asset &&
    asset.id &&
    asset.address &&
    typeof asset.lat === 'number' &&
    typeof asset.lng === 'number' &&
    typeof asset.area === 'number'
  );
};