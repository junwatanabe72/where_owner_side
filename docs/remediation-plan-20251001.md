# WHERE OWNER 対策案（2025-10-01）

## 背景
2025-09-30実施のコードレビューで、ユーザー体験およびセキュリティ整合性に直結する5件の不備が確認された。本ドキュメントでは原因分析と対策方針、実装タスクを整理する。

## 1. プライバシーレベル変更 UI が機能していない
- **症状**: `TopNav` に `setPrivacyLevel` が渡されているが、実際の UI が存在しないため公開レベルを切り替えられない。
- **影響**: 最小公開/限定公開などの制御ロジックが一切動作せず、期待されるマスキングやレイヤー制限が無効化される。
- **対策方針**:
  1. `TopNav` に公開レベル切替メニュー（ラジオ/ドロップダウン）を実装し、`setPrivacyLevel` を呼び出す。
  2. `useAssetManagement` から返している `privacyLevel` を `useMapLayers` や `AssetListView` 等へ流している箇所の連携を確認する。
  3. UI 追加後、E2E/単体テストで公開レベル変更が `AssetListView` のマスキングに効くことを確認する。
- **担当タスク**:
  - `src/components/layout/TopNav/TopNav.tsx` にメニュー実装。
  - 必要に応じて `TopNav` のモバイル UI を考慮したモーダル化。
  - `privacyLevel` 変更時の副作用テスト追加（React Testing Library）。

## 2. マップレイヤーがプライバシーポリシーを無視
- **症状**: `MapView` のトグルが常に `setMapLayers` を更新し、`isLayerAllowed` を参照していない。
- **影響**: 非公開レベルでも高精度レイヤーを表示でき、要件違反。
- **対策方針**:
  1. `handleLayerToggle` 内で `isLayerAllowed(layer, privacyLevel)` を必ず確認し、許可されない場合は操作を無視。
  2. UI 上も `disabled` を正しく反映し、ツールチップ等で制限理由を表示する。
  3. `useMapLayers` でも `privacyLevel` 変更時に許可されなくなったレイヤーを自動的に `false` へ落とす。
- **担当タスク**:
  - `src/components/features/map/MapView.tsx` のイベントハンドラ修正。
  - `src/hooks/useMapLayers.ts` での状態クレンジング追加。
  - ポリシーテスト（Jest）を `mapHelpers` レイヤーで追加。

## 3. レイヤートグルが実装と不整合
- **症状**: UI には `night` や `potential` などのトグルがあるが、`customLayers` には該当レイヤーが存在せず `applyLayerVisibility` でも扱われていない。
- **影響**: ユーザーがトグルを切り替えても地図が変化せず、信頼性を損なう。
- **対策方針**:
  - **選択肢A**: 実装可能なレイヤーのみトグルを残し、UI から未実装分を撤去。
  - **選択肢B**: `customLayers` と Mapbox スタイルを拡張して不足レイヤーのソースを追加。
  - 当面は選択肢Aで整合を保ち、将来的に独自レイヤーを導入する際は `map-implementation-design.md` を更新。
- **実施状況 (2025-10-01)**: 選択肢Aを採用し、UIから未実装レイヤー用トグルを撤去。`docs/map-implementation-design.md` でサポートレイヤー一覧も更新済み。
- **担当タスク**:
  - `src/components/features/map/MapView.tsx` から未実装トグルを削除。
  - ドキュメント更新（`docs/map-implementation-design.md`）で提供レイヤー一覧を最新化。
  - 将来のレイヤー追加に備えて `src/map/constants.ts` の型定義と `MapLayers` タイプを整理。

## 4. 提案信頼度の表示値が誤っている
- **症状**: `confidence` が 0〜1 の割合なのに、そのまま `%` を付けて表示し「0.9%」となる。
- **影響**: KPI が誤解され、担当者がリスク評価を誤る恐れ。
- **対策方針**:
  1. 表示時に `Math.round(confidence * 100)` などでパーセンテージ化。
  2. 数値フォーマッタを `utils/formatters` に追加し共通化。
  3. 将来的に `confidence` を 0〜100 へ正規化する場合はモックデータを再生成。
- **担当タスク**:
  - `src/components/ProposalDetailView.tsx` と `ProposalSection` 系コンポーネントの表示修正。
  - `src/store/assetStore.ts` モックの型コメントに期待値を追記。
  - ユニットテスト：`calculateConfidenceLabel`（仮）を追加して境界値を検証。

## 5. 物件スライドオーバーが開かない
- **症状**: `openDetail` が一度も `true` にならず `PropertySlideOver` が常に非表示。
- **影響**: マップビューからのクイック参照 UX が失われている。
- **対策方針**:
  1. `AssetListView` で行クリック時に `setOpenDetail(true)` を呼び出すか、`AssetView` の `handleAssetClick` 内で管理する。
  2. スライドオーバー表示中は `selectedAsset` の詳細を表示し、閉じる操作で `onClose` を呼び出す。
  3. 将来的にマップマーカーからも開けるよう、`PropertySlideOver` を `AssetView` の state と同期。
- **担当タスク**:
  - `src/components/features/assets/AssetView.tsx` の状態遷移を修正。
  - `PropertySlideOver` で null ガードを強化し、テストを追加。
  - UI 回帰テスト（Storybook or Playwright）で開閉を検証。

## ロードマップ提案
1. **スプリント1（今週）**: プライバシー制御（項目1-2）と表示整合性（項目4-5）を優先対応。
2. **スプリント2（来週）**: レイヤー整理（項目3）と関連ドキュメント更新。
3. **リリース前検証**: UI/E2E テストをCIに追加し、公開レベルとマップレイヤーの組み合わせを自動検証。

## 優先度と担当割り当て
| ID | 対応内容 | 優先度 | 規模 | 担当 | 備考 |
| --- | --- | --- | --- | --- | --- |
| 1 | プライバシーレベル切替 UI 実装 | P0 (今週スプリント内必須) | M | Frontend A | UI 実装＋単体テスト追加 |
| 2 | レイヤートグルのポリシー連携強化 | P0 (今週スプリント内必須) | L | Frontend B | `useMapLayers`/`MapView` 改修、Regression テスト |
| 3 | トグルとレイヤー定義の整合性 | 完了 (2025-10-01) | M | Frontend C | 未実装レイヤーのトグル撤去済。Mapbox拡張は別途検討 |
| 4 | 提案信頼度表示ロジック修正 | P0 (今週スプリント内必須) | S | Frontend A | 共通フォーマッタ導入、表示確認 |
| 5 | PropertySlideOver 開閉制御復旧 | P0 (今週スプリント内必須) | M | Frontend D | `AssetView` 状態管理修正＋E2E |

> 担当者は仮のロール名です。実際のアサインは 2025-10-02 のデイリースクラムで確定し、Jira チケット (WHERE-*) に紐付ける予定。

## 参考
- レビュー指摘日: 2025-10-01
- レビュー担当: Codex
- 対応チーム: WHERE OWNER Frontend
