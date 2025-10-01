# Map Layer Extensions Plan (2025-10-01)

## 概要
現在 UI から除外している以下のレイヤーを再導入するための調査・実装タスクを整理する。

- 夜間光 (night)
- 産業候補ポイント (potential)
- 行政区画 (admin)
- 筆界 (boundary)
- 差分の大きい地域 (diff)

## 1. スタイル資産の棚卸し
- `mapboxStyleURL` に設定しているスタイルに上記レイヤーID・ソースが存在するかを確認。
- 不足している場合は Mapbox Studio 等でレイヤーを追加する計画を立案。
- `src/map/constants.ts` の `customLayers` との整合チェック。必要なら ID を更新。

## 2. データソース要件の整理
- 各レイヤーに必要なデータソースの種別・ライセンス・更新頻度を調査。
- 外部API利用時のコスト・利用制限・取り扱うデータ形式 (vector tile / raster / GeoJSON etc.) をまとめる。
- 個人情報・位置情報の扱いに注意し、プライバシーポリシーへの影響を確認。

## 3. 実装方式の選定
- **スタイル組み込み案**: Mapbox Studio でレイヤー＋ソースを作成し、スタイルを再配布。
- **Runtime追加案**: クライアントでタイル/GeoJSON を読み込み動的に `map.addSource` / `map.addLayer` する。
- パフォーマンスやキャッシュ戦略を比較し、採用方式を決定。

## 4. UI/UX の拡張設計
- `isLayerAllowed` における公開レベル制御を整理 (例: 夜間光はフル公開のみ)。
- トグル表示条件とツールチップ文言を定義。
- レイヤー依存関係 (例: 行政区画ON時にのみ筆界表示) がある場合は仕様化。

## 5. 実装タスク草案
| タスク | 内容 | 依存 | 担当候補 |
| --- | --- | --- | --- |
| STYLE-01 | Mapbox スタイルに追加レイヤー/ソースを実装 | 調査完了 | Mapping Team |
| DATA-01 | 各レイヤーのデータソース契約とETL設計 | STYLE-01 並行 | Data Team |
| FE-01 | `customLayers` / `MapLayers` の拡張と `isLayerAllowed` 更新 | STYLE-01 | Frontend |
| FE-02 | UI トグル再追加＋ツールチップ実装 | FE-01 | Frontend |
| QA-01 | E2E/ビジュアルテストの更新 | FE-02 | QA |

## 6. アクションアイテム
1. STYLE-01 / DATA-01 の調査を 2025-10-03 までに実施し、結果をこのドキュメントへ追記。
2. 調査結果を踏まえて 2025-10-07 のプロダクト会議で方式決定。
3. 決定後、Jira に Epic (WHERE-LAYERS) を起票し、上記タスクを Story 化する。

## 参考リンク
- Mapbox Studio: https://studio.mapbox.com/
- Mapbox Vector Tiles Best Practices
- 社内データガバナンスポリシー (2025改訂版)
