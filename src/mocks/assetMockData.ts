/**
 * 資産台帳のモックデータ
 * フェーズ1-2: UIファースト実装用
 */

import { Asset } from '../types/asset';

/**
 * 拡張資産情報（資産台帳用）
 */
export interface AssetLedger extends Asset {
  // 基本情報拡張
  propertyType: '土地' | '建物' | '土地建物' | 'マンション' | '駐車場' | 'その他';
  acquisitionDate?: string; // 取得日
  acquisitionPrice?: number; // 取得価格
  bookValue?: number; // 簿価

  // 評価情報
  lastValuationDate?: string; // 最終評価日
  valuationMethod?: '取引事例法' | '収益還元法' | '原価法' | '公示地価基準';

  // 収益情報
  annualRent?: number; // 年間賃料収入
  occupancyRate?: number; // 稼働率（%）
  netOperatingIncome?: number; // 純営業収益（NOI）

  // 税務情報
  fixedAssetTax?: number; // 固定資産税（年額）
  cityPlanningTax?: number; // 都市計画税（年額）
  inheritanceTaxValue?: number; // 相続税評価額

  // 管理情報
  managementCompany?: string; // 管理会社
  insuranceCompany?: string; // 火災保険会社
  insuranceExpiry?: string; // 保険満期日

  // 提案・通知
  proposalCount?: number; // 提案数
  hasNewProposal?: boolean; // 新着提案あり
  hasAlert?: boolean; // アラートあり

  // メモ・タグ
  tags?: string[];
  lastUpdated?: string; // 最終更新日
}

/**
 * モック: 資産台帳データ
 */
export const mockAssetLedger: AssetLedger[] = [
  {
    id: 1,
    address: '東京都渋谷区宇田川町31-2',
    lat: 35.6617,
    lng: 139.6976,
    area: 350,
    owner: '山田太郎',
    status: '更地',
    memo: '駅近の好立地、マンション用地として最適',
    zoning: '商業地域',
    valuationMedian: 630000000,
    name: '渋谷宇田川町物件',
    valuationMin: 600000000,
    valuationMax: 660000000,
    pricePerSqm: 1800000,
    coverageRatio: 80,
    floorAreaRatio: 600,
    nearestStation: '渋谷駅',
    stationDistance: 450,
    isPublic: true,

    // 拡張情報
    propertyType: '土地',
    acquisitionDate: '2018-03-15',
    acquisitionPrice: 580000000,
    bookValue: 580000000,
    lastValuationDate: '2025-10-01',
    valuationMethod: '取引事例法',
    fixedAssetTax: 4410000,
    cityPlanningTax: 1890000,
    inheritanceTaxValue: 504000000,
    proposalCount: 3,
    hasNewProposal: true,
    hasAlert: false,
    tags: ['駅近', 'マンション用地', '商業地域', '高稼働率エリア'],
    lastUpdated: '2025-10-20T10:00:00+09:00',
  },
  {
    id: 2,
    address: '東京都世田谷区太子堂4-1-1',
    lat: 35.6433,
    lng: 139.6692,
    area: 800,
    owner: '山田太郎',
    status: '賃貸中',
    memo: '3階建てビル、テナント3社入居中',
    zoning: '近隣商業地域',
    valuationMedian: 540000000,
    name: '世田谷太子堂ビル',
    valuationMin: 520000000,
    valuationMax: 560000000,
    pricePerSqm: 675000,
    coverageRatio: 60,
    floorAreaRatio: 200,
    nearestStation: '三軒茶屋駅',
    stationDistance: 350,
    isPublic: true,

    // 拡張情報
    propertyType: '土地建物',
    acquisitionDate: '2015-07-20',
    acquisitionPrice: 480000000,
    bookValue: 450000000,
    lastValuationDate: '2025-09-15',
    valuationMethod: '収益還元法',
    annualRent: 21600000,
    occupancyRate: 100,
    netOperatingIncome: 18360000,
    fixedAssetTax: 3780000,
    cityPlanningTax: 1620000,
    inheritanceTaxValue: 432000000,
    managementCompany: '三井不動産リアルティ',
    insuranceCompany: '損保ジャパン',
    insuranceExpiry: '2027-07-31',
    proposalCount: 2,
    hasNewProposal: true,
    hasAlert: false,
    tags: ['賃貸中', '満室', '近隣商業', '安定収益'],
    lastUpdated: '2025-10-19T15:30:00+09:00',
  },
  {
    id: 3,
    address: '東京都世田谷区太子堂4-2-8',
    lat: 35.6441,
    lng: 139.6701,
    area: 220,
    owner: '山田太郎',
    status: '駐車場',
    memo: '月極駐車場として運営中、8台分',
    zoning: '第一種住居地域',
    valuationMedian: 132000000,
    name: '太子堂駐車場',
    valuationMin: 126000000,
    valuationMax: 138000000,
    pricePerSqm: 600000,
    coverageRatio: 60,
    floorAreaRatio: 200,
    nearestStation: '三軒茶屋駅',
    stationDistance: 420,
    isPublic: false,

    // 拡張情報
    propertyType: '駐車場',
    acquisitionDate: '2020-11-10',
    acquisitionPrice: 125000000,
    bookValue: 125000000,
    lastValuationDate: '2025-08-20',
    valuationMethod: '取引事例法',
    annualRent: 2880000,
    occupancyRate: 87.5,
    netOperatingIncome: 2520000,
    fixedAssetTax: 924000,
    cityPlanningTax: 396000,
    inheritanceTaxValue: 105600000,
    proposalCount: 1,
    hasNewProposal: false,
    hasAlert: false,
    tags: ['駐車場', '月極', '住居地域', '低リスク'],
    lastUpdated: '2025-10-18T09:00:00+09:00',
  },
  {
    id: 4,
    address: '東京都千代田区丸の内1-1-1',
    lat: 35.6812,
    lng: 139.7671,
    area: 450,
    owner: '山田太郎',
    status: '古家付き',
    memo: '築45年の旧オフィスビル、建替え検討中',
    zoning: '商業地域',
    valuationMedian: 900000000,
    name: '丸の内オフィスビル',
    valuationMin: 850000000,
    valuationMax: 950000000,
    pricePerSqm: 2000000,
    coverageRatio: 100,
    floorAreaRatio: 1000,
    nearestStation: '東京駅',
    stationDistance: 200,
    isPublic: true,

    // 拡張情報
    propertyType: '土地建物',
    acquisitionDate: '2010-05-25',
    acquisitionPrice: 750000000,
    bookValue: 720000000,
    lastValuationDate: '2025-10-10',
    valuationMethod: '取引事例法',
    annualRent: 36000000,
    occupancyRate: 75,
    netOperatingIncome: 27000000,
    fixedAssetTax: 6300000,
    cityPlanningTax: 2700000,
    inheritanceTaxValue: 720000000,
    managementCompany: '三菱地所プロパティマネジメント',
    insuranceCompany: '東京海上日動',
    insuranceExpiry: '2026-05-31',
    proposalCount: 4,
    hasNewProposal: false,
    hasAlert: true,
    tags: ['駅至近', '建替え候補', '商業地域', '高稼働率エリア'],
    lastUpdated: '2025-10-21T14:20:00+09:00',
  },
  {
    id: 5,
    address: '東京都港区六本木6-10-1',
    lat: 35.6627,
    lng: 139.7308,
    area: 580,
    owner: '山田太郎',
    status: '更地',
    memo: '再開発エリア隣接地、開発ポテンシャル高',
    zoning: '商業地域',
    valuationMedian: 1160000000,
    name: '六本木開発用地',
    valuationMin: 1100000000,
    valuationMax: 1220000000,
    pricePerSqm: 2000000,
    coverageRatio: 80,
    floorAreaRatio: 700,
    nearestStation: '六本木駅',
    stationDistance: 280,
    isPublic: true,

    // 拡張情報
    propertyType: '土地',
    acquisitionDate: '2022-09-01',
    acquisitionPrice: 1050000000,
    bookValue: 1050000000,
    lastValuationDate: '2025-09-30',
    valuationMethod: '取引事例法',
    fixedAssetTax: 8120000,
    cityPlanningTax: 3480000,
    inheritanceTaxValue: 928000000,
    proposalCount: 5,
    hasNewProposal: true,
    hasAlert: false,
    tags: ['再開発', '更地', '商業地域', '投資適格'],
    lastUpdated: '2025-10-22T11:45:00+09:00',
  },
];

/**
 * 資産サマリー統計
 */
export interface AssetSummaryStats {
  totalAssets: number; // 総資産数
  totalValue: number; // 総評価額
  totalAnnualRent: number; // 総年間賃料
  averageOccupancyRate: number; // 平均稼働率
  totalNOI: number; // 総NOI
  totalProposals: number; // 総提案数
  newProposalCount: number; // 新着提案数
  alertCount: number; // アラート数
}

/**
 * モック: 資産サマリー統計
 */
export const mockAssetSummaryStats: AssetSummaryStats = {
  totalAssets: 5,
  totalValue: 3362000000, // 約33.6億円
  totalAnnualRent: 60480000, // 約6,048万円
  averageOccupancyRate: 90.6, // 90.6%
  totalNOI: 47880000, // 約4,788万円
  totalProposals: 15,
  newProposalCount: 3,
  alertCount: 1,
};

/**
 * 資産タイプ別の統計
 */
export interface AssetTypeStats {
  propertyType: string;
  count: number;
  totalValue: number;
  percentage: number;
}

/**
 * モック: 資産タイプ別統計
 */
export const mockAssetTypeStats: AssetTypeStats[] = [
  {
    propertyType: '土地',
    count: 2,
    totalValue: 1790000000,
    percentage: 53.2,
  },
  {
    propertyType: '土地建物',
    count: 2,
    totalValue: 1440000000,
    percentage: 42.8,
  },
  {
    propertyType: '駐車場',
    count: 1,
    totalValue: 132000000,
    percentage: 3.9,
  },
];

/**
 * 資産IDから資産情報を取得
 */
export const getAssetById = (assetId: number): AssetLedger | undefined => {
  return mockAssetLedger.find(asset => asset.id === assetId);
};

/**
 * 公開資産のみ取得
 */
export const getPublicAssets = (): AssetLedger[] => {
  return mockAssetLedger.filter(asset => asset.isPublic !== false);
};

/**
 * 新着提案がある資産を取得
 */
export const getAssetsWithNewProposals = (): AssetLedger[] => {
  return mockAssetLedger.filter(asset => asset.hasNewProposal);
};

/**
 * アラートがある資産を取得
 */
export const getAssetsWithAlerts = (): AssetLedger[] => {
  return mockAssetLedger.filter(asset => asset.hasAlert);
};
