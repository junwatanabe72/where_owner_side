# Phase 1 テスト手順書

## テスト環境
- Node.js: v18以上
- React: v18
- TypeScript: v5

## テスト項目

### 1. ビルドテスト

#### 1.1 TypeScript型チェック
```bash
npm run typecheck
```
または
```bash
npx tsc --noEmit
```

**期待結果**: エラーなくコンパイルが成功すること

#### 1.2 開発サーバー起動テスト
```bash
npm run dev
```

**期待結果**: 
- 開発サーバーが正常に起動すること
- ブラウザでアプリケーションが表示されること
- コンソールエラーが発生しないこと

#### 1.3 プロダクションビルドテスト
```bash
npm run build
```

**期待結果**: エラーなくビルドが成功すること

### 2. 型定義の検証

#### 2.1 型定義のインポートテスト
App.tsxまたは任意のコンポーネントファイルで以下をテスト：

```typescript
import { Asset, Proposal, PrivacyLevel, MapMode } from './types';
```

**期待結果**: 
- インポートエラーが発生しないこと
- IDEで型の補完が効くこと

#### 2.2 型安全性のテスト
型定義を使用したコードで型エラーが検出されるか確認：

```typescript
// 正しい使用例（エラーなし）
const asset: Asset = {
  id: 1,
  address: "東京都...",
  lat: 35.6895,
  lng: 139.6917,
  area: 100,
  owner: "所有者",
  status: "利用中",
  memo: "メモ"
};

// 間違った使用例（型エラーが検出される）
const invalidAsset: Asset = {
  id: "1", // エラー: string型はnumber型に割り当て不可
  // 必須プロパティの欠落もエラーとなる
};
```

**期待結果**: 型エラーが適切に検出されること

### 3. ユーティリティ関数のテスト

#### 3.1 フォーマッター関数のテスト
コンソールまたはテストファイルで実行：

```typescript
import { formatCurrency, formatArea, formatDate } from './utils';

console.log(formatCurrency(100000000)); // ¥ 1.00億
console.log(formatCurrency(50000));      // ¥ 5万
console.log(formatCurrency(3000));       // ¥ 3000

console.log(formatArea(100)); // 100㎡（30.3坪）

console.log(formatDate('2025-09-03')); // 2025/9/3
```

**期待結果**: 各関数が正しくフォーマットされた文字列を返すこと

#### 3.2 バリデーター関数のテスト

```typescript
import { isLayerAllowed, validateAssetData } from './utils';

// レイヤー権限チェック
console.log(isLayerAllowed('youto', '最小公開'));  // true
console.log(isLayerAllowed('height', '最小公開')); // false
console.log(isLayerAllowed('height', 'フル公開')); // true

// 資産データ検証
const validAsset = {
  id: 1, address: "test", lat: 35, lng: 139, area: 100
};
console.log(validateAssetData(validAsset)); // true

const invalidAsset = { id: 1, address: "test" };
console.log(validateAssetData(invalidAsset)); // false
```

**期待結果**: 各バリデーション関数が正しい結果を返すこと

### 4. 統合テスト

#### 4.1 既存コードとの互換性
App.tsxで新しい型定義とユーティリティ関数を使用：

```typescript
import { formatCurrency, getDefaultMapLayers } from './utils';
import { PrivacyLevel, Asset } from './types';

// 既存のコードが正常に動作することを確認
```

**期待結果**: 
- 既存の機能が正常に動作すること
- 画面表示に問題がないこと

### 5. リグレッションテスト

#### 5.1 主要機能の動作確認
以下の機能が正常に動作することを確認：

- [ ] 地図の表示
- [ ] 資産リストの表示
- [ ] プライバシーレベルの切り替え
- [ ] レイヤーのトグル機能
- [ ] 資産詳細画面への遷移
- [ ] 提案情報の表示

**期待結果**: 全ての機能が正常に動作すること

## テスト実行コマンド一覧

```bash
# TypeScript型チェック
npm run typecheck || npx tsc --noEmit

# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# リンター実行（もし設定されている場合）
npm run lint
```

## トラブルシューティング

### よくあるエラーと対処法

#### 1. TypeScriptのコンパイルエラー
- 型定義ファイルのパスが正しいか確認
- tsconfig.jsonの設定を確認

#### 2. インポートエラー
- 相対パスが正しいか確認
- index.tsでのエクスポートが正しいか確認

#### 3. ビルドエラー
- node_modulesを削除して再インストール
  ```bash
  rm -rf node_modules
  npm install
  ```

## 合格基準

以下の条件を全て満たした場合、Phase 1のテストは合格とします：

1. TypeScript型チェックがエラーなく完了
2. 開発サーバーが正常に起動
3. プロダクションビルドが成功
4. 主要機能が全て正常に動作
5. コンソールにエラーが表示されない

## テスト完了後の作業

1. テスト結果を記録
2. 問題があった場合は修正を実施
3. 全てのテストが合格したらcommit & pushを実行