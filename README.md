# WHERE - 不動産資産管理プラットフォーム

## システムビジョン

WHEREは、不動産オーナーの意思決定を支援する統合プラットフォームです。地図上での視覚的な資産管理と、不動産プロフェッショナルからの提案を一元化し、データドリブンな不動産経営を実現します。

### ミッション
- **透明性の確保**: 不動産の都市計画情報や規制を可視化し、オーナーの情報格差を解消
- **選択肢の最適化**: 複数の提案を比較・分析し、最適な意思決定を支援
- **価値の最大化**: NPV/IRR等の財務指標で、感覚的な判断から定量的な評価へ

### 提供価値
1. **地図ベースの直感的UI** - Mapboxを活用した都市計画レイヤー表示
2. **統合的な提案管理** - 売却・賃貸・等価交換・借地等、あらゆる活用提案を一元管理
3. **定量的な比較分析** - NPV/IRRによる提案の財務評価と比較
4. **リアルタイム監視** - 隣地の登記変更や都市計画の更新を自動検知

## 最近の更新（2025年9月）

### リファクタリング実施内容
- **コンポーネントの責務分離**: 大規模コンポーネントを機能別に分割
- **カスタムフックの導入**: ビジネスロジックをUIから分離
- **型定義の整理**: TypeScript型定義を専用ファイルに集約
- **コード最適化**: AssetDetail.tsxを679行から519行に削減（24%減）
- **新規コンポーネント作成**:
  - `ProposalHtmlModal.tsx`: HTML提案書表示モーダル
  - `AdjacentParcelsTab.tsx`: 隣地地番情報タブ

## 実装済み機能

### 1. 地図ベース資産管理
- **Mapbox統合地図表示** - インタラクティブな地図上での資産可視化
- **都市計画レイヤー表示** - 用途地域、容積率、建蔽率、防火地域、高度地区
- **物件マーカー** - 評価指標による色分け表示（originalRatio値基準）
- **プライバシー設定** - 3段階の情報公開レベル管理

### 2. 資産詳細管理
- **包括的な物件情報** - 基本情報、都市計画、権利、設備等の統合管理
- **タブ別情報整理** - 概要、評価、権利、資料、受領提案、隣地状況、履歴
- **隣地監視機能** - 隣接地の登記変更を自動検知・通知
- **資産評価表示** - 評価額レンジ、坪単価、近隣比較

### 3. 提案管理システム
- **5種類の提案タイプ対応**:
  - **売却提案** - 仲介/買取、売却価格、手数料、決済日数
  - **賃貸提案** - 月額賃料、共益費、契約期間、フリーレント
  - **等価交換提案** - 交換条件、完成時期、持分割合
  - **借地提案** - 年間地代、契約期間、権利金、更地返還条件
  - **その他提案** - 駐車場、広告塔、太陽光発電等のカスタム提案

### 4. 提案分析・比較
- **財務指標算出** - NPV（正味現在価値）、IRR（内部収益率）
- **比較テーブル** - 複数提案の並列比較表示
- **カテゴリー別フィルタ** - 提案タイプごとの絞り込み
- **HTML提案書表示** - 詳細な提案書のモーダル表示

## 今後の実装予定機能

### 近日実装予定
- **目的別スコアリング** - 《現金化》《安定運用》《成長》の観点で提案を評価
- **前提条件カスタマイズ** - 評価期間、割引率、税率等のパラメータ調整
- **キャッシュフロー可視化** - 年次収支のグラフ表示

### 中長期計画
- **物件検索・フィルタリング** - 条件指定による資産検索
- **リアルタイムコラボレーション** - 提案書の共同編集
- **AI提案分析** - 機械学習による提案の自動評価
- **データエクスポート** - Excel/PDF形式での報告書出力
- **ユーザー認証・権限管理** - マルチユーザー対応

## 技術スタック

### フロントエンド
- **React 18.3.1** - UIフレームワーク
- **TypeScript 4.9.5** - 型安全性の確保
- **Tailwind CSS 3.4.17** - ユーティリティファーストCSS
- **Framer Motion 11.15.0** - アニメーションライブラリ

### 状態管理
- **Zustand 5.0.2** - 軽量状態管理ライブラリ

### 地図機能
- **Mapbox GL JS 3.8.0** - インタラクティブマップ
- **React Map GL 7.1.7** - React用Mapboxラッパー

### チャート
- **Recharts 2.15.0** - データビジュアライゼーション

### アイコン
- **Lucide React 0.469.0** - モダンアイコンセット

## プロジェクト構成

```
mockapp-run/
├── public/
│   ├── proposals/              # HTML提案書テンプレート
│   │   └── direct-transaction-proposal.html
│   └── index.html
├── src/
│   ├── components/
│   │   ├── atoms/              # 基本UIコンポーネント
│   │   │   └── LayerToggle.tsx
│   │   ├── features/           # 機能別コンポーネント
│   │   │   ├── ProposalHtmlModal.tsx  # 提案書HTMLモーダル
│   │   │   ├── AdjacentParcelsTab.tsx # 隣地地番タブ
│   │   │   ├── assets/         # 資産管理機能
│   │   │   ├── map/            # 地図関連機能
│   │   │   └── proposals/      # 提案関連機能
│   │   ├── AssetDetail.tsx     # 資産詳細ビュー（519行に最適化）
│   │   ├── AssetView.tsx       # 資産一覧ビュー
│   │   ├── ProposalComparison.tsx # 提案比較テーブル
│   │   ├── ProposalDetailView.tsx # 個別提案詳細表示
│   │   ├── ProfileModal.tsx    # プロフィールモーダル
│   │   └── PropertyVisualizationMap.tsx # 不動産地図表示
│   ├── hooks/                  # カスタムフック
│   │   ├── useAssetManagement.ts # 資産管理ロジック
│   │   ├── useInfoTip.ts       # ツールチップロジック
│   │   └── useMapLayers.ts     # 地図レイヤー管理
│   ├── store/
│   │   └── assetStore.ts       # Zustand ストア定義
│   ├── types/                  # TypeScript型定義
│   │   ├── asset.ts            # 資産関連の型
│   │   ├── proposal.ts         # 提案関連の型
│   │   └── index.ts            # 共通型定義
│   ├── utils/                  # ユーティリティ関数
│   │   └── index.ts            # 共通関数
│   ├── styles/
│   │   └── index.css           # グローバルスタイル
│   ├── App.tsx                 # メインアプリケーション
│   └── index.tsx               # エントリーポイント
├── .env.local                  # 環境変数（Mapboxトークン）
├── package.json
├── tsconfig.json
└── README.md
```

## 主要コンポーネント

### AssetDetail.tsx
資産詳細画面のメインコンポーネント。以下のタブを含む:
- 概要: 基本情報と評価額
- 評価: 資産の詳細評価
- プロの提案: 不動産会社からの提案一覧
- 履歴: 収益履歴グラフ

### ProposalComparison.tsx
提案比較機能を提供:
- カテゴリー別タブ切り替え
- テーブル形式での提案一覧表示
- 複数提案の選択と比較
- NPV/IRR計算表示

### ProposalDetailView.tsx
個別提案の詳細表示:
- 提案内容の詳細情報
- 提案書HTMLの表示ボタン
- レスポンシブデザイン対応

## データモデル

### Asset（資産）
```typescript
interface Asset {
  id: number;
  address: string;
  lat: number;
  lng: number;
  area: number;              // 土地面積（㎡）
  owner: string;              // 所有者
  status: string;             // ステータス
  memo: string;               // メモ
  valuationMedian?: number;   // 評価額中央値
  
  // 都市計画情報
  zoning?: string;            // 用途地域
  coverageRatio?: number;     // 建蔽率
  floorAreaRatio?: number;    // 容積率
  landCategory?: string;      // 地目
  
  // 接道・形状
  frontage?: number;          // 間口
  depth?: number;             // 奥行
  roadAccess?: string;        // 接道状況
  
  // 周辺環境
  nearestStation?: string;    // 最寄駅
  stationDistance?: number;   // 駅距離（徒歩分）
}
```

### Proposal（提案）
```typescript
type Proposal = SaleProposal | LeaseProposal | ExchangeProposal | 
                GroundLeaseProposal | OtherProposal;

interface BaseProposal {
  id: string;
  company: string;
  summary: string;
  htmlContent?: string;
  created_at: string;
  confidence?: number;  // 根拠スコア
}

interface SaleProposal extends BaseProposal {
  kind: 'sale';
  mode: 'broker' | 'principal';  // 仲介/買取
  price: number;
  days_to_close: number;
  costs?: {
    broker?: number;
    taxes?: number;
  };
}

interface LeaseProposal extends BaseProposal {
  kind: 'lease';
  monthly_rent: number;
  common_fee?: number;
  term_years: number;
  free_rent_m?: number;
  occupancy?: number;
}
```

### RegistryAlert（登記変更通知）
```typescript
interface RegistryAlert {
  id: string | number;
  parcel: string;         // 地番
  change: string;         // 変更内容
  date: string;           // 変更日
  alertLevel?: 'low' | 'medium' | 'high';
}
```

## 環境変数の設定

1. `mockapp-run` 配下に `.env.local` を作成し、以下を設定してください。

   `REACT_APP_MAPBOX_TOKEN=YOUR_MAPBOX_ACCESS_TOKEN`

2. 参考: `searchLandYK/.env.local` に既存の Mapbox トークンが定義されています（キー名: `NEXT_PUBLIC_MAPBOXPASSWORD`）。同一値を `REACT_APP_MAPBOX_TOKEN` にコピーして使用してください。

3. 反映するには `npm start` を再実行してください。

※ 環境変数が設定されていない場合は、グリッド背景のモック表示に自動フォールバックします。

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start

# プロダクションビルド
npm run build

# テストの実行
npm test
```

## 主な機能の使い方

### 資産管理の基本操作
1. **地図表示**: トップ画面の地図で保有資産を確認
2. **レイヤー切り替え**: 地図下部のトグルで都市計画情報を表示
3. **資産選択**: 地図上のマーカーまたはリストから資産を選択
4. **詳細表示**: 資産をクリックして詳細画面へ遷移

### 提案書の管理
1. 資産詳細画面で「受領提案」タブをクリック
2. 提案一覧から閲覧したい提案の「詳細」ボタンをクリック
3. 提案詳細画面で「提案書を見る」をクリックしてHTML提案書を表示

### 提案の比較分析
1. 「受領提案」タブで比較したい提案のチェックボックスを選択
2. 画面下部の「この◯件を比較する」ボタンをクリック
3. 比較テーブルで各提案の条件とNPV/IRRを確認

### 隣地監視
1. 資産詳細画面で「隣地状況」タブをクリック
2. 隣接地の登記情報と変更履歴を確認
3. 変更があった場合は黄色でハイライト表示

### プライバシー設定
- **最小公開**: 基本情報のみ表示
- **限定公開**: 都市計画情報を追加表示
- **フル公開**: 全ての詳細情報を表示

## 特徴的な実装

### コンポーネント設計
- **Atomic Design**: atoms/features階層での構造化
- **責務の明確化**: 各コンポーネントが単一の役割を持つ設計
- **再利用性**: 共通コンポーネントの抽出と活用

### TypeScript型安全性
Union型を使用した提案タイプの型定義により、各提案タイプ固有のプロパティを安全にアクセス:
```typescript
const formatPrice = (proposal: Proposal) => {
  if (proposal.kind === 'sale' && proposal.price) 
    return `¥${proposal.price.toLocaleString('ja-JP')}`;
  // ...
};
```

### カスタムフック
ビジネスロジックのカプセル化:
- `useAssetManagement`: 資産管理の状態とロジック
- `useInfoTip`: ツールチップの表示制御
- `useMapLayers`: 地図レイヤーの管理

### レスポンシブデザイン
Tailwind CSSのユーティリティクラスを使用した画面サイズ対応:
- モバイル: sm:クラス
- タブレット: md:クラス
- デスクトップ: lg:クラス

### アニメーション
Framer Motionを使用した滑らかなUI遷移:
- モーダルの開閉アニメーション
- タブ切り替えアニメーション
- ホバーエフェクト

### パフォーマンス最適化
- コンポーネントの適切な分割による再レンダリング最小化
- useMemoによる計算結果のキャッシュ
- 動的インポートによる遅延ロード対応

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)


- プライバシー設定のUXが未実装。ドキュメントでは非公開/限定公開/詳細公開の切替と非公開制約が求められていますが（tochiSaga/
  index.html:946-1016）、App.tsxで渡しているsetPrivacyLevelはTopNav側で一切使われておらず（src/App.tsx:12-38,src/components/
  layout/TopNav/TopNav.tsx:15-75）、公開レベルを変更できません。
  - 登記の自動反映ステータスが表示されない。資料では最終反映日や未反映件数、検知→取得→反映の流れを可視化することになっ
  ています（tochiSaga/index.html:764-928）。実装側の法務タブは固定テキストのみで監視設定以外に差分・鮮度指標がなく（src/
  components/AssetDetail.tsx:196-296）、ストアのregistryAlertsも未使用です（src/store/assetStore.ts:1127-1155）。
  - Web資産台帳の資料充足率が欠落。ドキュメントは基本情報・権利・資料＋資料充足率の進捗バーを提示（tochiSaga/index.html:671-
  757）していますが、AssetDetailの「資料」タブはサンプルカードのみで進捗メータや不足資料の一覧がありません（src/components/
  AssetDetail.tsx:296-360）。
  - 隣地監視アラートをナビゲーションで通知していない。資料では隣地イベントを見逃さないための通知導線が強調されています
  （tochiSaga/index.html:1019-1124）。実装はAdjacentParcelsTabでハードコードした表を出すだけで（src/components/features/
  AdjacentParcelsTab.tsx:1-120）、ストアのregistryAlertsを使ったグローバル通知やTopNavの警告バッジ連動がありません。
  - マップレイヤーの仕様が整合していない。ドキュメントは夜間光や建築許可件数など独自レイヤーを想定しています（tochiSaga/
  index.html:1127-1256）が、map/constants.tsで定義があるのは用途/高度/防火のみ（src/map/constants.ts:1-24）。一方MapViewでは
  未定義のnightやpotentialトグルを露出しており（src/components/features/map/MapView.tsx:33-118）、UXが期待とズレています。

  修正案

  1. プライバシー設定用のドロップダウン/モーダルをTopNavに実装し、useAssetManagementのprivacyLevelと双方向バインド。資産ご
  との公開レベルも追加するならassetStoreにフィールドを持たせ、リスト表示のマスキング処理（既にあるAssetListView.formatArea/
  formatValuation）と連動させる。
  2. AssetDetailの法務タブにregistryAlerts集計を表示（最終反映日=最新アラートの日付、未反映件数=アラート件数など）し、監視状
  態→差分取得→反映完了のタイムラインUIを追加。合わせてassetStoreのデータ構造を差分種別・反映状態で拡張。
  3. 「資料」タブに資料充足率を計算するdocumentCompletionフィールドとプログレスバーを追加し、足りない資料をタグ化して列挙。
  アップロード動線が必要ならUploadボタン＋ダイアログを設ける。
  4. registryAlertsをTopNavのアラートバッジやダッシュボードカードに連携し、隣地更新の一覧/フィードを共通コンポーネント化。
  AdjacentParcelsTabのスタブデータはストア参照に置き換える。
  5. マップレイヤーについては、実装可能なレイヤーのみUIに残すか、map/constants.tsを拡充して夜間光/建築許可/ポテンシャルの
  ソースを実装。さらにisLayerAllowedをMapView側で活用してプライバシーレベルに応じたトグル無効化を行う。

  Next Steps

  1. プライバシー設定UIとデータモデル拡張のタスク分解。
  2. 登記鮮度指標と資料充足率のデータ要件整理、モック実装。
  3. マップレイヤーの対応可否を調査し、UIと実データを同期。