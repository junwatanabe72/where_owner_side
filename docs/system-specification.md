# WHERE 不動産マップシステム仕様書

## 概要
WHERE は、不動産物件情報を地図上で視覚的に表示し、管理するためのWebアプリケーションです。Mapbox GLを使用したインタラクティブな地図表示と、詳細な物件情報管理機能を提供します。

## 技術スタック

### フロントエンド
- **React** 19.1.1 - UIフレームワーク
- **TypeScript** 5.9.2 - 型安全な開発
- **Mapbox GL** 3.1.0 - 地図表示エンジン
- **Material-UI** 7.3.1 - UIコンポーネントライブラリ
- **Tailwind CSS** 3.4.17 - ユーティリティファーストCSS
- **Turf.js** 7.2.0 - 地理空間データ処理

## 主要機能

### 1. 地図表示機能
#### 1.1 基本地図表示
- Mapbox GLによるインタラクティブな地図
- ストリートマップと衛星画像の切り替え機能
- ズーム・パン操作のサポート
- 日本語ラベル表示（@mapbox/mapbox-gl-language）

#### 1.2 都市計画レイヤー表示
複数の都市計画情報をレイヤーとして表示：
- **用途地域** - 商業地域、住居地域、工業地域など
- **容積率** - 建築可能な延床面積の割合
- **建蔽率** - 敷地に対する建築面積の割合  
- **防火地域** - 防火地域、準防火地域の区分
- **高度地区** - 建築物の高さ制限

#### 1.3 物件マーカー表示
- 物件の位置をピンで表示
- 色分けによる物件評価の視覚化（originalRaito値による）
  - 赤: 900以上
  - オレンジ: 850-899
  - 黄: 800-849
  - 緑: 750-799
  - 青: 700-749
  - 紫: 700未満
- クリック可能なマーカーによる詳細表示

### 2. 物件情報管理

#### 2.1 物件詳細情報
各物件に以下の情報を保持：

**基本情報**
- 物件名
- 所在地
- 交通（最寄駅、徒歩分数）
- 土地面積（㎡）
- 建物面積（㎡）
- 築年月
- 構造（木造、鉄骨造、RC造など）
- 間取り

**都市計画情報**
- 用途地域
- 容積率（%）
- 建蔽率（%）
- 都市計画区域

**規制情報**
- 防火規制（防火地域、準防火地域）
- 高度地区

**設備・その他**
- 土地権利（所有権、借地権など）
- 接道状況
- 設備（電気、ガス、水道など）
- 現状（更地、古家付きなど）

#### 2.2 物件リスト表示
- グリッド形式での物件一覧表示
- 物件ごとの提案数表示
- 新着提案のバッジ表示

#### 2.3 物件詳細ビュー
- 物件の全情報を整理して表示
- セクション分けされた情報表示
  - 基本情報セクション
  - 都市計画・規制セクション
  - 設備・その他セクション

### 3. 提案管理機能

#### 3.1 提案書管理
- 物件ごとの提案書リスト
- 新着提案の強調表示
- お気に入り機能
- 提案書の閲覧（PDF/HTMLビューア）

#### 3.2 通知機能
- 新着提案のアラート表示
- 物件名を含む通知メッセージ

### 4. ユーザーインターフェース

#### 4.1 ナビゲーション
- タブ切り替え（マップ、リスト、詳細、編集、設定）
- ヘッダーメニューによる画面遷移

#### 4.2 ポップアップ/ダイアログ
- マーカークリック時の物件情報ポップアップ
- Material-UIダイアログによる詳細表示
- レスポンシブデザイン対応

#### 4.3 地図操作UI
- 衛星/ストリート切り替えボタン
- ズームコントロール
- 現在地表示

### 5. データ構造

#### 5.1 Property型
```typescript
type Property = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  hasAlert?: boolean;
  station?: string;
  landArea?: number;
  buildingArea?: number;
  builtYear?: number;
  builtMonth?: number;
  structure?: string;
  useDistrict?: string;
  volumeRate?: number;
  coverageRate?: number;
  landCategory?: string;
  cityPlan?: string;
  fireProof?: string;
  heightDistrict?: string;
  landRight?: string;
  frontRoad?: string;
  facilities?: string;
  status?: string;
  floors?: number;
  layout?: string;
}
```

#### 5.2 LandProperty型
```typescript
interface LandProperty {
  nearStation: Array<{
    min: number;
    geometry: {
      lat: number;
      lng: number;
    };
  }>;
  wood: {
    originalRaito: number;
  };
  address?: string;
  price?: number;
  area?: number;
}
```

### 6. 地図レイヤー統合機能

#### 6.1 レイヤー情報の統合
- 複数のMapboxレイヤーからの情報を統合
- クリック位置の全レイヤー情報を取得
- HTML形式でのポップアップ表示

#### 6.2 レイヤー辞書
各レイヤーのプロパティ値を日本語に変換：
- 用途地域コード → 日本語名称
- 防火地域コード → 防火地域/準防火地域
- 高度地区コード → 具体的な高さ制限

### 7. ユーザー設定

#### 7.1 プライバシー設定
- 情報公開レベルの管理
- 3段階のプライバシーレベル

### 8. レスポンシブデザイン
- デスクトップ、タブレット、モバイル対応
- Tailwind CSSによる柔軟なレイアウト
- Material-UIのレスポンシブコンポーネント

## ディレクトリ構造

```
src/
├── components/
│   └── atoms/
│       └── Popup.tsx          # 物件詳細ポップアップ
├── map/
│   ├── index.tsx             # メインマップコンポーネント
│   ├── marker/
│   │   ├── index.tsx         # マーカー管理
│   │   └── ClickableMarker.tsx # クリック可能マーカー
│   ├── layerClickHandler/
│   │   └── index.tsx         # レイヤークリックハンドラ
│   └── utils/
│       └── layerDictionary.ts # レイヤー辞書と統合機能
├── types/
│   └── index.d.ts            # 型定義
└── App.tsx                   # メインアプリケーション

docs/
├── detail.md                 # 物件詳細フィールド仕様
└── system-specification.md  # 本仕様書
```

## 環境設定

### 必要な環境変数
```
REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

### 開発サーバー起動
```bash
npm install
npm start
```

### ビルド
```bash
npm run build
```

## セキュリティ考慮事項
- Mapboxアクセストークンの環境変数管理
- 物件価格情報の非表示（要件により除外）
- XSS対策（Reactの自動エスケープ）

## パフォーマンス最適化
- マーカーの効率的な再レンダリング管理
- レイヤー表示の遅延読み込み
- Turf.jsによる地理計算の最適化

## 今後の拡張予定
- 物件検索・フィルタリング機能
- 提案書のリアルタイムコラボレーション
- 物件比較機能
- データエクスポート機能
- ユーザー認証・権限管理