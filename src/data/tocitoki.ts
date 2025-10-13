export type LandRight = {
  type: string;
  holder: string;
  status?: string;
};

export type LandRegistry = {
  parcelId?: string;
  landCategory?: string;
  area?: number;
  rights?: LandRight[];
  remarks?: string[];
};

export type RegistryRecord = {
  assetId: number;
  lastSurvey: string;
  landUse: string;
  zoningNotes: string[];
  landRegistry?: LandRegistry;
  pendingApplications: Array<{
    type: string;
    status: string;
    summary: string;
  }>;
  registryAlerts: Array<{
    date: string;
    category: string;
    summary: string;
  }>;
};

export const records: RegistryRecord[] = [
  {
    assetId: 1,
    lastSurvey: '2025-08-18',
    landUse: '宅地',
    zoningNotes: [
      '商業地域（建蔽率80% / 容積率600%）',
      '防火地域・高度地区（第3種）',
    ],
    landRegistry: {
      parcelId: '渋谷区宇田川町83番2 他1筆',
      landCategory: '宅地',
      area: 1189.37,
      rights: [
        { type: '所有権', holder: 'W***アセット合同会社' },
        { type: '抵当権', holder: 'M***銀行', status: '2025-07-12 抹消済' },
      ],
      remarks: ['道路後退部分 12.5㎡（都市計画道路予定地）'],
    },
    pendingApplications: [
      {
        type: '用途変更',
        status: '協議中',
        summary: '6階オフィスをクリエイティブラボへ転用（テナント名匿名化）',
      },
    ],
    registryAlerts: [
      {
        date: '2025-07-12',
        category: '登記',
        summary: '抵当権抹消（金融機関名を伏せて記載）',
      },
      {
        date: '2025-05-29',
        category: '法務',
        summary: 'テナント契約更新（契約先匿名化済）',
      },
    ],
  },
  {
    assetId: 2,
    lastSurvey: '2025-07-30',
    landUse: '宅地',
    zoningNotes: [
      '商業地域（建蔽率80% / 容積率400%）',
      '防火地域',
    ],
    landRegistry: {
      parcelId: '世田谷区太子堂4丁目1番1 他2筆',
      landCategory: '宅地',
      area: 1224.8,
      rights: [
        { type: '所有権', holder: 'T***不動産管理(株)' },
        {
          type: '地上権',
          holder: 'C**再開発合同会社',
          status: '2035年3月31日まで',
        },
      ],
      remarks: ['一部区画は地区計画により高さ制限 31m'],
    },
    pendingApplications: [
      {
        type: '用途変更',
        status: '届出予定',
        summary: '屋上ガーデンのイベント利用拡張（事業者名匿名化）',
      },
    ],
    registryAlerts: [
      {
        date: '2025-06-18',
        category: '登記',
        summary: '共有持分の一部移転（関係者頭文字のみ保管）',
      },
    ],
  },
  {
    assetId: 3,
    lastSurvey: '2025-09-05',
    landUse: '宅地',
    zoningNotes: [
      '商業地域（建蔽率80% / 容積率1300%）',
      '特定街区内',
    ],
    landRegistry: {
      parcelId: '千代田区丸の内1丁目1番1',
      landCategory: '宅地',
      area: 702.4,
      rights: [
        { type: '所有権', holder: 'M***資産パートナーズ合同会社' },
        {
          type: '賃借権',
          holder: 'G**アセットマネジメント(株)',
          status: '普通借地権（2044年4月末日まで）',
        },
      ],
      remarks: ['都市再生緊急整備地域（丸の内・有楽町地区）内'],
    },
    pendingApplications: [
      {
        type: '大規模修繕',
        status: '届出済',
        summary: '外装パネル更新と非常用電源増設（施工者匿名化）',
      },
    ],
    registryAlerts: [
      {
        date: '2025-08-11',
        category: '建築確認',
        summary: '中層階の内装リニューアル（案件番号のみ保管）',
      },
      {
        date: '2025-04-03',
        category: '登記',
        summary: '区分持分の質権設定（金融機関略称のみ表示）',
      },
    ],
  },
];

const tocitokiData = {
  records,
};

export default tocitokiData;
