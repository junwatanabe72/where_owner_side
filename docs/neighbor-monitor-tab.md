# 隣接土地監視タブ 設計ドキュメント

## 目的
登録済みの対象土地と、それに隣接する筆（地番）を一覧・地図で把握できる監視タブを提供する。リストで現状や留意点を確認しながら、地図上で位置関係と警戒対象を直感的に理解できる UI を目指す。

## 提供機能概要
- タブナビゲーションに「隣接土地監視」を追加し、対象資産の詳細ビューから切り替え可能にする。
- ビューモードを「リスト」「地図」で切り替えられるトグル（Segmented control）を上部に配置。リストビューでは隣接筆一覧を表形式で表示、地図ビューでは専用マップを全幅表示する。
- 狭い画面ではデフォルトをリストビューとし、地図ビューはフルスクリーン切り替えで表示。広い画面ではデュアルカラム（リスト＋地図）にも切り替えられるハイブリッド構成を検討。
- 地図ビューは対象地および隣接地を塗り分け表示。選択行と連動してハイライトやポップアップを切り替える。
- 行クリックで地図中央を該当地にパン、ホバーで一時ハイライト、警告がある筆にはアイコンとフキダシを表示する。
- 隣接情報が未取得の場合は空状態メッセージと設定導線を表示。ロード中はスケルトンスクリーンを表示。

## データモデル
`src/types/neighbor.ts` に下記型を定義する想定。

```ts
export type NeighborParcelStatus = 'subject' | 'watch' | 'info';

export type NeighborParcel = {
  id: string;              // 内部ID（GeoJSON Feature ID）
  label: string;           // 表示用地番
  areaSqm: number;         // 地積（㎡）
  landUse: string;         // 用途・地目
  note?: string;           // 備考表示
  status: NeighborParcelStatus;
  alerts?: string[];       // 警戒メッセージ
  lastEvent?: {
    occurredAt: string;    // ISO 8601
    summary: string;       // イベント概要
  };
  geometry?: GeoJSON.Polygon | GeoJSON.MultiPolygon;
};
```

- 実装初期は `src/data/neighborParcels.ts` にモックデータを配置し、将来的には API 連携で更新する。
- `geometry` がない場合は地番から派生する簡易境界（バッファ矩形）をクライアント側で生成する想定。

## 状態管理
- Zustand ストア `assetStore` に下記セレクタを追加予定。
  - `getNeighborParcels(assetId: number): NeighborParcel[]`
  - `getNeighborLoading(assetId: number): boolean`
  - `getNeighborError(assetId: number): string | null`
- 将来的に API 通信を行う際はフェッチとキャッシュをストアで担保する。

## UI コンポーネント構成

```
AssetDetail
 └─ NeighborMonitorTab
     ├─ NeighborParcelToolbar（フィルタ、件数、更新日時、ビューモード切替）
     ├─ NeighborParcelTable（リストビュー表示用）
     │   └─ NeighborParcelRow（行ホバー・行選択制御）
     ├─ NeighborParcelMap（地図ビュー表示用、Mapbox または簡易 SVG）
     └─ NeighborLegend（凡例表示）
```

- **NeighborMonitorTab**: データ取得、選択状態、フィルター状態の管理を担当。
  - `selectedParcelId`, `hoveredParcelId`, `filterMode ('all' | 'watch')` をローカル state として保持。
  - ロード／エラー／空状態の UI をここで分岐。
- **NeighborParcelTable**: 表表示。行クリックで `onSelect(id)`、ホバーで `onHover(id)` を通知。対象地行は `status === 'subject'`、警戒行は `status === 'watch'` でスタイル変更。
- **NeighborParcelMap**: Mapbox レイヤを追加し、`selected`/`hovered`/`status` に応じて塗り分け。geometry が無い場合は簡易図形で代替。クリック時に `onSelect` を呼び出す。
- **NeighborLegend**: 対象地・隣接地・警戒地の色説明を表示。

## レイアウト
- 上部ツールバーで `viewMode` を管理（`list`, `map`, 将来的に `split`）。
- モバイルおよび狭幅レイアウトでは `viewMode === 'list'` のみを初期表示し、地図はトグルで全幅に切り替え。戻るボタンでリストへ復帰。
- デスクトップでは `viewMode === 'split'` を許容し、`grid grid-cols-1 gap-6 lg:grid-cols-2` でリストと地図を並べる。
- 表カード幅が狭い場合は `overflow-x-auto` で横スクロール。
- 画像参考の通り、各カードは丸角ボックス（`rounded-xl border shadow-sm`）で整える。

## インタラクション詳細
- 行選択時：地図中央を該当地の重心にパンし、枠線を太線＋赤で表示。地図ビューのみならずスプリットビューでも同様に反映。
- 行ホバー時：薄いハイライト色を地図に表示し、ホバー解除で元に戻す。
- 地図ビュー直接操作：区画クリックでリスト選択を更新し、上部メタ情報カードを表示。
- 警戒情報がある場合、地図上に吹き出し（`BadgeHelp` やカスタムラベル）を表示。行には `AlertCircle` アイコン＋ツールチップで同内容を表示。
- フィルターセグメントは初期は UI のみ（ローカル state 切り替え）で実装、将来的な API フィルターに備える。
- ビューモード切替時、現在選択している地番を維持しつつスクロール位置をリセットする。

## ローディング・空状態・エラー
- ローディング: カード内にスケルトン行（`animate-pulse`）を4件表示し、地図側はスピナー。
- 空状態: 「隣接筆情報がありません。境界データを追加してください。」のメッセージと設定画面へのリンクボタン。
- エラー: リトライボタン付きのエラーメッセージを表示。

## 実装ステップ
1. 型定義とモックデータ作成 (`types/neighbor.ts`, `data/neighborParcels.ts`)。
2. Zustand ストアにセレクタ・初期データを追加。
3. `AssetDetail.tsx` のタブ配列に `隣接土地監視` を追加し、`NeighborMonitorTab` を組み込み。
4. `NeighborMonitorTab`（状態管理・レイアウト）と `NeighborParcelTable`（表）を実装。
5. `NeighborParcelMap` で地図表示の骨組みを実装。狭幅環境でも動作するよう、初期表示は丸の内エリア（35.681236, 139.764936 付近）をセンターに固定し、対象地ジオメトリが取得できたらズーム調整する。バックアップとして固定画像や簡易 SVG を用意。
6. 相互連携（選択・ホバー・警告表示）を接続。
7. ローディング・空状態・エラー UI、凡例、フィルターを整備。
8. スナップショットテストや状態ロジックのテストを追加。

## 今後の拡張余地
- API 接続によるリアルタイム更新、変更検知の通知機能。
- 履歴タイムラインやイベントの差分比較表示。
- 監視条件（例えば所有者変更、高額抵当権など）のカスタマイズ。
- 対象地複数選択、街区単位の表示切り替え。

---
参考画像: 「隣接筆一覧」「画面イメージ」（ユーザー提供のモックアップ）

## 残タスクまとめ（2025-10-16 時点）
- Mapbox アクセストークンを `.env` などで `REACT_APP_MAPBOX_TOKEN`（または `REACT_APP_MAPBOX_ACCESS_TOKEN`）として設定し、本番環境でも実地図が表示できるようにする。
- 隣接筆ポリゴンを API／バックエンドから取得する実装に置き換え、Zustand 側の `neighborLoading`・`neighborError` を実際に利用する。
- Mapbox レイヤにアラート内容のポップアップやバッジを追加し、一覧との連携を強化する。
- eslint 警告（特に `react-hooks/exhaustive-deps` と未使用変数）を解消し、ビルド品質を維持する。
