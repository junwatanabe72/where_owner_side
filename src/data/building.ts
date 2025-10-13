export type BuildingRegistry = {
  buildingNumber?: string;
  mainStructure?: string;
  use?: string;
  totalFloorArea?: number;
  completion?: string;
  remarks?: string[];
};

export type BuildingRecord = {
  assetId: number;
  projectName: string;
  address: string;
  ownerAlias: string;
  managerAlias?: string;
  structure?: string;
  floors?: { above?: number; below?: number };
  completion?: string;
  siteArea?: number;
  totalFloorArea?: number;
  primaryUses?: string[];
  buildingRegistry?: BuildingRegistry;
};

export const buildings: BuildingRecord[] = [
  {
    assetId: 1,
    projectName: '渋谷宇田川クロッシング',
    address: '東京都渋谷区宇田川町31-2',
    ownerAlias: 'W***アセット合同会社',
    managerAlias: 'M**ディベロップメント(株)',
    structure: 'S造・RC造（制震構造）',
    floors: { above: 11, below: 1 },
    completion: '2002-03',
    siteArea: 1198.22,
    totalFloorArea: 8620,
    primaryUses: ['商業', 'オフィス'],
    buildingRegistry: {
      buildingNumber: '渋谷区宇田川町83番2',
      mainStructure: '鉄骨造一部鉄筋コンクリート造陸屋根11階建',
      use: '店舗・事務所',
      totalFloorArea: 8620,
      completion: '2002-03',
      remarks: [
        '附属建物: 自動車車庫（鉄骨造） 1階 45㎡',
        '附属建物: 倉庫（軽量鉄骨造） 平家建 18㎡',
      ],
    },
  },
  {
    assetId: 2,
    projectName: '太子堂ミックスプレイス',
    address: '東京都世田谷区太子堂4丁目1-1',
    ownerAlias: 'T***不動産管理(株)',
    managerAlias: 'C**プロパティ合同会社',
    structure: 'RC造（耐震補強済）',
    floors: { above: 9, below: 0 },
    completion: '1998-10',
    siteArea: 1198.22,
    totalFloorArea: 7450,
    primaryUses: ['商業', 'サービス', 'コワーキング'],
    buildingRegistry: {
      buildingNumber: '世田谷区太子堂四丁目1番1 他1棟',
      mainStructure: '鉄筋コンクリート造陸屋根9階建',
      use: '店舗・事務所・サービス施設',
      totalFloorArea: 7450,
      completion: '1998-10',
      remarks: [
        '附属建物: 発電機室（鉄筋コンクリート造） 平家建 12㎡',
        '附属建物: 自転車置場（軽量鉄骨造） 平家建 24㎡',
      ],
    },
  },
  {
    assetId: 3,
    projectName: '丸の内シナジータワー',
    address: '東京都千代田区丸の内1丁目1-1',
    ownerAlias: 'M***資産パートナーズ合同会社',
    managerAlias: 'G**アセットマネジメント(株)',
    structure: 'S造（制震・免震併用）',
    floors: { above: 24, below: 2 },
    completion: '2014-04',
    siteArea: 680,
    totalFloorArea: 26800,
    primaryUses: ['ハイグレードオフィス'],
    buildingRegistry: {
      buildingNumber: '千代田区丸の内一丁目1番1',
      mainStructure:
        '鉄骨造一部鉄骨鉄筋コンクリート造地下2階付塔屋2階建',
      use: '事務所',
      totalFloorArea: 26800,
      completion: '2014-04',
      remarks: [
        '附属建物: 変電設備棟（鉄筋コンクリート造） 平家建 36㎡',
        '附属建物: 地下連絡通路（鉄筋コンクリート造） 延長 42m',
      ],
    },
  },
];

const buildingData = {
  buildings,
};

export default buildingData;
