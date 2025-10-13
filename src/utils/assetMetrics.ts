import { Asset } from '../types';

export interface AssetTotals {
  totalArea: number;
  totalValuation: number;
}

export const calculateAssetTotals = (assets: Asset[]): AssetTotals => {
  return assets.reduce<AssetTotals>(
    (acc, asset) => ({
      totalArea: acc.totalArea + (asset.area || 0),
      totalValuation: acc.totalValuation + (asset.valuationMedian || 0),
    }),
    { totalArea: 0, totalValuation: 0 }
  );
};
