import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, MapPin, Building2, Ruler, Train, Home } from 'lucide-react';
import { PrivacyLevel } from '../../../types';
import { formatCurrency } from '../../../utils';
import useAssetStore from '../../../store/assetStore';

interface AssetListViewProps {
  proposals?: any[];
  privacyLevel: PrivacyLevel;
  onAssetClick?: (assetId: number) => void;
}

type SortField = 'name' | 'address' | 'zoning' | 'area' | 'nearestStation' | 'landCategory' | 'valuationMedian';
type SortOrder = 'asc' | 'desc';

const AssetListView: React.FC<AssetListViewProps> = ({
  privacyLevel,
  onAssetClick,
}) => {
  const { assets } = useAssetStore();
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortedAssets = useMemo(() => {
    const sorted = [...assets].sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortField) {
        case 'name':
          aVal = a.name || '';
          bVal = b.name || '';
          break;
        case 'address':
          aVal = a.address || '';
          bVal = b.address || '';
          break;
        case 'zoning':
          aVal = a.zoning || '';
          bVal = b.zoning || '';
          break;
        case 'area':
          aVal = a.area || 0;
          bVal = b.area || 0;
          break;
        case 'nearestStation':
          aVal = a.nearestStation || '';
          bVal = b.nearestStation || '';
          break;
        case 'landCategory':
          aVal = a.landCategory || '';
          bVal = b.landCategory || '';
          break;
        case 'valuationMedian':
          aVal = a.valuationMedian || 0;
          bVal = b.valuationMedian || 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [assets, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ?
      <ChevronUp className="w-4 h-4" /> :
      <ChevronDown className="w-4 h-4" />;
  };


  const formatArea = (area?: number) => {
    if (!area) return '-';
    if (privacyLevel === '最小公開') return '***';
    return `${area.toLocaleString('ja-JP')}㎡`;
  };

  const formatValuation = (value?: number) => {
    if (!value) return '-';
    if (privacyLevel === '最小公開') return '***';
    if (privacyLevel === '限定公開') {
      const millions = Math.round(value / 10000000);
      return `約${millions}千万円`;
    }
    return formatCurrency(value);
  };

  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          所有不動産一覧
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3">
                <button
                  className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('name')}
                >
                  物件名
                  <SortIcon field="name" />
                </button>
              </th>
              <th className="text-left px-6 py-3">
                <button
                  className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('address')}
                >
                  所在地
                  <SortIcon field="address" />
                </button>
              </th>
              <th className="text-left px-6 py-3">
                <button
                  className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('zoning')}
                >
                  用途地域
                  <SortIcon field="zoning" />
                </button>
              </th>
              <th className="text-center px-6 py-3">
                <span className="text-xs font-medium text-slate-600">
                  建蔽率/容積率
                </span>
              </th>
              <th className="text-right px-6 py-3">
                <button
                  className="flex items-center gap-1 ml-auto text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('area')}
                >
                  地積
                  <SortIcon field="area" />
                </button>
              </th>
              <th className="text-left px-6 py-3">
                <button
                  className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('nearestStation')}
                >
                  最寄駅
                  <SortIcon field="nearestStation" />
                </button>
              </th>
              <th className="text-left px-6 py-3">
                <button
                  className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('landCategory')}
                >
                  地目
                  <SortIcon field="landCategory" />
                </button>
              </th>
              <th className="text-right px-6 py-3">
                <button
                  className="flex items-center gap-1 ml-auto text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('valuationMedian')}
                >
                  評価額
                  <SortIcon field="valuationMedian" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedAssets.map((asset) => (
              <tr
                key={asset.id}
                onClick={() => onAssetClick?.(asset.id)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900">
                    {asset.name || `物件 ${asset.id}`}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-400" />
                    <div className="text-sm text-slate-700">
                      {asset.address}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-700">
                      {asset.zoning || '-'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-sm text-slate-700">
                    {asset.coverageRatio || '-'}% / {asset.floorAreaRatio || '-'}%
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Ruler className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-900">
                      {formatArea(asset.area)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Train className="w-4 h-4 text-slate-400" />
                    <div>
                      <div className="text-sm text-slate-700">
                        {asset.nearestStation || '-'}
                      </div>
                      {asset.stationDistance && (
                        <div className="text-xs text-slate-500">
                          徒歩{asset.stationDistance}分
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {asset.landCategory || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm font-semibold text-slate-900">
                    {formatValuation(asset.valuationMedian)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedAssets.length === 0 && (
          <div className="px-6 py-12 text-center text-slate-500">
            表示する不動産がありません
          </div>
        )}
      </div>

      <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div>
            全 {assets.length} 件
          </div>
          <div className="flex items-center gap-4">
            <div>
              総地積: {formatArea(assets.reduce((sum, asset) => sum + (asset.area || 0), 0))}
            </div>
            <div>
              総評価額: {formatCurrency(assets.reduce((sum, asset) => sum + (asset.valuationMedian || 0), 0))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetListView;