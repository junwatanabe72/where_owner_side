全体

右サイドバー：上部にカテゴリタブ（売却／賃貸／一部売却／借地／その他）→ 下にサブタブ（一覧｜比較）。

一覧：提案カードに 主要KPI と ［＋比較］。下部の比較トレイ（最大3件）→「比較へ」。

比較：上部に前提条件バー（カテゴリ別）＋ 比較テーブル（列=提案、行=指標）＋目的別総合スコア。

借地タブ（定期・普通に対応）
一覧カード（例）

バッジ：借地（定期/普通）

年額地代（月額も表示）・期間（年）・改定ルール（例：3年ごと指数連動）

権利金/一時金・保証金（返還条件）

再帰属：更地返還／工作物帰属・買取条項の有無

参考：想定Cap（年額地代÷評価額）、根拠件数・鮮度

比較（指標）

前提バー

期間（評価 horizon：20/30/50年）・割引率・地代改定頻度/上限下限・CPI前提

再帰属：更地 or 工作物付・残存価値率

税・費用：地代に係る税、固定資産税負担、仲介/契約費

比較テーブル

NPV（地代CF + 一時金 + 期末残存） / IRR

年額地代・改定ルール（指数・見直し間隔）

一時金/保証金・返還条件

期間・再帰属条項（更地返還/工作物帰属）

想定Cap（参考）・リスク（相手先信用/長期拘束）

ビジュアル：年次キャッシュフロー（改定年を強調）＋満了時の残存価値を別色で表示。

その他タブ（用途別に小分類）

小分類ごとに標準KPIを定義し、同類同士で比較します。

駐車場（時間貸/月極）：区画数、稼働率、単価、年NOI、初期工事費、契約年数

広告塔/サイン：年賃料、契約期間、設置費/撤去費、視認性指数

太陽光/EV充電：年賃料or売電スキーム、CAPEX、契約年数、運営費、再エネインセンティブ

トランクルーム/簡易倉庫：賃料、稼働率、工事費、原状回復費、契約期間

短期イベント/仮設：日額/月額、設営・撤去費、稼働日数、近隣制約

前提バー（その他・共通）

期間、割引率、稼働率、運営費率、初期/撤去費、残存価値率

比較テーブル（その他・共通）

NPV/IRR/回収期間

年NOI・稼働率・単価

初期投資・撤去費・原状回復費

リスク（需要変動・法規制・近隣合意の難易度）

共通：指標の正規化（比較を成立させる芯）

全カテゴリで以下を算出して比較テーブルの上段に固定表示。

NPV（5/10/任意年）、IRR、回収期間、リスクスコア

目的別スコア（プリセット）：《現金化》《安定運用》《成長》で重み付けを変更

データモデル拡張（TypeScript）
type Base = {
  id: string; company: string; created_at: string;
  summary: string; attachments: string[]; confidence?: number; // 根拠スコア
};

type Sale = Base & {
  kind: "sale"; mode: "broker"|"principal"; price: number;
  costs?: { broker?: number; taxes?: number; others?: number };
  days_to_close?: number;
};

type Lease = Base & {
  kind: "lease"; monthly_rent: number; common_fee?: number;
  term_years: number; free_rent_m?: number; ti?: number;
  occupancy?: number; opex_ratio?: number;
};

type Exchange = Base & {
  kind: "exchange"; ratio: number; // 等価交換比率
  acquired_area_m2: number; completion_ym: string;
  post_strategy: "sell"|"lease"|"mix";
  assumed_rent_psm?: number; opex_ratio?: number;
};

type GroundLease = Base & {
  kind: "groundlease"; lease_type: "fixed"|"ordinary";
  annual_ground_rent: number;
  key_money?: number; deposit?: number;
  term_years: number;
  revision?: { every_years: number; index: "CPI"|"none"; cap?: number; floor?: number; };
  reversion: { mode: "vacant_land"|"structure_reversion"; residual_value_rate?: number };
  expense_rate?: number; // 固都税・管理等
};

type Other = Base & {
  kind: "other";
  subkind: "parking"|"signage"|"solar"|"ev"|"storage"|"event";
  capex?: number; opex_ratio?: number; term_years: number;
  unit?: { count?: number; price?: number }; // 区画×単価等
  occupancy?: number; revenue_year?: number; removal_cost?: number; residual_value_rate?: number;
};

type Normalized = {
  kind: Sale["kind"]|Lease["kind"]|Exchange["kind"]|GroundLease["kind"]|Other["kind"];
  npv5?: number; npv10?: number; irr?: number; payback?: number;
  net_proceeds?: number; // 売却の手取り
  noi?: number; cap?: number; risk?: number;
};


normalize(proposal, assumptions) で Normalized を生成し、比較表に統一表示します。

GroundLease：NPV = PV(年地代 + 一時金) − 税/費用 + PV(残存)

Other：NPV = PV(収入 − OPEX) − CAPEX − 撤去費 + PV(残存)

UIディテール

カテゴリタブの右に🔍フィルタ（小分類・期間・金額レンジ）/ ⚙ 前提プリセット

一覧カードは色分けバッジ（売却=赤/賃貸=紫/等価交換=青/借地=緑/その他=灰）

比較テーブルはカテゴリ固有行を自動出し分け（売却=手取り、借地=一時金/改定/再帰属、など）

エクスポート（任意）：比較表→PDF/CSV、前提条件も埋め込み

用語ミニ解説

借地（Ground Lease）：土地を長期に貸し、地代を得る契約。定期は満了で確実に終了、普通は更新前提。

権利金/一時金：借地設定時の受領金。返還しないことが多いが地域実務に依存。

再帰属：満了時に更地返還か、建物等を地主が引き取る（工作物帰属）かの取り決め。

NOI：Net Operating Income（運営純収益）。

NPV/IRR：将来収支の現在価値・実質利回り。
