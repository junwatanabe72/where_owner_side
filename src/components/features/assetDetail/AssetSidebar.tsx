import React from 'react';
import { Ruler, Home, Navigation, Calendar, Star } from 'lucide-react';
import { Asset } from '../../../types';

interface AssetSidebarProps {
  asset: Asset;
  formatCurrency: (value: number) => string;
  formatNumber: (value: number) => string;
}

const AssetSidebar: React.FC<AssetSidebarProps> = ({ 
  asset, 
  formatCurrency, 
  formatNumber 
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{asset.name || asset.address}</h1>
        <p className="text-sm text-gray-600 mt-1">{asset.address}</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
        <div className="text-xs text-gray-600 mb-1">評価額レンジ</div>
        <div className="text-2xl font-bold text-gray-900">
          {formatCurrency(asset.valuationMedian || 0)}
        </div>
        {asset.valuationMin && asset.valuationMax && (
          <div className="text-sm text-gray-600 mt-1">
            {formatCurrency(asset.valuationMin)} ~ {formatCurrency(asset.valuationMax)}
          </div>
        )}
        <div className="flex items-center mt-2 space-x-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium ml-1">
              {(asset as any).confidenceScore || 'N/A'}
            </span>
          </div>
          <span className="text-xs text-gray-500">信頼度</span>
        </div>
      </div>

      <div className="space-y-3">
        <AssetInfoItem 
          icon={<Ruler className="w-5 h-5 text-gray-400 mt-0.5" />}
          label="地積"
          value={`${formatNumber(asset.area)}㎡ (${formatNumber(asset.area * 0.3025)}坪)`}
        />
        <AssetInfoItem 
          icon={<Home className="w-5 h-5 text-gray-400 mt-0.5" />}
          label="用途地域"
          value={(asset as any).zoning || '指定なし'}
        />
        <AssetInfoItem 
          icon={<Navigation className="w-5 h-5 text-gray-400 mt-0.5" />}
          label="接道"
          value={(asset as any).roadAccess || '情報なし'}
        />
        <AssetInfoItem 
          icon={<Calendar className="w-5 h-5 text-gray-400 mt-0.5" />}
          label="最終更新"
          value={(asset as any).lastUpdated || new Date().toLocaleDateString('ja-JP')}
        />
      </div>
    </div>
  );
};

interface AssetInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const AssetInfoItem: React.FC<AssetInfoItemProps> = ({ icon, label, value }) => (
  <div className="flex items-start space-x-3">
    {icon}
    <div>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-sm text-gray-600">{value}</div>
    </div>
  </div>
);

export default AssetSidebar;