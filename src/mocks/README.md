# モックデータ仕様書

開発スケジュール（`docs/a.md`, `docs/b.md`）に基づき作成したモックデータです。
フェーズ1-2のUIファースト実装で使用します。

## 概要

このディレクトリには、以下の機能に対応するモックデータが含まれています：

1. **RESTチャット機能** - `chatMockData.ts`
2. **評価シミュレーター（3シナリオ）** - `valuationMockData.ts`
3. **資産台帳** - `assetMockData.ts`

## ディレクトリ構造

```
src/mocks/
├── README.md                # 本ファイル
├── index.ts                 # モックデータのエクスポート
├── chatMockData.ts          # チャット機能のモック
├── valuationMockData.ts     # 評価シミュレーターのモック
└── assetMockData.ts         # 資産台帳のモック

src/types/
├── chat.ts                  # チャット機能の型定義
├── valuation.ts             # 評価シミュレーターの型定義
└── asset.ts                 # 資産の型定義（既存）
```

## 使用方法

> **注意**: このプロジェクトではパスエイリアスが設定済みです。`@/mocks`のようなエイリアスまたは相対パス、どちらでもインポート可能です。

### 1. RESTチャット機能

```typescript
// パスエイリアスを使用（推奨）
import {
  mockThreads,
  mockMessages,
  getMessagesByThreadId,
  getTotalUnreadCount,
} from '@/mocks';

// または相対パス（src/components/chat/ChatList.tsx の場合）
// import { mockThreads, ... } from '../../mocks';

// スレッド一覧を表示
const threads = mockThreads;

// 特定スレッドのメッセージを取得
const messages = getMessagesByThreadId('thread-001');

// 未読数を取得
const unreadCount = getTotalUnreadCount(); // 2
```

#### 提供されるデータ

- **スレッド数**: 4件
  - `thread-001`: マンション用地の買取相談（未読1件）
  - `thread-002`: リーシング提案
  - `thread-003`: 定期借地権の相談
  - `thread-004`: システム通知（未読1件）

- **メッセージ数**: 10件
- **参加者**: オーナー1名、提案者3社、システム

### 2. 評価シミュレーター（3シナリオ）

```typescript
// パスエイリアスを使用（推奨）
import {
  mockScenarioComparison,
  getScenarioComparisonByAssetId,
} from '@/mocks';

// 物件ID=1の3シナリオ比較を取得
const comparison = getScenarioComparisonByAssetId(1);

// 各シナリオの結果を表示
console.log(comparison.scenarios.leaseholdCondo); // 借地権マンション
console.log(comparison.scenarios.landSwap);       // 土地交換
console.log(comparison.scenarios.masterLease);    // マスターリース

// 推奨シナリオ
console.log(comparison.recommendation.preferred); // 'leaseholdCondo'
```

#### 提供されるシナリオ

##### シナリオ1: 借地権マンション（Leasehold Condo）
- **対象物件**: 渋谷区宇田川町31-2
- **総評価額**: 8.5億円
- **IRR**: 6.2%
- **純利益**: 3.76億円
- **住戸数**: 24戸

##### シナリオ2: 土地交換（Land Swap）
- **対象物件**: 千代田区丸の内1-1-1
- **資産価値上昇**: 2.4億円（26.67%増）
- **利回り改善**: 3.2% → 4.8%
- **税制優遇**: 約4,876万円

##### シナリオ3: マスターリース（Master Lease）
- **対象物件**: 世田谷区太子堂4-1-1
- **年間収益**: 2,160万円
- **NOI**: 1,836万円
- **契約期間**: 10年
- **10年間キャッシュフロー**: 提供あり

### 3. 資産台帳

```typescript
// パスエイリアスを使用（推奨）
import {
  mockAssetLedger,
  mockAssetSummaryStats,
  getAssetById,
  getAssetsWithNewProposals,
} from '@/mocks';

// 全資産を取得
const assets = mockAssetLedger; // 5件

// 特定資産を取得
const asset = getAssetById(1);

// サマリー統計を取得
const stats = mockAssetSummaryStats;
console.log(stats.totalValue);        // 約33.6億円
console.log(stats.totalAnnualRent);   // 約6,048万円
console.log(stats.averageOccupancyRate); // 90.6%

// 新着提案がある資産のみ取得
const assetsWithProposals = getAssetsWithNewProposals(); // 3件
```

#### 提供されるデータ

**資産数**: 5件

1. **渋谷宇田川町物件**（ID: 1）
   - 種別: 土地（更地）
   - 評価額: 6.3億円
   - 提案数: 3件（新着あり）

2. **世田谷太子堂ビル**（ID: 2）
   - 種別: 土地建物（賃貸中）
   - 評価額: 5.4億円
   - 年間賃料: 2,160万円（満室）
   - 提案数: 2件（新着あり）

3. **太子堂駐車場**（ID: 3）
   - 種別: 駐車場
   - 評価額: 1.32億円
   - 稼働率: 87.5%

4. **丸の内オフィスビル**（ID: 4）
   - 種別: 土地建物（古家付き）
   - 評価額: 9億円
   - 稼働率: 75%
   - アラートあり（建替え検討）

5. **六本木開発用地**（ID: 5）
   - 種別: 土地（更地）
   - 評価額: 11.6億円
   - 提案数: 5件（新着あり）

## データの関連性

モックデータは互いに関連付けられています：

```
資産台帳 (Asset)
    ↓
    ├─ チャットスレッド (assetId で紐付け)
    │   └─ メッセージ (threadId で紐付け)
    │
    └─ 評価シミュレーション (assetId で紐付け)
        └─ 3シナリオ比較
```

### 例: 渋谷宇田川町物件 (assetId: 1)

```typescript
// パスエイリアスを使用
import {
  getAssetById,
  mockThreads,
  getScenarioComparisonByAssetId,
} from '@/mocks';

// 資産情報
const asset = getAssetById(1);
console.log(asset.name); // '渋谷宇田川町物件'

// この物件に関するチャット
const threads = mockThreads.filter(t => t.assetId === 1);
console.log(threads[0].subject); // 'マンション用地 直接買取について'

// この物件の評価シミュレーション
const simulation = getScenarioComparisonByAssetId(1);
console.log(simulation.recommendation.preferred); // 'leaseholdCondo'
```

## 開発フェーズでの利用（オーナー視点）

### フェーズ1: UX定義とUIプロトタイピング（2025-10-27 〜 2025-11-07）
- モックデータを使用してワイヤーフレームを作成
- 評価タブ・チャット・資産台帳の画面フローを確認

### フェーズ2: フロントUI骨格実装（2025-11-10 〜 2025-11-21）
- モックデータをReact UIに統合し、オーナー指標を明示
  - 借地権マンション: 地代（年額）
  - 土地交換: 資産価値上昇・CF増分（推定）
  - マスターリース: 年次CF（NOI）、Cap Rate
- Storybookでコンポーネントを検証
- ハンズオンでの確認に使用

### フェーズ3: APIスタブ統合（2025-11-24 〜 2025-12-05）
- モックデータ構造をAPI仕様として確定
- スタブAPIとの接続テスト

### フェーズ4以降
- 実データへの段階的移行
- モックとの比較検証

## 拡張とカスタマイズ

### 新しいモックデータの追加

```typescript
// chatMockData.ts に追加
export const mockMessages = [
  ...existingMessages,
  {
    id: 'msg-new',
    threadId: 'thread-001',
    content: '新しいメッセージ',
    sender: mockParticipants[0],
    createdAt: new Date().toISOString(),
    read: false,
  },
];
```

### データのリセット

各ファイルはプレーンなTypeScriptオブジェクトなので、簡単にリセット・修正できます。
Gitで管理されているため、いつでも初期状態に戻すことができます。

## 注意事項

1. **日付形式**: すべてISO 8601形式（`2025-10-20T10:00:00+09:00`）を使用
2. **ID**: 文字列型（`'thread-001'`）または数値型（`1`）を明確に区別
3. **金額**: すべて円単位で整数値
4. **パーセンテージ**: 0-100の範囲（小数点以下も可）
5. **画像URL**: プレースホルダーサービス（pravatar.cc）を使用

## 設定済みのパスエイリアス

このプロジェクトでは、以下のパスエイリアスが `tsconfig.json` に設定済みです：

```json
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
      "@/mocks": ["mocks/index"],
      "@/mocks/*": ["mocks/*"],
      "@/types/*": ["types/*"],
      "@/components/*": ["components/*"],
      "@/utils/*": ["utils/*"],
      "@/store/*": ["store/*"]
    }
  }
}
```

### 使用可能なエイリアス

- `@/mocks` - モックデータ（推奨）
- `@/types/*` - 型定義ファイル
- `@/components/*` - コンポーネント
- `@/utils/*` - ユーティリティ関数
- `@/store/*` - 状態管理

### エイリアス使用例

```typescript
// モックデータのインポート
import { mockThreads, getMessagesByThreadId } from '@/mocks';
import { ChatThread } from '@/types/chat';

// コンポーネントやユーティリティのインポート
import { AssetCard } from '@/components/assets/AssetCard';
import { formatCurrency } from '@/utils/formatters';
```

### Create React App での動作について

このプロジェクトはCreate React App 5.0を使用しています。通常、CRAでは`tsconfig.json`の`paths`設定だけでTypeScriptのインポートが解決されます。

万が一ビルドエラーが発生する場合は、以下の対応を検討してください：

#### オプション1: craco を使用（推奨）

```bash
npm install @craco/craco --save-dev
```

`craco.config.js` を作成：

```javascript
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};
```

`package.json` のスクリプトを変更：

```json
{
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test"
  }
}
```

#### オプション2: 相対パスに戻す

エイリアスで問題が発生する場合は、相対パスを使用することも可能です：

```typescript
import { mockThreads } from '../../mocks';
```

## トラブルシューティング

### インポートエラーが発生する場合

**エラー例**: `Cannot find module '@/mocks'`

**原因と解決方法**:

1. **TypeScriptは認識するがビルドエラー**
   - CRAのwebpack設定がエイリアスを認識していない
   - 解決: 上記の[Create React App での動作について](#create-react-app-での動作について)を参照してcracoを導入

2. **VSCodeでパスが解決されない**
   - VSCodeのTypeScriptサーバーを再起動: `Cmd+Shift+P` → "TypeScript: Restart TS server"
   - プロジェクトのリロード: VSCodeを再起動

3. **それでも解決しない場合**
   - 相対パスを使用（確実に動作）:
     ```typescript
     // パスエイリアス
     import { mockThreads } from '@/mocks';

     // 相対パス（代替案）
     import { mockThreads } from '../../mocks';
     ```

### ファイル別の相対パス例（参考）

エイリアスを使わない場合のパス例：

```typescript
// src/App.tsx から
import { mockAssetLedger } from './mocks';

// src/components/chat/ChatList.tsx から
import { mockThreads } from '../../mocks';

// src/components/features/assets/AssetDetail.tsx から
import { getAssetById } from '../../../mocks';
```

### 型エラーが発生する場合

型定義ファイル（`src/types/*.ts`）が正しくインポートされているか確認してください。

## 参考ドキュメント

- [開発スケジュール概要](../../docs/a.md)
- [開発スケジュール詳細](../../docs/b.md)
- [システム仕様書](../../docs/system-specification.md)
