import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import AssetListView from './AssetListView';
import useAssetStore from '../../../store/assetStore';
import { Asset } from '../../../types';

const initialAssets = useAssetStore.getState().assets;

const mockAsset: Asset = {
  id: 99,
  name: 'テスト資産',
  address: '東京都中央区テスト 1-1-1',
  memo: 'テストメモ',
  area: 250,
  owner: 'テストオーナー',
  status: 'owned',
  lat: 35.0,
  lng: 135.0,
  zoning: '商業地域',
  valuationMedian: 400000000,
};

const setAssetsWithPrivacy = (privacyLevel: Asset['privacyLevel']) => {
  act(() => {
    useAssetStore.setState({
      assets: [{ ...mockAsset, privacyLevel }],
    });
  });
};

beforeEach(() => {
  setAssetsWithPrivacy('最小公開');
});

afterEach(() => {
  act(() => {
    useAssetStore.setState({ assets: initialAssets });
  });
});

describe('AssetListView valuation display (per asset)', () => {
  it('keeps full valuation at 最小公開', () => {
    setAssetsWithPrivacy('最小公開');
    render(<AssetListView />);
    expect(screen.getByText('¥ 4.00億')).toBeInTheDocument();
  });

  it('keeps full valuation at 限定公開', () => {
    setAssetsWithPrivacy('限定公開');
    render(<AssetListView />);
    expect(screen.getByText('¥ 4.00億')).toBeInTheDocument();
  });

  it('keeps full valuation at フル公開', () => {
    setAssetsWithPrivacy('フル公開');
    render(<AssetListView />);
    expect(screen.getByText('¥ 4.00億')).toBeInTheDocument();
  });
});
