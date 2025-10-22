/**
 * Mock registry data (登記データ)
 *
 * AssetDetailのDocumentsTabとValuationTabで使用されるモックデータ
 */

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
