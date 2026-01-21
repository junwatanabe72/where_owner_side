/**
 * モックデータのエクスポート
 * フェーズ1-2: UIファースト実装用
 *
 * 開発スケジュール（docs/a.md, docs/b.md）に基づき作成
 * - RESTチャット機能
 * - 評価シミュレーター（3シナリオ）
 * - 資産台帳
 */

// チャット関連
export {
  mockParticipants,
  mockMessages,
  mockThreads,
  getMessagesByThreadId,
  getTotalUnreadCount,
  getActiveThreadCount,
} from './chatMockData';

// 評価シミュレーター関連
export {
  mockLeaseholdCondoSimulation,
  mockLandSwapSimulation,
  mockMasterLeaseSimulation,
  mockScenarioComparison,
  mockScenarioComparisons,
  getScenarioComparisonByAssetId,
} from './valuationMockData';

// 資産台帳関連
export {
  mockAssetLedger,
  mockAssetSummaryStats,
  mockAssetTypeStats,
  getAssetById,
  getPublicAssets,
  getAssetsWithNewProposals,
  getAssetsWithAlerts,
} from './assetMockData';

// 型定義のエクスポート
export type { AssetLedger, AssetSummaryStats, AssetTypeStats } from './assetMockData';
