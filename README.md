# MockApp-Run - 不動産資産管理アプリケーション

不動産資産の管理と提案書システムを提供するReactアプリケーションです。

## 主要機能

### 1. 資産管理機能
- 複数の不動産資産の一覧表示と管理
- 資産詳細情報の閲覧（基本情報、評価額、賃貸状況等）
- 資産の収益履歴グラフ表示
- Mapbox統合によるインタラクティブな地図表示

### 2. プロフェッショナル提案システム
- 不動産会社からの提案書管理
- 5種類の提案タイプ対応:
  - **売却提案** (Sale) - 売却価格、決済日数等
  - **賃貸提案** (Lease) - 月額賃料、契約期間等
  - **等価交換提案** (Exchange) - 交換条件、完成時期等
  - **借地提案** (GroundLease) - 年間地代、契約期間等
  - **その他提案** (Other) - カスタム条件

### 3. 提案比較・分析機能
- 複数提案の比較テーブル表示
- NPV（正味現在価値）の自動計算
- IRR（内部収益率）の表示
- カテゴリー別フィルタリング

### 4. リッチHTML提案書表示
- 不動産会社が作成した詳細な提案書のHTML表示
- iframe を使用した安全なコンテンツ表示
- モーダルウィンドウでの全画面表示

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
│   │   ├── AssetDetail.tsx     # 資産詳細ビュー（提案タブ含む）
│   │   ├── ProposalComparison.tsx # 提案比較テーブル
│   │   ├── ProposalDetailView.tsx # 個別提案詳細表示
│   │   ├── ProfileModal.tsx    # プロフィールモーダル
│   │   ├── CustomButton.tsx    # カスタムボタンコンポーネント
│   │   └── LoadingPlaceholder.tsx # ローディング表示
│   ├── store/
│   │   └── assetStore.ts       # Zustand ストア定義
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
  id: string;
  name: string;
  type: 'office' | 'residential' | 'retail' | 'warehouse';
  area: number;
  value: number;
  location: string;
  coordinates: [number, number];
  proposals: Proposal[];
  // ...
}
```

### Proposal（提案）
```typescript
type Proposal = SaleProposal | LeaseProposal | ExchangeProposal | GroundLeaseProposal | OtherProposal;

interface BaseProposal {
  id: string;
  company: string;
  summary: string;
  htmlContent?: string;
  created_at: string;
}

interface SaleProposal extends BaseProposal {
  kind: 'sale';
  price: number;
  days_to_close: number;
}
// ... 他の提案タイプ
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

### 提案書の閲覧
1. 資産詳細画面で「プロの提案」タブをクリック
2. 提案一覧から閲覧したい提案の「詳細」ボタンをクリック
3. 提案詳細画面で「提案書を見る」をクリックしてHTML提案書を表示

### 提案の比較
1. 「プロの提案」タブで比較したい提案のチェックボックスを選択
2. 画面下部の「この◯件を比較する」ボタンをクリック
3. 比較テーブルで各提案の条件を並べて確認

### カテゴリー別フィルタ
提案一覧上部のタブで提案タイプを切り替え:
- 売却
- 賃貸
- 等価交換
- 借地
- その他

## 特徴的な実装

### TypeScript型安全性
Union型を使用した提案タイプの型定義により、各提案タイプ固有のプロパティを安全にアクセス:
```typescript
const formatPrice = (proposal: Proposal) => {
  if (proposal.kind === 'sale' && proposal.price) 
    return `¥${proposal.price.toLocaleString('ja-JP')}`;
  // ...
};
```

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
