# バグ修正サマリー

**修正日**: 2025-10-21
**重要度**: High (4件), Medium (1件)

## 修正完了項目

### 1. [High] calculateLeaseholdCondo の IRR 計算バグ

**問題**:
- `upfrontPremium`（一時金）をIRR計算で負の初期投資として誤って扱っていた
- `calculateIRR(annualCF, upfrontPremium)` で一時金をマイナスで減算
- 結果、プラスのキャッシュインでもIRRが極端に低く（または負）算出される

**修正内容**:
- 一時金を年0のキャッシュフローとして配列に追加
- IRR計算時の初期投資を0に変更
- `totalRevenue`の計算から`upfrontPremium`の二重加算を削除

**修正ファイル**:
- `src/utils/calc/leaseholdCondo.ts:27-67, 89-99`

**修正前**:
```typescript
let npv = upfrontPremium;
let cumulativeCF = upfrontPremium;
// ... CF計算 ...
const irr = calculateIRR(annualCF, upfrontPremium);
```

**修正後**:
```typescript
let npv = 0;
let cumulativeCF = 0;

// 年0: 一時金受領（プラスのキャッシュフロー）
if (upfrontPremium > 0) {
  cumulativeCF = upfrontPremium;
  annualCF.push({ year: 0, cf: upfrontPremium, cumulative: cumulativeCF });
  npv += upfrontPremium;
}
// ... CF計算 ...
const irr = calculateIRR(annualCF, 0);
```

---

### 2. [High] calculateMasterLease の terminalCost 二重計上バグ

**問題**:
- 期末原状回復費用を最終年のCFから減算（64行目）
- さらに`totalCost`に加算（109行目）
- 結果、コストが二重計上され、NPV等が著しく悪化

**修正内容**:
- `totalCost`の計算から`terminalCost`を削除
- CFに既に含まれているため、追加の加算は不要

**修正ファイル**:
- `src/utils/calc/masterLease.ts:99-110`

**修正前**:
```typescript
totalCost: annualCF.reduce((sum, cf) => sum + Math.max(0, -cf.cf), 0) + initialCapexOwner + terminalCost,
```

**修正後**:
```typescript
// terminalCostはannualCFの最終年に既に含まれているため、ここでは加算しない
totalCost: annualCF.reduce((sum, cf) => sum + Math.max(0, -cf.cf), 0) + initialCapexOwner,
```

---

### 3. [High] landSwap の ownerAcquisitionValue 負値バグ

**問題**:
- `ownerAcquisitionValue = Math.min(landValue, landBudget)` で、`landBudget`が負になる場合に負値になる
- その結果、面積・賃料・税も負になり、成立しない案件で謎の正味CFが出る

**修正内容**:
- `Math.max(0, Math.min(landValue, landBudget))` で下限を0に設定
- 不成立または`ownerAcquisitionValue=0`の場合はCFを0にする早期リターンを追加

**修正ファイル**:
- `src/utils/calc/landSwap.ts:49-95`

**修正前**:
```typescript
const ownerAcquisitionValue = Math.min(landValue, landBudget);
const ownerUnitArea = ownerAcquisitionValue / salesPricePerM2;

if (sellAfterAcquisition) {
  // ...
}
```

**修正後**:
```typescript
// オーナー取得建物価値（下限0で負値を防ぐ）
const ownerAcquisitionValue = Math.max(0, Math.min(landValue, landBudget));
const ownerUnitArea = ownerAcquisitionValue / salesPricePerM2;

// 不成立の場合はCFを0にする
if (!feasible || ownerAcquisitionValue === 0) {
  annualCF.push({ year: acquisitionYear, cf: 0, cumulative: 0 });
} else if (sellAfterAcquisition) {
  // ...
}
```

---

### 4. [High] Tailwind 動的クラス名の問題

**問題**:
- `bg-${scenarioColors[scenario]}` のような動的クラス名はビルド時に検出されない
- 結果、シナリオ別カラーのCSSが生成されず、色分けが失われる

**修正内容**:
- 静的なクラス名マッピングオブジェクトを使用
- `bg-purple-500`, `bg-orange-500`, `bg-green-500` などの完全なクラス名を記述

**修正ファイル**:
- `src/components/features/assetDetail/EvaluationTab.tsx:119-130, 186`
- `src/components/features/assetDetail/evaluation/SimulationResultCard.tsx:34-59`

**修正前**:
```typescript
const scenarioColors: Record<SimulationScenario, string> = {
  leaseholdCondo: 'simulation-leasehold',
  landSwap: 'simulation-landswap',
  masterLease: 'simulation-master',
};

<div className={`bg-${scenarioColors[scenario]} bg-opacity-10`}>
```

**修正後**:
```typescript
const scenarioBgOpacityColors: Record<SimulationScenario, string> = {
  leaseholdCondo: 'bg-purple-50',
  landSwap: 'bg-orange-50',
  masterLease: 'bg-green-50',
};

<div className={`${scenarioBgOpacityColors[scenario]}`}>
```

---

### 5. [Medium] CashFlowChart のゼロ除算バグ

**問題**:
- `range = max - min` が0の場合（均一データ）、yScaleでNaN座標が発生
- `barWidth = chartWidth / chartData.bars.length` で空配列の場合、Infinityになる

**修正内容**:
- `range`が0の場合は固定値（±100）を設定
- 空データの早期リターンを追加し、「データがありません」メッセージを表示
- `barWidth`のゼロ除算防止チェック追加

**修正ファイル**:
- `src/components/features/assetDetail/evaluation/CashFlowChart.tsx:17-80`

**修正前**:
```typescript
if (data.length === 0) return { bars: [], max: 0, min: 0, step: 1 };

const max = Math.max(...values, 0);
const min = Math.min(...values, 0);

return { bars: displayData, max, min, step: ... };
```

**修正後**:
```typescript
if (data.length === 0) return { bars: [], max: 0, min: 0, step: 1, isEmpty: true };

const max = Math.max(...values, 0);
const min = Math.min(...values, 0);

// rangeが0の場合は固定値を設定（全て同じ値の場合）
const safeMax = max === min ? (max > 0 ? max : 100) : max;
const safeMin = max === min ? (min < 0 ? min : -100) : min;

return { bars: displayData, max: safeMax, min: safeMin, step: ..., isEmpty: false };

// 早期リターン
if (chartData.isEmpty || chartData.bars.length === 0) {
  return <EmptyMessage />;
}
```

---

## ビルド結果

**ステータス**: ✅ 成功

```bash
npm run build
# Compiled with warnings (軽微な警告のみ)
# - no-loop-func: IRR計算のループ内関数宣言（問題なし）
```

すべてのHigh重要度バグを修正し、ビルドが正常に完了しました。

---

## 影響範囲

### 修正による改善

1. **IRR計算の正確性向上** - 一時金のあるシナリオで正しいIRRが算出される
2. **コスト計算の正確性向上** - 原状回復費用の二重計上が解消
3. **不成立案件の安全性向上** - 負値による計算破綻を防止
4. **UIの視覚的整合性向上** - シナリオ別カラーが正しく表示される
5. **グラフの安定性向上** - 極端なデータでもグラフが崩壊しない

### テスト推奨項目

1. **定期借地権マンション**
   - 一時金あり/なしのシミュレーション
   - IRRが正の値で算出されることを確認

2. **一括借上**
   - 期末原状回復費用ありのシミュレーション
   - NPVとtotalCostが正しく計算されることを確認

3. **等価交換**
   - 不成立案件（売却単価が低い場合）のシミュレーション
   - 負値が発生せず、CFが0になることを確認

4. **3シナリオ比較**
   - 紫・オレンジ・緑の色分けが正しく表示されることを確認

5. **キャッシュフローグラフ**
   - 均一データ（全て同じ値）でグラフが表示されることを確認
   - 空データで「データがありません」メッセージが表示されることを確認

---

## 追加改善（2025-10-21）

### 不成立案件の差額明示機能

**対象**: 等価交換シミュレーター

**実装内容**:
- 不成立案件のNPVに不足額（負の値）を反映
- 注記に具体的な改善案を追加
  - 不足額の金額と割合
  - 必要な売却単価の引き上げ額
  - 必要なコスト削減率

**修正ファイル**: `src/utils/calc/landSwap.ts:69-121`

**効果**:
```
Before: NPV=0、どう改善すればよいか不明
After:  NPV=-80百万円、売却単価を100千円/㎡引き上げ または コスト13.3%削減
```

詳細は `docs/improvement-infeasible-landswap.md` を参照。

---

## 今後の改善提案

### 単体テスト追加

```typescript
describe('calculateLeaseholdCondo', () => {
  it('should handle upfront premium correctly in IRR calculation', () => {
    const result = calculateLeaseholdCondo({
      landAreaM2: 100,
      landUnitPrice: 500000,
      leaseYears: 50,
      groundRentYield: 0.03,
      escalatorRate: 0.01,
      upfrontPremium: 10000000,
      discountRate: 0.03,
    });

    expect(result.irr).toBeGreaterThan(0);
    expect(result.annualCF[0].cf).toBe(10000000);
  });
});
```

### バリデーション強化

- 入力値の範囲チェック（負値の防止）
- GDV < totalCost の場合の警告表示
- IRR計算が収束しない場合のフォールバック

---

**修正担当**: Claude Code
**レビュー**: 完了
**次回アクション**: 単体テスト追加（フェーズ5）
