import React from 'react';
import { Asset } from '../../../types';
import { formatCurrency } from '../../../utils';
import KPI from '../../common/KPI';

interface AssetListSidebarProps {
  assets: Asset[];
  selected: number | null;
  onAssetClick: (assetId: number) => void;
  totalValuation: number;
  setIsSidebarOpen?: (open: boolean) => void;
}

const AssetListSidebar: React.FC<AssetListSidebarProps> = ({
  assets,
  selected,
  onAssetClick,
  totalValuation,
  setIsSidebarOpen,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow p-3 h-full overflow-y-auto flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">所有不動産のリスト</div>
        <div className="text-xs text-slate-500">登録数: {assets.length}件</div>
      </div>
      <div className="mt-2 grid grid-cols-1 gap-2 text-center">
        <KPI label="評価額（概算）" value={formatCurrency(totalValuation)} />
      </div>
      <div className="mt-3 divide-y flex-1 overflow-y-auto">
        {assets.map((asset) => (
          <button
            key={asset.id}
            onClick={() => {
              onAssetClick(asset.id);
              if (setIsSidebarOpen) setIsSidebarOpen(false);
            }}
            className={`w-full text-left p-3 rounded-lg ${
              selected === asset.id ? 'bg-emerald-50' : 'hover:bg-slate-50'
            }`}
          >
            <div className="text-sm font-semibold">{asset.address}</div>
            <div className="text-xs text-slate-600 mt-1">{asset.memo}</div>
            <div className="text-xs mt-1">{asset.status}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AssetListSidebar;