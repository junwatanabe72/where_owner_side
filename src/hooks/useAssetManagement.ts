import { useState, useMemo } from 'react';
import { Proposal, PrivacyLevel } from '../types';
import {
  convertAssetsToLandProperties,
  filterProposalsByAsset,
  calculateAssetTotals,
} from '../utils';
import useAssetStore from '../store/assetStore';

export const useAssetManagement = () => {
  const {
    assets,
    proposals,
    registryAlerts,
    selectedAssetId,
    setSelectedAssetId,
  } = useAssetStore();

  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('限定公開');
  const [showAssetDetail, setShowAssetDetail] = useState(false);

  const selectedAsset = useMemo(
    () => assets.find((a) => a.id === selectedAssetId) || null,
    [selectedAssetId, assets]
  );

  const { totalValuation } = useMemo(
    () => calculateAssetTotals(assets),
    [assets]
  );

  const landProperties = useMemo(
    () => convertAssetsToLandProperties(assets),
    [assets]
  );

  const handleAssetSelect = (assetId: number) => {
    setSelectedAssetId(assetId);
    setShowAssetDetail(true);
  };

  const handleBackFromDetail = () => {
    setShowAssetDetail(false);
    setSelectedAssetId(null);
  };

  const getRelatedProposals = (assetAddress?: string): Proposal[] => {
    return filterProposalsByAsset(proposals, assetAddress);
  };

  return {
    assets,
    proposals,
    registryAlerts,
    selectedAsset,
    selectedAssetId,
    privacyLevel,
    setPrivacyLevel,
    showAssetDetail,
    totalValuation,
    landProperties,
    handleAssetSelect,
    handleBackFromDetail,
    getRelatedProposals,
  };
};
