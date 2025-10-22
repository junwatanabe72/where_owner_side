/**
 * 登記概要タブ
 *
 * 土地と建物の登記情報を表示
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  ChevronDown,
  Info,
  MapPin,
} from 'lucide-react';
import { registryParcels } from '../../../data/mockRegistryData';

const TSUBO_PER_SQM = 1 / 3.305785;

const formatNumber = (value: number, fraction = 2) =>
  value.toLocaleString('ja-JP', {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  });

const formatTsubo = (areaSqm: number) => formatNumber(areaSqm * TSUBO_PER_SQM, 2);

const RegistryTab: React.FC = () => {
  const [selectedParcelId, setSelectedParcelId] = useState(
    registryParcels[0]?.id ?? ''
  );

  const activeParcel = useMemo(
    () => registryParcels.find((parcel) => parcel.id === selectedParcelId),
    [selectedParcelId]
  );

  const buildingOptions = useMemo(
    () => activeParcel?.buildings ?? [],
    [activeParcel]
  );

  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(
    () => buildingOptions[0]?.id ?? null
  );

  const [activeRegistryType, setActiveRegistryType] = useState<'land' | 'building'>(
    () => (buildingOptions.length > 0 ? 'land' : 'land')
  );

  useEffect(() => {
    if (buildingOptions.length === 0) {
      setSelectedBuildingId(null);
      setActiveRegistryType('land');
      return;
    }
    if (!buildingOptions.some((building) => building.id === selectedBuildingId)) {
      setSelectedBuildingId(buildingOptions[0]?.id ?? null);
    }
  }, [buildingOptions, selectedBuildingId]);

  const activeBuilding = useMemo(() => {
    if (!selectedBuildingId) return null;
    return buildingOptions.find((building) => building.id === selectedBuildingId) ?? null;
  }, [buildingOptions, selectedBuildingId]);

  const aggregateAreaSqm = useMemo(
    () => registryParcels.reduce((sum, parcel) => sum + parcel.areaSqm, 0),
    []
  );

  if (!activeParcel) {
    return (
      <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center text-gray-500">
        登記情報がまだ登録されていません。
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <header className="px-6 py-4 border-b border-gray-100 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {registryParcels.map((parcel) => {
              const isActive = parcel.id === selectedParcelId;
              return (
                <button
                  key={parcel.id}
                  type="button"
                  onClick={() => setSelectedParcelId(parcel.id)}
                  className={`px-4 py-2 text-sm rounded-full border transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-pressed={isActive}
                >
                  {parcel.label}
                </button>
              );
            })}
          </div>

          {buildingOptions.length > 0 && activeRegistryType === 'building' && (
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Building2 className="w-4 h-4 text-gray-500" />
              <label htmlFor="registry-building" className="sr-only">
                建物を選択
              </label>
              <div className="relative">
                <select
                  id="registry-building"
                  value={selectedBuildingId ?? ''}
                  onChange={(event) => setSelectedBuildingId(event.target.value || null)}
                  className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {buildingOptions.map((building) => (
                    <option key={building.id} value={building.id}>
                      {building.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}
        </header>

        <div className="px-6 py-6 bg-gradient-to-r from-blue-50/70 to-blue-100/20 border-b border-gray-100">
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{activeParcel.label}</h3>
              <p className="text-sm text-gray-600 mt-1">{activeParcel.address}</p>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">地目:</span>
                  <span className="ml-2 font-medium text-gray-900">{activeParcel.landCategory}</span>
                </div>
                <div>
                  <span className="text-gray-500">地積:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {activeParcel.areaSqm.toLocaleString()}㎡ ({formatTsubo(activeParcel.areaSqm)}坪)
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">用途地域:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {activeParcel.zoningTags.join(', ')}
                  </span>
                </div>
              </div>
              {activeParcel.remarks && activeParcel.remarks.length > 0 && (
                <div className="mt-3 text-xs text-gray-600">
                  <span className="font-medium">備考:</span> {activeParcel.remarks.join(' / ')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <BadgeCheck className="w-4 h-4 text-emerald-600" />
              所有権情報
            </h4>
            <div className="space-y-2">
              {activeParcel.ownership.map((record, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{record.holder}</div>
                    {record.share && <div className="text-sm text-gray-600">持分: {record.share}</div>}
                    <div className="text-xs text-gray-500 mt-1">
                      登記日: {record.registeredAt} | 原因: {record.reason}
                    </div>
                    {record.note && <div className="text-xs text-gray-600 mt-1">{record.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activeParcel.encumbrances.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600" />
                権利制限情報
              </h4>
              <div className="space-y-2">
                {activeParcel.encumbrances.map((record, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{record.type}</div>
                      <div className="text-sm text-gray-700">{record.holder}</div>
                      {record.detail && <div className="text-sm text-gray-600 mt-1">{record.detail}</div>}
                      <div className="text-xs text-gray-500 mt-1">
                        登記日: {record.registeredAt}
                        {record.status && ` | ${record.status}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <div>データソース: {activeParcel.metadata.dataSource}</div>
              <div>最終同期: {activeParcel.metadata.lastSynced}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegistryTab;
