import React, { useEffect, useMemo, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  ChevronDown,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Info,
  Layers,
  MapPin,
  Ruler,
} from 'lucide-react';

type OwnershipRecord = {
  holder: string;
  share?: string;
  registeredAt: string;
  reason?: string;
  note?: string;
};

type EncumbranceRecord = {
  type: string;
  holder: string;
  registeredAt: string;
  detail?: string;
  status?: string;
};

export type Attachment = {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'cad';
  updated: string;
  note?: string;
};

type BuildingRegistrySummary = {
  buildingNumber: string;
  structure: string;
  use: string;
  floorArea: number;
  completion: string;
  remarks?: string[];
  ownership: OwnershipRecord[];
  encumbrances: EncumbranceRecord[];
};

type BuildingOption = {
  id: string;
  name: string;
  description?: string;
  attachments?: Attachment[];
  registry: BuildingRegistrySummary;
};

export type ParcelData = {
  id: string;
  label: string;
  address: string;
  landCategory: string;
  areaSqm: number;
  measurementBasis: string;
  measurementDate: string;
  measurementNote?: string;
  zoningTags: string[];
  remarks?: string[];
  ownership: OwnershipRecord[];
  encumbrances: EncumbranceRecord[];
  attachments: Attachment[];
  metadata: {
    lastSynced: string;
    dataSource: string;
    measuredOn: string;
  };
  buildings?: BuildingOption[];
};

export const registryParcels: ParcelData[] = [
  {
    id: 'marunouchi-1-1',
    label: '丸の内一丁目1番1',
    address: '東京都千代田区丸の内一丁目1番1',
    landCategory: '宅地',
    areaSqm: 320.45,
    measurementBasis: '登記簿面積',
    measurementDate: '2024-12-15',
    measurementNote: '2024年12月15日 登記記録更新',
    zoningTags: ['商業地域', '特定街区（丸の内・有楽町地区）'],
    remarks: [
      '都市再生緊急整備地域（丸の内・有楽町地区）内',
      '道路後退部分：12.5㎡（計画道路）',
    ],
    ownership: [
      {
        holder: 'M***資産パートナーズ合同会社',
        share: '全部',
        registeredAt: '2022-08-04',
        reason: '所有権移転（吸収合併）',
      },
    ],
    encumbrances: [
      {
        type: '抵当権',
        holder: 'A***信託銀行',
        registeredAt: '2023-03-28',
        detail: '極度額 12億円 / 共同担保目録 第3番',
        status: '存続',
      },
      {
        type: '根抵当権',
        holder: 'B***銀行',
        registeredAt: '2018-07-19',
        detail: '極度額 5億円',
        status: '2025-07-12 抹消',
      },
    ],
    attachments: [
      {
        id: 'map-1',
        name: '公図（最新ダウンロード版）',
        type: 'pdf',
        updated: '2025-08-21',
        note: '法務局オンライン発行',
      },
      {
        id: 'survey-1',
        name: '地積測量図 2024-04-22',
        type: 'pdf',
        updated: '2024-04-22',
      },
      {
        id: 'photo-1',
        name: '外観写真（北側）',
        type: 'image',
        updated: '2025-06-11',
      },
    ],
    metadata: {
      lastSynced: '2025-09-08 09:42',
      dataSource: '登記情報提供サービス（法務局オンライン）',
      measuredOn: '登記簿面積（2024-12-15）',
    },
    buildings: [
      {
        id: 'main-tower',
        name: '本館（丸の内シナジータワー）',
        description: '鉄骨造一部鉄骨鉄筋コンクリート造 / 地上24階 地下2階',
        attachments: [
          {
            id: 'main-tower-blueprint',
            name: '建築確認図書（主要構造図）',
            type: 'pdf',
            updated: '2024-05-18',
            note: '構造安全性検証済み（改修反映）',
          },
          {
            id: 'main-tower-floorplans',
            name: 'フロアプラン（B2F〜24F）',
            type: 'cad',
            updated: '2025-03-07',
            note: 'DWG / PDF 同梱',
          },
          {
            id: 'main-tower-exterior',
            name: '外観写真セット（南・東面）',
            type: 'image',
            updated: '2025-06-11',
          },
        ],
        registry: {
          buildingNumber: '千代田区丸の内一丁目1番1',
          structure: '鉄骨造一部鉄骨鉄筋コンクリート造塔屋付地下2階建',
          use: '事務所・店舗',
          floorArea: 26800,
          completion: '2014-04-01',
          remarks: [
            '附属建物：変電設備棟（鉄筋コンクリート造） 平家建 36㎡',
            '附属建物：地下連絡通路（鉄筋コンクリート造） 延長42m',
          ],
          ownership: [
            {
              holder: 'M***資産パートナーズ合同会社',
              share: '全部',
              registeredAt: '2022-08-04',
              reason: '所有権移転（吸収合併）',
            },
          ],
          encumbrances: [
            {
              type: '根抵当権',
              holder: 'A***信託銀行',
              registeredAt: '2023-03-28',
              detail: '共同担保 / 極度額12億円',
              status: '存続',
            },
          ],
        },
      },
      {
        id: 'annex-lab',
        name: '附属棟（クリエイティブラボ）',
        description: '鉄骨造2階建 / インキュベーション施設',
        attachments: [
          {
            id: 'annex-lab-layout',
            name: 'レイアウト図（2024改修後）',
            type: 'pdf',
            updated: '2024-07-15',
          },
          {
            id: 'annex-lab-equip',
            name: '設備点検報告書',
            type: 'pdf',
            updated: '2025-04-30',
            note: '空調・音響設備更新を反映',
          },
        ],
        registry: {
          buildingNumber: '千代田区丸の内一丁目1番1の附属建物',
          structure: '鉄骨造陸屋根2階建',
          use: 'スタジオ・イベント',
          floorArea: 520,
          completion: '2016-09-30',
          remarks: ['内装改修履歴：2024-07-15（吸音パネル増設）'],
          ownership: [
            {
              holder: 'M***資産パートナーズ合同会社',
              share: '全部',
              registeredAt: '2016-09-30',
              reason: '新築建物表示',
            },
          ],
          encumbrances: [],
        },
      },
    ],
  },
  {
    id: 'marunouchi-1-2',
    label: '丸の内一丁目1番2',
    address: '東京都千代田区丸の内一丁目1番2',
    landCategory: '宅地',
    areaSqm: 215.3,
    measurementBasis: '実測面積',
    measurementDate: '2025-02-10',
    measurementNote: '2025年2月10日 境界確定測量',
    zoningTags: ['商業地域', '防火地域'],
    remarks: ['公開空地義務（朝日通り側 45㎡）'],
    ownership: [
      {
        holder: 'M***資産パートナーズ合同会社',
        share: '全部',
        registeredAt: '2020-03-12',
        reason: '所有権移転（売買）',
      },
    ],
    encumbrances: [
      {
        type: '賃借権',
        holder: 'G**アセットマネジメント(株)',
        registeredAt: '2020-04-01',
        detail: '普通借地権 / 2044年4月末日まで',
        status: '存続',
      },
    ],
    attachments: [
      {
        id: 'map-2',
        name: '公図（2025年版）',
        type: 'pdf',
        updated: '2025-02-15',
      },
      {
        id: 'survey-2',
        name: '境界確定測量図',
        type: 'cad',
        updated: '2025-02-10',
        note: 'DWG / PDF 同梱',
      },
    ],
    metadata: {
      lastSynced: '2025-09-05 18:10',
      dataSource: '社内測量チーム / 境界確定報告書',
      measuredOn: '実測面積（2025-02-10）',
    },
    buildings: [
      {
        id: 'annex-parking',
        name: '附属棟（機械式駐車場棟）',
        description: '鉄骨造3層 / 車両収容台数 48台',
        attachments: [
          {
            id: 'parking-maintenance',
            name: '設備保守記録（2025年度）',
            type: 'pdf',
            updated: '2025-08-01',
          },
          {
            id: 'parking-photos',
            name: '機械設備写真（更新後）',
            type: 'image',
            updated: '2025-08-05',
          },
        ],
        registry: {
          buildingNumber: '千代田区丸の内一丁目1番2の附属建物',
          structure: '鉄骨造合成デッキ3階建',
          use: '自動車車庫',
          floorArea: 980,
          completion: '2015-07-01',
          remarks: ['2023-11-20 エレベータ更新'],
          ownership: [
            {
              holder: 'M***資産パートナーズ合同会社',
              share: '全部',
              registeredAt: '2015-07-01',
              reason: '新築建物表示',
            },
          ],
          encumbrances: [
            {
              type: '根抵当権',
              holder: 'C***信託銀行',
              registeredAt: '2016-02-18',
              detail: '極度額 2億円 / 機械設備一体担保',
              status: '存続',
            },
          ],
        },
      },
    ],
  },
  {
    id: 'marunouchi-1-3',
    label: '丸の内一丁目1番3',
    address: '東京都千代田区丸の内一丁目1番3',
    landCategory: '宅地',
    areaSqm: 198.7,
    measurementBasis: '登記簿面積',
    measurementDate: '2021-11-02',
    measurementNote: '2021年11月2日 登記記録更新',
    zoningTags: ['商業地域'],
    ownership: [
      {
        holder: 'M***資産パートナーズ合同会社',
        share: '全部',
        registeredAt: '2015-09-09',
        reason: '所有権移転（会社分割）',
      },
    ],
    encumbrances: [],
    attachments: [
      {
        id: 'map-3',
        name: '公図（2023-09-30取得）',
        type: 'pdf',
        updated: '2023-09-30',
      },
    ],
    metadata: {
      lastSynced: '2025-08-25 13:50',
      dataSource: '登記情報提供サービス（法務局オンライン）',
      measuredOn: '登記簿面積（2021-11-02）',
    },
  },
];

const TSUBO_PER_SQM = 1 / 3.305785;

const formatNumber = (value: number, fraction = 2) =>
  value.toLocaleString('ja-JP', {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  });

const formatTsubo = (areaSqm: number) => formatNumber(areaSqm * TSUBO_PER_SQM, 2);

const attachmentIcon = (type: Attachment['type']) => {
  switch (type) {
    case 'image':
      return <ImageIcon className="w-4 h-4 text-blue-500" />;
    case 'cad':
      return <Layers className="w-4 h-4 text-indigo-500" />;
    default:
      return <FileText className="w-4 h-4 text-amber-500" />;
  }
};

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

  const totalBuildings = useMemo(
    () =>
      registryParcels.reduce(
        (sum, parcel) => sum + (parcel.buildings ? parcel.buildings.length : 0),
        0
      ),
    []
  );

  if (!activeParcel) {
    return (
      <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-10 text-center text-gray-500">
        登記情報がまだ登録されていません。CSV インポートまたは登記簿 PDF をアップロードしてください。
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white shadow-sm border border-white/70 px-4 py-3 flex items-center gap-3">
              <Layers className="w-10 h-10 text-blue-500" />
              <div>
                <div className="text-xs text-gray-500">合計地積</div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatNumber(aggregateAreaSqm)}㎡
                </div>
                <div className="text-xs text-gray-500">{formatTsubo(aggregateAreaSqm)}坪</div>
              </div>
            </div>
            <div className="rounded-xl bg-white shadow-sm border border-white/70 px-4 py-3">
              <div className="text-xs text-gray-500">地番数</div>
              <div className="text-lg font-semibold text-gray-900">{registryParcels.length} 筆</div>
              <div className="text-xs text-gray-500 mt-1">この資産に登録された地番</div>
            </div>
            <div className="rounded-xl bg-white shadow-sm border border-white/70 px-4 py-3">
              <div className="text-xs text-gray-500">建物数</div>
              <div className="text-lg font-semibold text-gray-900">{totalBuildings} 棟</div>
              <div className="text-xs text-gray-500 mt-1">附属棟含む登記棟数</div>
            </div>
            <div className="rounded-xl bg-white shadow-sm border border-white/70 px-4 py-3">
              <div className="text-xs text-gray-500">選択中の測量区分</div>
              <div className="flex items-center gap-2 mt-1 text-sm font-semibold text-gray-900">
                <BadgeCheck className="w-4 h-4 text-emerald-500" />
                {activeParcel.measurementBasis}
              </div>
              <div className="text-xs text-gray-500 mt-1">{activeParcel.measurementNote}</div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex rounded-full border border-blue-200 bg-blue-50/60 p-1 text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => setActiveRegistryType('land')}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeRegistryType === 'land'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-blue-600 hover:bg-white/60'
                }`}
              >
                土地登記簿
              </button>
              <button
                type="button"
                onClick={() => buildingOptions.length && setActiveRegistryType('building')}
                disabled={buildingOptions.length === 0}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeRegistryType === 'building'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : buildingOptions.length === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-white/60'
                }`}
              >
                建物登記簿
              </button>
            </div>
          </div>

          {activeRegistryType === 'land' && (
            <section className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">土地登記簿</span>
                <span className="text-gray-500">{activeParcel.address}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeParcel.zoningTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex items-center gap-2 text-sm font-semibold text-gray-800">
                <Ruler className="w-4 h-4 text-blue-500" />
                表題部（土地の部）
              </div>
              <div className="p-4">
                <table className="w-full text-sm text-gray-700">
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <th className="w-40 py-3 pr-4 text-left text-gray-500 align-top">所在</th>
                      <td className="py-3 text-gray-900">{activeParcel.address}</td>
                    </tr>
                    <tr>
                      <th className="py-3 pr-4 text-left text-gray-500 align-top">地番</th>
                      <td className="py-3 text-gray-900">{activeParcel.label}</td>
                    </tr>
                    <tr>
                      <th className="py-3 pr-4 text-left text-gray-500 align-top">地目</th>
                      <td className="py-3 text-gray-900">{activeParcel.landCategory}</td>
                    </tr>
                    <tr>
                      <th className="py-3 pr-4 text-left text-gray-500 align-top">地積</th>
                      <td className="py-3 text-gray-900">
                        {formatNumber(activeParcel.areaSqm)}㎡（{formatTsubo(activeParcel.areaSqm)}坪）
                      </td>
                    </tr>
                    <tr>
                      <th className="py-3 pr-4 text-left text-gray-500 align-top">測量の別</th>
                      <td className="py-3 text-gray-900">
                        {activeParcel.measurementBasis}
                        <span className="ml-2 text-xs text-gray-500">{activeParcel.measurementDate}</span>
                      </td>
                    </tr>
                    {activeParcel.remarks?.length ? (
                      <tr>
                        <th className="py-3 pr-4 text-left text-gray-500 align-top">備考</th>
                        <td className="py-3">
                          <ul className="space-y-1 list-disc list-inside text-gray-700">
                            {activeParcel.remarks.map((remark) => (
                              <li key={remark}>{remark}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-200">
                <div className="bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-800">
                  権利部（甲区）所有権に関する事項
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-white">
                      <tr className="border-b border-gray-200">
                        <th className="px-3 py-2 text-left w-24">順位番号</th>
                        <th className="px-3 py-2 text-left w-40">登記の目的</th>
                        <th className="px-3 py-2 text-left w-56">受付年月日・受付番号</th>
                        <th className="px-3 py-2 text-left">権利者その他の事項</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {activeParcel.ownership.map((record, index) => (
                        <tr key={`${record.holder}-${index}`} className="align-top">
                          <td className="px-3 py-3 text-gray-900">{`第${index + 1}号`}</td>
                          <td className="px-3 py-3 text-gray-900">{record.reason ?? '所有権登記'}</td>
                          <td className="px-3 py-3 text-gray-700">
                            {record.registeredAt}<br />
                            <span className="text-xs text-gray-500">受付番号: 第{(index + 1).toString().padStart(4, '0')}号</span>
                          </td>
                          <td className="px-3 py-3 text-gray-700">
                            <span className="font-medium text-gray-900">{record.holder}</span>
                            {record.share ? <span className="ml-2 text-sm text-gray-600">持分 {record.share}</span> : null}
                            {record.note ? <div className="text-xs text-gray-500 mt-2">{record.note}</div> : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-t border-gray-200">
                <div className="bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-800">
                  権利部（乙区）所有権以外の権利に関する事項
                </div>
                {activeParcel.encumbrances.length ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-700">
                      <thead className="bg-white">
                        <tr className="border-b border-gray-200">
                          <th className="px-3 py-2 text-left w-24">順位番号</th>
                          <th className="px-3 py-2 text-left w-40">登記の目的</th>
                          <th className="px-3 py-2 text-left w-56">受付年月日・受付番号</th>
                          <th className="px-3 py-2 text-left">権利者その他の事項</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {activeParcel.encumbrances.map((record, index) => (
                          <tr key={`${record.type}-${index}`} className="align-top">
                            <td className="px-3 py-3 text-gray-900">{`第${index + 1}号`}</td>
                            <td className="px-3 py-3 text-gray-900">{record.type}</td>
                            <td className="px-3 py-3 text-gray-700">
                              {record.registeredAt}<br />
                              <span className="text-xs text-gray-500">受付番号: 第{(index + 1).toString().padStart(4, '0')}号</span>
                            </td>
                            <td className="px-3 py-3 text-gray-700">
                              <div className="font-medium text-gray-900">{record.holder}</div>
                              {record.detail ? <div className="text-xs text-gray-500 mt-2">{record.detail}</div> : null}
                              <div className="text-xs text-amber-600 mt-1">現況: {record.status ?? '存続'}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-4 py-4 text-sm text-gray-500">該当する登記はありません。</div>
                )}
              </div>
            </div>
            </section>
          )}

          {activeRegistryType === 'building' && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">建物登記簿</span>
                {activeBuilding ? (
                  <span className="text-gray-500">{activeBuilding.description}</span>
                ) : (
                  <span className="text-gray-500">選択中の地番には建物登記が登録されていません</span>
                )}
              </div>

              {activeBuilding ? (
                <div className="border border-gray-200 rounded-xl bg-white overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-800">
                  表題部（建物の部）
                </div>
                <div className="p-4">
                  <table className="w-full text-sm text-gray-700">
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <th className="w-40 py-3 pr-4 text-left text-gray-500 align-top">所在</th>
                        <td className="py-3 text-gray-900">{activeParcel.address}</td>
                      </tr>
                      <tr>
                        <th className="py-3 pr-4 text-left text-gray-500 align-top">家屋番号</th>
                        <td className="py-3 text-gray-900">{activeBuilding.registry.buildingNumber}</td>
                      </tr>
                      <tr>
                        <th className="py-3 pr-4 text-left text-gray-500 align-top">種類・構造</th>
                        <td className="py-3 text-gray-900">{activeBuilding.registry.use}<br />{activeBuilding.registry.structure}</td>
                      </tr>
                      <tr>
                        <th className="py-3 pr-4 text-left text-gray-500 align-top">床面積</th>
                        <td className="py-3 text-gray-900">{formatNumber(activeBuilding.registry.floorArea, 0)}㎡</td>
                      </tr>
                      <tr>
                        <th className="py-3 pr-4 text-left text-gray-500 align-top">建築（表示）日</th>
                        <td className="py-3 text-gray-900">{activeBuilding.registry.completion}</td>
                      </tr>
                      {activeBuilding.registry.remarks?.length ? (
                        <tr>
                          <th className="py-3 pr-4 text-left text-gray-500 align-top">附属建物 等</th>
                          <td className="py-3">
                            <ul className="space-y-1 list-disc list-inside text-gray-700">
                              {activeBuilding.registry.remarks.map((remark) => (
                                <li key={remark}>{remark}</li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>

              <div className="border-t border-gray-200">
                <div className="bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-800">
                  権利部（甲区）所有権に関する事項
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-700">
                      <thead className="bg-white">
                        <tr className="border-b border-gray-200">
                          <th className="px-3 py-2 text-left w-24">順位番号</th>
                          <th className="px-3 py-2 text-left w-40">登記の目的</th>
                          <th className="px-3 py-2 text-left w-56">受付年月日・受付番号</th>
                          <th className="px-3 py-2 text-left">権利者その他の事項</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {activeBuilding.registry.ownership.map((record, index) => (
                          <tr key={`${record.holder}-${index}`} className="align-top">
                            <td className="px-3 py-3 text-gray-900">{`第${index + 1}号`}</td>
                            <td className="px-3 py-3 text-gray-900">{record.reason ?? '所有権登記'}</td>
                            <td className="px-3 py-3 text-gray-700">
                              {record.registeredAt}<br />
                              <span className="text-xs text-gray-500">受付番号: 第{(index + 1).toString().padStart(4, '0')}号</span>
                            </td>
                            <td className="px-3 py-3 text-gray-700">
                              <span className="font-medium text-gray-900">{record.holder}</span>
                              {record.share ? <span className="ml-2 text-sm text-gray-600">持分 {record.share}</span> : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              </div>

                <div className="border-t border-gray-200">
                  <div className="bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-800">
                    権利部（乙区）所有権以外の権利に関する事項
                  </div>
                  {activeBuilding.registry.encumbrances.length ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm text-gray-700">
                        <thead className="bg-white">
                          <tr className="border-b border-gray-200">
                            <th className="px-3 py-2 text-left w-24">順位番号</th>
                            <th className="px-3 py-2 text-left w-40">登記の目的</th>
                            <th className="px-3 py-2 text-left w-56">受付年月日・受付番号</th>
                            <th className="px-3 py-2 text-left">権利者その他の事項</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {activeBuilding.registry.encumbrances.map((record, index) => (
                            <tr key={`${record.type}-${index}`} className="align-top">
                              <td className="px-3 py-3 text-gray-900">{`第${index + 1}号`}</td>
                              <td className="px-3 py-3 text-gray-900">{record.type}</td>
                              <td className="px-3 py-3 text-gray-700">
                                {record.registeredAt}<br />
                                <span className="text-xs text-gray-500">受付番号: 第{(index + 1).toString().padStart(4, '0')}号</span>
                              </td>
                              <td className="px-3 py-3 text-gray-700">
                                <div className="font-medium text-gray-900">{record.holder}</div>
                                {record.detail ? <div className="text-xs text-gray-500 mt-2">{record.detail}</div> : null}
                                <div className="text-xs text-amber-600 mt-1">現況: {record.status ?? '存続'}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="px-4 py-4 text-sm text-gray-500">該当する登記はありません。</div>
                  )}
                </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-sm text-gray-500 bg-gray-50">
                  この地番に紐づく建物登記は現在登録されていません。
                </div>
              )}
            </section>
          )}

          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900">添付資料・図面</span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span>最終取得: {activeParcel.metadata.lastSynced}</span>
                <span className="hidden sm:inline">／</span>
                <span>{activeParcel.metadata.dataSource}</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activeParcel.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="border border-gray-200 rounded-xl p-4 flex items-start gap-3 bg-white/80 hover:border-blue-500 transition-colors"
                >
                  <div className="mt-0.5">{attachmentIcon(attachment.type)}</div>
                  <div className="flex-1 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{attachment.name}</p>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">更新日: {attachment.updated}</p>
                    {attachment.note ? (
                      <p className="text-xs text-gray-500 mt-1">{attachment.note}</p>
                    ) : null}
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                + 資料を追加アップロード
              </button>
            </div>
          </section>
        </div>

        <footer className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between text-xs text-gray-500">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5" />
              <p>
                表示内容は社内で取得した登記情報のサマリーです。正式な登記事項証明書と異なる場合があります。
                詳細は法務局発行の原本をご確認ください。
              </p>
            </div>
            <p>取得基準日: {activeParcel.metadata.measuredOn}</p>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default RegistryTab;
