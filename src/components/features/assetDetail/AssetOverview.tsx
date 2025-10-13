import React, { useMemo } from 'react';
import {
  Building2,
  MapPin,
  ShieldAlert,
  ClipboardList,
  Factory,
  Navigation,
  Landmark,
  FileText as FileTextIcon,
} from 'lucide-react';
import { Asset, PrivacyLevel } from '../../../types';
import buildingData, { BuildingRecord } from '../../../data/building';
import tocitokiData, { RegistryRecord } from '../../../data/tocitoki';
import {
  formatAssetStatus,
  formatArea,
  formatAreaByPrivacy,
  formatDate,
} from '../../../utils';

const buildingIndex: Map<number, BuildingRecord> = new Map(
  buildingData.buildings.map((record) => [
    record.assetId,
    record,
  ])
);

const registryIndex: Map<number, RegistryRecord> = new Map(
  tocitokiData.records.map((record) => [
    record.assetId,
    record,
  ])
);

interface AssetOverviewProps {
  asset: Asset;
  privacyLevel: PrivacyLevel;
}

const AssetOverview: React.FC<AssetOverviewProps> = ({ asset, privacyLevel }) => {
  const building = useMemo(
    () => buildingIndex.get(asset.id),
    [asset.id]
  );
  const registry = useMemo(
    () => registryIndex.get(asset.id),
    [asset.id]
  );

  const buildingRegistry = building?.buildingRegistry;
  const landRegistry = registry?.landRegistry;

  const metrics = [
    {
      label: '登記地目',
      value: landRegistry?.landCategory ?? registry?.landUse ?? '-',
    },
    {
      label: '登記地積',
      value:
        landRegistry?.area != null
          ? privacyLevel === '最小公開'
            ? '***'
            : `${landRegistry.area.toLocaleString()}㎡`
          : formatAreaByPrivacy(asset.area, privacyLevel),
    },
    {
      label: '建物用途（登記）',
      value:
        buildingRegistry?.use ??
        (building?.primaryUses?.length ? building.primaryUses.join('・') : '-'),
    },
    {
      label: '最終調査日',
      value: registry?.lastSurvey ? formatDate(registry.lastSurvey) : '-',
    },
  ];

  return (
    <div className="space-y-6">
      <section className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest">
              <Building2 className="w-4 h-4" />
              物件概要
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">
              {building?.projectName ?? asset.name ?? '対象物件'}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-400" />
                {building?.address ?? asset.address}
              </span>
              {asset.nearestStation && (
                <span className="inline-flex items-center gap-1">
                  <Navigation className="w-4 h-4 text-slate-400" />
                  {asset.nearestStation}（徒歩{asset.stationDistance ?? '-'}分）
                </span>
              )}
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg px-4 py-3 text-sm text-slate-600 w-full md:w-auto">
            <div>現況: {formatAssetStatus(asset.status)}</div>
            <div className="mt-1">
              所有者（加工済）: {building?.ownerAlias ?? '非公開'}
            </div>
            {building?.managerAlias && (
              <div>PM（加工済）: {building.managerAlias}</div>
            )}
          </div>
        </div>
        {asset.memo && (
          <p className="mt-4 text-sm text-slate-600 leading-relaxed">
            {asset.memo}
          </p>
        )}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-white rounded-xl border shadow-sm p-4"
          >
            <div className="text-xs font-medium text-slate-500">
              {metric.label}
            </div>
            <div className="mt-2 text-lg font-semibold text-slate-900">
              {metric.value}
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Landmark className="w-4 h-4 text-indigo-500" />
            土地の登記概要
          </div>
          {landRegistry ? (
            <div className="space-y-4 text-sm text-slate-600">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase">地番</div>
                  <div>{landRegistry.parcelId ?? '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase">登記地目</div>
                  <div>{landRegistry.landCategory ?? registry?.landUse ?? '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase">登記地積</div>
                  <div>
                    {landRegistry.area != null
                      ? privacyLevel === '最小公開'
                        ? '***'
                        : `${landRegistry.area.toLocaleString()}㎡`
                      : formatAreaByPrivacy(asset.area, privacyLevel)}
                  </div>
                </div>
                {landRegistry.remarks?.length ? (
                  <div>
                    <div className="text-xs text-slate-500 uppercase">備考</div>
                    <div>{landRegistry.remarks[0]}</div>
                  </div>
                ) : null}
              </div>

              {landRegistry.rights?.length ? (
                <div>
                  <div className="text-xs text-slate-500 uppercase">権利関係（匿名化）</div>
                  <ul className="mt-2 space-y-2">
                    {landRegistry.rights.map((right, index) => (
                      <li
                        key={`${right.type}-${index}`}
                        className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2"
                      >
                        <FileTextIcon className="w-4 h-4 text-slate-400 mt-1" />
                        <div>
                          <div className="text-sm font-medium text-slate-800">
                            {right.type}
                          </div>
                          <div className="text-xs text-slate-500">{right.holder}</div>
                          {right.status && (
                            <div className="text-xs text-slate-500 mt-1">{right.status}</div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {registry?.zoningNotes?.length ? (
                <div>
                  <div className="text-xs text-slate-500 uppercase">用途地域・指定</div>
                  <ul className="mt-2 space-y-1">
                    {registry.zoningNotes.map((note) => (
                      <li key={note} className="flex items-start gap-2">
                        <span className="mt-2 block h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              土地登記情報は現在整理中です。
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Factory className="w-4 h-4 text-blue-500" />
            建物の登記概要
          </div>
          {buildingRegistry ? (
            <div className="space-y-4 text-sm text-slate-600">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 uppercase">家屋番号</div>
                  <div>{buildingRegistry.buildingNumber ?? '-'}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase">用途</div>
                  <div>
                    {buildingRegistry.use ??
                      (building?.primaryUses?.length
                        ? building.primaryUses.join('・')
                        : '-')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase">構造 / 階数</div>
                  <div>
                    {buildingRegistry.mainStructure ??
                      building?.structure ??
                      '-'}
                    {building?.floors
                      ? `（地上${building.floors.above ?? '-'}階・地下${building.floors.below ?? 0}階）`
                      : ''}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase">延床面積</div>
                  <div>
                    {buildingRegistry.totalFloorArea != null
                      ? formatArea(buildingRegistry.totalFloorArea)
                      : building?.totalFloorArea != null
                      ? formatArea(building.totalFloorArea)
                      : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 uppercase">竣工</div>
                  <div>{buildingRegistry.completion ?? building?.completion ?? '-'}</div>
                </div>
              </div>
              {buildingRegistry.remarks?.length ? (
                <div>
                  <div className="text-xs text-slate-500 uppercase">附属建物等</div>
                  <ul className="mt-2 space-y-1">
                    {buildingRegistry.remarks.map((remark) => (
                      <li key={remark} className="flex items-start gap-2">
                        <span className="mt-2 block h-1.5 w-1.5 rounded-full bg-slate-400" />
                        <span>{remark}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              建物登記情報は現在整理中です。
            </div>
          )}
        </div>
      </section>

      <section className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          都市計画・法務トピック（匿名化済）
        </div>
        {registry ? (
          <div className="space-y-4 text-sm text-slate-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-xs text-slate-500 uppercase">最終調査日</div>
                <div>{formatDate(registry.lastSurvey)}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">地目</div>
                <div>{registry.landUse}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase">用途地域</div>
                <div>{registry.zoningNotes.join(' / ')}</div>
              </div>
            </div>
            {registry.pendingApplications.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase mb-2">
                  <ClipboardList className="w-4 h-4 text-emerald-500" />
                  申請・協議状況
                </div>
                <div className="space-y-2">
                  {registry.pendingApplications.map((item, index) => (
                    <div
                      key={`${item.type}-${index}`}
                      className="rounded-lg border border-emerald-100 bg-emerald-50/60 px-3 py-2"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-600">
                        <span className="font-semibold">{item.type}</span>
                        <span className="rounded-full bg-white px-2 py-0.5 border border-emerald-100">
                          {item.status}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-slate-600 leading-relaxed">
                        {item.summary}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {registry.registryAlerts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase mb-2">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  直近のアラート
                </div>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden">
                  {registry.registryAlerts.map((alert, index) => (
                    <div key={`${alert.date}-${index}`} className="px-4 py-3 bg-slate-50/60">
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        <span>{formatDate(alert.date)}</span>
                        <span className="inline-flex items-center rounded bg-white px-2 py-0.5 border border-slate-200">
                          {alert.category}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-slate-700 leading-relaxed">
                        {alert.summary}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-slate-500">
            当該物件の法務トピックは現在整理中です。
          </div>
        )}
      </section>
    </div>
  );
};

export default AssetOverview;
