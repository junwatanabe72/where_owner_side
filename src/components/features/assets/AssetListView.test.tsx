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

beforeEach(() => {
  act(() => {
    useAssetStore.setState({ assets: [mockAsset] });
  });
});

afterEach(() => {
  act(() => {
    useAssetStore.setState({ assets: initialAssets });
  });
});

describe('AssetListView privacy masking', () => {
  it('masks valuation at 最小公開', () => {
    render(<AssetListView privacyLevel="最小公開" />);
    expect(screen.getAllByText('***')[0]).toBeInTheDocument();
  });

  it('shows rounded valuation label at 限定公開', () => {
    render(<AssetListView privacyLevel="限定公開" />);
    expect(screen.getByText('約40千万円')).toBeInTheDocument();
  });

  it('reveals full valuation at フル公開', () => {
    render(<AssetListView privacyLevel="フル公開" />);
    expect(screen.getByText('¥ 4.00億')).toBeInTheDocument();
  });
});
