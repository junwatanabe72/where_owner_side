import { create } from "zustand";
import type { PrivacyLevel } from "../types";
import neighborParcelsByAsset from '../data/neighborParcels';
import type { NeighborParcel } from '../types/neighbor';

const EMPTY_NEIGHBOR_PARCELS: NeighborParcel[] = [];

export interface Asset {
  id: number;
  address: string;
  memo: string;
  area: number;
  owner: string;
  status: string;
  lat: number;
  lng: number;
  name?: string;
  zoning?: string;
  /** Visibility flag – mirrors the definition in src/types/asset.ts. */
  isPublic?: boolean;
  /** Per-asset sharing level. */
  privacyLevel?: PrivacyLevel;
  frontage?: number;
  depth?: number;
  roadAccess?: string;
  registrationDate?: string;
  landCategory?: string;
  valuationMin?: number;
  valuationMax?: number;
  valuationMedian?: number;
  confidenceScore?: string;
  pricePerSqm?: number;
  neighborhoodComparison?: number;
  lastUpdated?: string;
  coverageRatio?: number;
  floorAreaRatio?: number;
  nearestStation?: string;
  stationDistance?: number;
}

// New Proposal Types from detailUI.md
export type ProposalBase = {
  id: string;
  target: string; // Added to link to asset
  chiban: string; // 地番（登記上の土地番号）
  company: string;
  created_at: string;
  summary: string;
  attachments: string[];
  confidence?: number;
  details?: string;
  htmlContent?: string;
};

export type SaleProposal = ProposalBase & {
  kind: "sale";
  mode: "developer" | "principal";
  price: number;
  costs?: { broker?: number; taxes?: number; others?: number };
  days_to_close?: number;
};

export type LeaseProposal = ProposalBase & {
  kind: "lease";
  monthly_rent: number;
  common_fee?: number;
  term_years: number;
  free_rent_m?: number;
  ti?: number;
  occupancy?: number;
  opex_ratio?: number;
};

export type ExchangeProposal = ProposalBase & {
  kind: "exchange";
  ratio: number;
  acquired_area_m2: number;
  completion_ym: string;
  post_strategy: "sell" | "lease" | "mix";
  assumed_rent_psm?: number;
  opex_ratio?: number;
};

export type GroundLeaseProposal = ProposalBase & {
  kind: "groundlease";
  lease_type: "fixed" | "ordinary";
  annual_ground_rent: number;
  key_money?: number;
  deposit?: number;
  term_years: number;
  revision?: {
    every_years: number;
    index: "CPI" | "none";
    cap?: number;
    floor?: number;
  };
  reversion: {
    mode: "vacant_land" | "structure_reversion";
    residual_value_rate?: number;
  };
  expense_rate?: number;
};

export type OtherProposal = ProposalBase & {
  kind: "other";
  subkind: "parking" | "signage" | "solar" | "ev" | "storage" | "event";
  capex?: number;
  opex_ratio?: number;
  term_years: number;
  unit?: { count?: number; price?: number };
  occupancy?: number;
  revenue_year?: number;
  removal_cost?: number;
  residual_value_rate?: number;
};

export type Proposal =
  | SaleProposal
  | LeaseProposal
  | ExchangeProposal
  | GroundLeaseProposal
  | OtherProposal;

export interface RegistryAlert {
  id: string;
  parcel: string;
  change: string;
  date: string;
  note: string;
}

interface AssetStore {
  assets: Asset[];
  proposals: Proposal[];
  registryAlerts: RegistryAlert[];
  selectedAssetId: number | null;
  neighborParcels: Record<number, NeighborParcel[]>;
  neighborLoading: Record<number, boolean>;
  neighborError: Record<number, string | null>;
  setAssets: (assets: Asset[]) => void;
  setAssetPrivacyLevel: (assetId: number, level: PrivacyLevel) => void;
  setProposals: (proposals: Proposal[]) => void;
  setRegistryAlerts: (alerts: RegistryAlert[]) => void;
  setSelectedAssetId: (id: number | null) => void;
  getAssetById: (id: number) => Asset | undefined;
  getProposalsForAsset: (assetId: number) => Proposal[];
  getNeighborParcels: (assetId: number) => NeighborParcel[];
  getNeighborLoading: (assetId: number) => boolean;
  getNeighborError: (assetId: number) => string | null;
}

const shibuyahtml =`
    <!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>マンション用地 直接買取のご提案｜渋谷アセットデベロップメント</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root{
      --bg:#0c1220;
      --card:#0f162a;
      --panel:#121b33;
      --ink:#e9eef7;
      --muted:#9fb0c9;
      --accent:#3aa7ff;
      --accent-2:#65d6a6;
      --danger:#ff7a7a;
      --border:#223053;
      --shadow:0 18px 40px rgba(0,0,0,.35);
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0; background:
      radial-gradient(1200px 800px at 10% -10%, #172341 0%, transparent 60%),
      radial-gradient(800px 600px at 100% 0%, #0e1a34 0%, transparent 60%),
      linear-gradient(180deg, #0c1220 0%, #0a1222 100%);
      color:var(--ink);
      font-family: "Inter", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Meiryo", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif;
      line-height:1.6;
    }

    /* ---- Slide Deck ---- */
    .deck{
      counter-reset: slide;
      width:min(1280px, 95vw);
      margin:32px auto 64px;
    }
    .slide{
      counter-increment: slide;
      position: relative;
      width:100%;
      aspect-ratio:16/9;
      background: linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.0)), var(--card);
      border:1px solid var(--border);
      border-radius:18px;
      box-shadow: var(--shadow);
      padding:48px 56px;
      overflow:hidden;
      page-break-after: always; /* 印刷時：1スライド1ページ */
    }
    .slide:last-child{ page-break-after: auto; }

    .brand{
      display:flex; align-items:center; gap:12px;
      font-weight:700; letter-spacing:.2px;
    }
    .brand .mark{
      width:28px; height:28px; border-radius:8px;
      background: radial-gradient(120% 120% at 20% 10%, #78d7ff, #3aa7ff 55%, #2c5cff 100%);
      box-shadow:0 8px 16px rgba(58,167,255,.35), inset 0 0 1px rgba(255,255,255,.5);
    }
    .stamps{
      margin-left:auto; display:flex; gap:8px;
    }
    .stamp{
      padding:6px 10px; border:1px solid var(--border); border-radius:999px;
      font-size:12px; color:var(--muted); background:rgba(255,255,255,.02);
    }

    .title{
      margin:24px 0 8px; font-size:36px; line-height:1.25; font-weight:800;
      letter-spacing:.2px;
    }
    .subtitle{ color:var(--muted); font-size:16px; margin-bottom:18px;}
    .hero{
      display:flex; align-items:flex-end; justify-content:space-between; gap:24px; margin-top:8px;
      border-top:1px dashed #25365f; padding-top:18px;
    }
    .price{
      font-size:40px; font-weight:900; letter-spacing:.5px;
      background:linear-gradient(90deg, #86f7c7, #3aa7ff);
      -webkit-background-clip:text; background-clip:text; color:transparent;
    }
    .pill{
      display:inline-flex; align-items:center; gap:8px; padding:10px 14px; border-radius:12px;
      border:1px solid var(--border); background:var(--panel); color:var(--ink); font-weight:600;
    }
    .grid{
      display:grid; gap:16px; margin-top:20px;
      grid-template-columns: repeat(12, 1fr);
    }
    .card{
      background:linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.01));
      border:1px solid var(--border); border-radius:14px; padding:16px 18px;
      min-height:110px;
    }
    .card h3{ margin:0 0 6px; font-size:15px; color:#bcd0ea; letter-spacing:.3px; font-weight:700; }
    .kpis{ display:flex; gap:12px; flex-wrap:wrap; margin-top:6px;}
    .kpi{
      flex:1 1 160px; border:1px solid var(--border); border-radius:12px; padding:12px 14px;
      background:rgba(255,255,255,.02);
    }
    .kpi b{ font-size:20px; display:block; }
    .muted{ color:var(--muted); font-size:13px; }

    .list{ margin:6px 0 0 0; padding-left:18px; }
    .list li{ margin:6px 0; }

    .bar{
      height:10px; background:#1a2748; border-radius:999px; overflow:hidden; border:1px solid var(--border);
      margin-top:8px;
    }
    .bar > span{ display:block; height:100%; background: linear-gradient(90deg, var(--accent-2), var(--accent)); width:90%; }

    .timeline{ position:relative; margin-top:8px; }
    .timeline::before{
      content:""; position:absolute; left:8px; top:6px; bottom:6px; width:2px; background:#28406e; border-radius:2px;
    }
    .milestone{
      margin-left:28px; padding:8px 12px; border:1px solid var(--border); border-radius:12px; background:rgba(255,255,255,.02);
      position:relative; margin-bottom:10px;
    }
    .milestone::before{
      content:""; position:absolute; left:-22px; top:12px; width:10px; height:10px; border-radius:50%;
      background:linear-gradient(90deg, #86f7c7, #3aa7ff); box-shadow:0 0 0 3px #162443;
    }

    .rgrid{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .risk{ border:1px solid var(--border); border-radius:12px; padding:12px; background:rgba(255,255,255,.02); }
    .risk h4{ margin:0 0 6px; font-size:14px; }
    .risk p{ margin:0; font-size:13px; color:var(--muted); }

    .foot{
      position:absolute; right:16px; bottom:14px; display:flex; gap:12px; align-items:center; color:var(--muted); font-size:12px;
    }
    .pnum{ border:1px solid var(--border); padding:4px 8px; border-radius:8px; background:rgba(255,255,255,.02); }
    .pnum::after{ content: counter(slide); margin-left:4px; font-weight:700; color:#d6e4ff; }

    /* Print */
    @media print{
      body{ background:#fff; }
      .deck{ width:100%; margin:0; }
      .slide{
        border:none; border-radius:0; box-shadow:none; width:100%; height:100vh; padding:28mm 24mm;
        -webkit-print-color-adjust: exact; print-color-adjust: exact;
      }
      .foot{ position:fixed; bottom:10mm; right:24mm; }
    }
  </style>
</head>
<body>
  <div class="deck">

    <!-- 1. Cover -->
    <section class="slide">
      <div style="position:absolute; right:-120px; top:-120px; width:420px; height:420px; border-radius:50%;
                  background:radial-gradient(closest-side, rgba(101,214,166,.18), rgba(101,214,166,0)); filter:blur(6px);"></div>
      <div style="display:flex; align-items:center;">
        <div class="brand">
          <div class="mark" aria-hidden="true"></div>
          渋谷アセットデベロップメント
        </div>
        <div class="stamps">
          <span class="stamp">直接取引（デベロッパー自己勘定）</span>
          <span class="stamp">作成日 2025-08-20</span>
        </div>
      </div>

      <h1 class="title">マンション用地 直接買取のご提案</h1>
      <p class="subtitle">対象物件：東京都渋谷区宇田川町 31-2</p>

      <div class="hero">
        <div>
          <div class="pill">提示価格 <span class="price">¥240,000,000</span></div>
          <div class="kpis" style="margin-top:14px;">
            <div class="kpi"><span class="muted">クロージング目標</span><b>90日以内</b></div>
            <div class="kpi"><span class="muted">DD期間</span><b>30〜45日</b></div>
            <div class="kpi"><span class="muted">確度（当社評価）</span>
              <div class="bar"><span style="width:90%"></span></div>
            </div>
          </div>
        </div>
        <div class="card" style="min-width:360px; max-width:46%;">
          <h3>本提案の位置づけ</h3>
          <ul class="list">
            <li>当社による自己勘定での<strong>直接買取</strong>（仲介手数料 0円）</li>
            <li>用途想定：<strong>共同住宅（マンション用地）</strong></li>
            <li>最終条件は<strong>実測・境界確定／土壌・地中障害確認</strong>の結果で確定</li>
          </ul>
        </div>
      </div>

      <div class="foot">
        <span class="muted">Shibuya Asset Development</span>
        <span class="pnum">Page</span>
      </div>
    </section>

    <!-- 2. Deal Overview -->
    <section class="slide">
      <div class="brand"><div class="mark"></div>渋谷アセットデベロップメント</div>
      <h2 class="title" style="font-size:28px;">案件サマリー</h2>
      <div class="grid">
        <div class="card" style="grid-column: span 6;">
          <h3>対象概要</h3>
          <ul class="list">
            <li>所在地：東京都渋谷区宇田川町 31-2</li>
            <li>権利：所有権（現況・引渡条件は協議の上確定）</li>
            <li>想定用途：マンション用地（詳細計画は後述調査にて精査）</li>
          </ul>
        </div>
        <div class="card" style="grid-column: span 6;">
          <h3>経済条件（抜粋）</h3>
          <ul class="list">
            <li>提示価格：<strong>¥240,000,000</strong></li>
            <li>仲介手数料：<strong>0円（直接取引）</strong></li>
            <li>諸税・登記等概算：<strong>約 ¥1,200,000</strong></li>
          </ul>
        </div>
        <div class="card" style="grid-column: span 12;">
          <h3>前提条件</h3>
          <ul class="list">
            <li><strong>実測・境界確定</strong>、<strong>土壌汚染／地中障害の確認</strong>、法令調査（建築基準、都市計画 等）</li>
            <li>結果に応じた価格・条件の最終確定（必要に応じ調整条項を設定）</li>
            <li>測量・境界確定・税務は当社主導にて推進、発生実費は別途協議・精算</li>
          </ul>
        </div>
      </div>
      <div class="foot"><span class="muted">Deal Overview</span><span class="pnum">Page</span></div>
    </section>

    <!-- 3. Key Terms -->
    <section class="slide">
      <div class="brand"><div class="mark"></div>渋谷アセットデベロップメント</div>
      <h2 class="title" style="font-size:28px;">取引条件（Key Terms）</h2>
      <div class="grid">
        <div class="card" style="grid-column: span 7;">
          <h3>条件詳細</h3>
          <ul class="list">
            <li>取引形態：当社による<strong>自己勘定の直接買取</strong></li>
            <li>契約・決済：<strong>契約締結後 60〜90日</strong>で残代金決済（目標クロージング90日以内）</li>
            <li>デューデリジェンス（DD）：<strong>30〜45日</strong>（物件・法務・環境・技術）</li>
            <li>表明保証・付保：標準条項をベースに協議の上設定</li>
            <li>引渡状態：境界確定・占有状況等は協議のうえ確定</li>
          </ul>
        </div>
        <div class="card" style="grid-column: span 5;">
          <h3>確度（当社内部評価）</h3>
          <p class="muted" style="margin:0 0 6px;">調査前提が満たされることを条件とした成約確度</p>
          <div class="bar"><span style="width:90%"></span></div>
          <p class="muted" style="margin-top:8px;">確度は市場・法令・物件条件の変動により見直される場合があります。</p>
        </div>
        <div class="card" style="grid-column: span 12;">
          <h3>備考</h3>
          <ul class="list">
            <li>本資料は<strong>意向表明（Non-binding）</strong>であり、最終条件はDD結果・協議により確定します。</li>
            <li>スケジュール短縮（早期決済）や支払条件の個別調整もご相談可能です。</li>
          </ul>
        </div>
      </div>
      <div class="foot"><span class="muted">Key Terms</span><span class="pnum">Page</span></div>
    </section>

    <!-- 4. Schedule -->
    <section class="slide">
      <div class="brand"><div class="mark"></div>渋谷アセットデベロップメント</div>
      <h2 class="title" style="font-size:28px;">想定スケジュール（目安）</h2>
      <div class="grid">
        <div class="card" style="grid-column: span 7;">
          <h3>マイルストーン</h3>
          <div class="timeline">
            <div class="milestone"><b>基本合意（LOI）／情報開示</b><br><span class="muted">秘密保持・資料授受・現地確認のセットアップ</span></div>
            <div class="milestone"><b>デューデリジェンス（30〜45日）</b><br><span class="muted">法務・測量／境界・環境（土壌・地中障害）・建築計画性の確認</span></div>
            <div class="milestone"><b>条件最終化・売買契約</b><br><span class="muted">価格・条項の確定／表明保証・引渡条件の合意</span></div>
            <div class="milestone"><b>クロージング（契約後 60〜90日）</b><br><span class="muted">残代金決済・所有権移転・引渡し</span></div>
          </div>
        </div>
        <div class="card" style="grid-column: span 5;">
          <h3>短縮オプション（協議）</h3>
          <ul class="list">
            <li>先行調査の活用によりDDの一部短縮</li>
            <li>決済期日の前倒し（金融・登記体制を事前確保）</li>
            <li>条件成就付（停止条件）による契約の迅速化</li>
          </ul>
          <p class="muted">※ 短縮には前提条件の整備が必要です。</p>
        </div>
      </div>
      <div class="foot"><span class="muted">Schedule</span><span class="pnum">Page</span></div>
    </section>

    <!-- 5. Due Diligence Scope -->
    <section class="slide">
      <div class="brand"><div class="mark"></div>渋谷アセットデベロップメント</div>
      <h2 class="title" style="font-size:28px;">デューデリジェンス範囲（抜粋）</h2>
      <div class="grid">
        <div class="card" style="grid-column: span 6;">
          <h3>物件・法務</h3>
          <ul class="list">
            <li>権利関係（登記・契約・占有等）</li>
            <li>実測・境界確定（確定測量）</li>
            <li>都市計画・建築規制の適合性確認</li>
          </ul>
        </div>
        <div class="card" style="grid-column: span 6;">
          <h3>環境・技術</h3>
          <ul class="list">
            <li>土壌汚染・地中障害の有無（フェーズ調査等）</li>
            <li>インフラ引込・近隣協議の必要性</li>
            <li>設計与件（ボリュームスタディ前提条件）</li>
          </ul>
        </div>
        <div class="card" style="grid-column: span 12;">
          <h3>アウトプット</h3>
          <ul class="list">
            <li>調査レポート（法務・環境・測量・計画）</li>
            <li>最終条件（価格・条項）およびクロージング計画</li>
          </ul>
        </div>
      </div>
      <div class="foot"><span class="muted">Due Diligence</span><span class="pnum">Page</span></div>
    </section>

    <!-- 6. Risk & Mitigation / Next Steps -->
    <section class="slide">
      <div class="brand"><div class="mark"></div>渋谷アセットデベロップメント</div>
      <h2 class="title" style="font-size:28px;">リスクと対応方針／次のステップ</h2>
      <div class="grid">
        <div class="card" style="grid-column: span 7;">
          <h3>主要リスクと対応</h3>
          <div class="rgrid">
            <div class="risk">
              <h4>土壌・地中障害の発見</h4>
              <p>段階的調査・是正スキームの設定、価格調整条項の整備</p>
            </div>
            <div class="risk">
              <h4>境界未確定・越境</h4>
              <p>確定測量・是正工事の手順合意、引渡前条件の設定</p>
            </div>
            <div class="risk">
              <h4>法令・計画の不確実性</h4>
              <p>行政協議の前倒し・適法性確認、代替計画の検討</p>
            </div>
            <div class="risk">
              <h4>スケジュール遅延</h4>
              <p>クリティカルパス管理、代替日程とリソース確保</p>
            </div>
          </div>
        </div>
        <div class="card" style="grid-column: span 5;">
          <h3>次のステップ</h3>
          <ol class="list">
            <li>秘密保持の締結（NDA）</li>
            <li>基本合意（LOI）および資料一覧の確定</li>
            <li>DD着手（30〜45日）</li>
            <li>条件最終化・売買契約・決済</li>
          </ol>
          <p class="muted" style="margin-top:8px;">ご希望に応じて、スケジュール短縮や支払条件の個別調整も可能です。</p>
        </div>
      </div>
      <div class="foot"><span class="muted">Risk & Next Steps</span><span class="pnum">Page</span></div>
    </section>

  </div>
</body>
</html>
    `

const shibuyaleaseHtml = `
      <!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>リーシング＆バリューアップ提案｜三井不動産</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root{
      --bg:#0c1220;
      --card:#0f162a;
      --panel:#121b33;
      --ink:#e9eef7;
      --muted:#9fb0c9;
      --accent:#3aa7ff;
      --accent-2:#65d6a6;
      --danger:#ff7a7a;
      --border:#223053;
      --shadow:0 18px 40px rgba(0,0,0,.35);
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0; background:
      radial-gradient(1200px 800px at 10% -10%, #172341 0%, transparent 60%),
      radial-gradient(800px 600px at 100% 0%, #0e1a34 0%, transparent 60%),
      linear-gradient(180deg, #0c1220 0%, #0a1222 100%);
      color:var(--ink);
      font-family: "Inter", "Noto Sans JP", "Hiragino Kaku Gothic ProN", "Meiryo", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, "Helvetica Neue", Arial, sans-serif;
      line-height:1.6;
    }

    .deck{ counter-reset: slide; width:min(1280px, 95vw); margin:32px auto 64px; }
    .slide{
      counter-increment: slide;
      position: relative;
      width:100%;
      aspect-ratio:16/9;
      background: linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.0)), var(--card);
      border:1px solid var(--border);
      border-radius:18px;
      box-shadow: var(--shadow);
      padding:48px 56px;
      overflow:hidden;
      page-break-after: always;
    }
    .slide:last-child{ page-break-after: auto; }

    .brand{ display:flex; align-items:center; gap:12px; font-weight:700; letter-spacing:.2px; }
    .brand .mark{
      width:28px; height:28px; border-radius:8px;
      background: radial-gradient(120% 120% at 20% 10%, #78d7ff, #3aa7ff 55%, #2c5cff 100%);
      box-shadow:0 8px 16px rgba(58,167,255,.35), inset 0 0 1px rgba(255,255,255,.5);
    }
    .stamps{ margin-left:auto; display:flex; gap:8px; }
    .stamp{
      padding:6px 10px; border:1px solid var(--border); border-radius:999px;
      font-size:12px; color:var(--muted); background:rgba(255,255,255,.02);
    }

    .title{ margin:24px 0 8px; font-size:36px; line-height:1.25; font-weight:800; letter-spacing:.2px; }
    .subtitle{ color:var(--muted); font-size:16px; margin-bottom:18px; }
    .hero{ display:flex; align-items:flex-end; justify-content:space-between; gap:24px; margin-top:8px; border-top:1px dashed #25365f; padding-top:18px; }
    .price{ font-size:40px; font-weight:900; letter-spacing:.5px; background:linear-gradient(90deg, #86f7c7, #3aa7ff); -webkit-background-clip:text; background-clip:text; color:transparent; }
    .pill{ display:inline-flex; align-items:center; gap:8px; padding:10px 14px; border-radius:12px; border:1px solid var(--border); background:var(--panel); color:var(--ink); font-weight:600; }

    .grid{ display:grid; gap:16px; margin-top:20px; grid-template-columns: repeat(12, 1fr); }
    .card{
      background:linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.01));
      border:1px solid var(--border); border-radius:14px; padding:16px 18px; min-height:110px;
    }
    .card h3{ margin:0 0 6px; font-size:15px; color:#bcd0ea; letter-spacing:.3px; font-weight:700; }

    .kpis{ display:flex; gap:12px; flex-wrap:wrap; margin-top:6px; }
    .kpi{ flex:1 1 160px; border:1px solid var(--border); border-radius:12px; padding:12px 14px; background:rgba(255,255,255,.02); }
    .kpi b{ font-size:20px; display:block; }
    .muted{ color:var(--muted); font-size:13px; }

    .list{ margin:6px 0 0 0; padding-left:18px; }
    .list li{ margin:6px 0; }

    .bar{
      height:10px; background:#1a2748; border-radius:999px; overflow:hidden; border:1px solid var(--border); margin-top:8px;
    }
    .bar > span{ display:block; height:100%; background: linear-gradient(90deg, var(--accent-2), var(--accent)); width:90%; }

    .timeline{ position:relative; margin-top:8px; }
    .timeline::before{ content:""; position:absolute; left:8px; top:6px; bottom:6px; width:2px; background:#28406e; border-radius:2px; }
    .milestone{
      margin-left:28px; padding:8px 12px; border:1px solid var(--border); border-radius:12px; background:rgba(255,255,255,.02);
      position:relative; margin-bottom:10px;
    }
    .milestone::before{
      content:""; position:absolute; left:-22px; top:12px; width:10px; height:10px; border-radius:50%;
      background:linear-gradient(90deg, #86f7c7, #3aa7ff); box-shadow:0 0 0 3px #162443;
    }

    .two{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .risk{ border:1px solid var(--border); border-radius:12px; padding:12px; background:rgba(255,255,255,.02); }
    .risk h4{ margin:0 0 6px; font-size:14px; }
    .risk p{ margin:0; font-size:13px; color:var(--muted); }

    .foot{ position:absolute; right:16px; bottom:14px; display:flex; gap:12px; align-items:center; color:var(--muted); font-size:12px; }
    .pnum{ border:1px solid var(--border); padding:4px 8px; border-radius:8px; background:rgba(255,255,255,.02); }
    .pnum::after{ content: counter(slide); margin-left:4px; font-weight:700; color:#d6e4ff; }

    @media print{
      body{ background:#fff; }
      .deck{ width:100%; margin:0; }
      .slide{
        border:none; border-radius:0; box-shadow:none; width:100%; height:100vh; padding:28mm 24mm;
        -webkit-print-color-adjust: exact; print-color-adjust: exact;
      }
      .foot{ position:fixed; bottom:10mm; right:24mm; }
    }
  </style>
</head>
<body>
  <div class="deck">

    <!-- 1. Cover -->
    <section class="slide">
      <div style="position:absolute; right:-120px; top:-120px; width:420px; height:420px; border-radius:50%;
                  background:radial-gradient(closest-side, rgba(101,214,166,.18), rgba(101,214,166,0)); filter:blur(6px);"></div>
      <div style="display:flex; align-items:center;">
        <div class="brand"><div class="mark" aria-hidden="true"></div>三井不動産</div>
        <div class="stamps">
          <span class="stamp">デベロッパー主導・運営一体</span>
          <span class="stamp">作成日 2025-08-18</span>
        </div>
      </div>

      <h1 class="title">リーシング＆バリューアップ提案</h1>
      <p class="subtitle">対象物件：東京都渋谷区宇田川町 31-2</p>

      <div class="hero">
        <div>
          <div class="pill">想定月額賃料 <span class="price">¥1,800,000</span></div>
          <div class="kpis" style="margin-top:14px;">
            <div class="kpi"><span class="muted">契約形態</span><b>定期建物賃貸借 5年</b></div>
            <div class="kpi"><span class="muted">想定稼働率</span><b>95%</b><div class="bar"><span style="width:95%"></span></div></div>
            <div class="kpi"><span class="muted">運営費率（EGIベース）</span><b>15%</b><div class="bar"><span style="width:15%"></span></div></div>
          </div>
        </div>
        <div class="card" style="min-width:360px; max-width:46%;">
          <h3>本提案の位置づけ</h3>
          <ul class="list">
            <li>当社が<strong>企画・内装監修・リーシング</strong>を一体推進</li>
            <li><strong>マスターリース（当社一括借上げ）</strong>選択可：キャッシュフローの平準化に寄与</li>
            <li>ターゲット：IT・クリエイティブ・スタートアップ</li>
          </ul>
        </div>
      </div>

      <div class="foot"><span class="muted">Leasing Proposal</span><span class="pnum">Page</span></div>
    </section>

    <!-- 2. Deal Overview -->
    <section class="slide">
      <div class="brand"><div class="mark"></div>三井不動産</div>
      <h2 class="title" style="font-size:28px;">案件サマリー</h2>
      <div class="grid">
        <div class="card" style="grid-column: span 6;">
          <h3>対象概要</h3>
          <ul class="list">
            <li>所在地：東京都渋谷区宇田川町 31-2</li>
            <li>想定用途：オフィス（小規模分割可）／BTS対応可</li>
            <li>運営体制：当社AM/PM主導、リーシングは直営・提携ネットワーク併用</li>
          </ul>
        </div>
        <div class="card" style="grid-column: span 6;">
          <h3>賃貸条件（抜粋・案）</h3>
          <ul class="list">
            <li>想定月額賃料：<strong>¥1,800,000</strong></li>
            <li>契約期間：<strong>5年</strong>（定期建物賃貸借）</li>
            <li>原状回復・共益費等：別途協議（テナント仕様に応じて調整）</li>
          </ul>
        </div>
        <div class="card" style="grid-column: span 12;">
          <h3>添付資料</h3>
          <ul class="list">
            <li>賃料査定書.pdf</li>
            <li>テナント需要レポート.pdf</li>
          </ul>
        </div>
      </div>
      <div class="foot"><span class="muted">Deal Overview</span><span class="pnum">Page</span></div>
    </section>

    <!-- 3. Economics & Underwriting -->
    <section class="slide">
      <div class="brand"><div class="mark"></div>三井不動産</div>
      <h2 class="title" style="font-size:28px;">想定収益・アンダーライティング（概算）</h2>
      <div class="grid">
        <div class="card" style="grid-column: span 6;">
          <h3>前提</h3>
          <ul class="list">
            <li>月額賃料：¥1,800,000</li>
            <li>稼働率：95%</li>
            <li>運営費率（EGIベース）：15%</li>
          </ul>
          <div class="kpis">
            <div class="kpi"><span class="muted">GPR（年）</span><b>¥21,600,000</b><span class="muted">= 1,800,000 × 12</span></div>
            <div class="kpi"><span class="muted">EGI（年）</span><b>¥20,520,000</b><span class="muted">= GPR × 95%</span></div>
            <div class="kpi"><span class="muted">NOI（年）</span><b>¥17,442,000</b><span class="muted">= EGI × 85%</span></div>
          </div>
        </div>
        <div class="card" style="grid-column: span 6;">
          <h3>月次イメージ</h3>
          <ul class="list">
            <li>NOI（月）<strong>¥1,453,500</strong>（= 17,442,000 ÷ 12）</li>
            <li>マスターリース選択時は保証賃料等の条件協議により水準確定</li>
          </ul>
          <h3 style="margin-top:10px;">感応度（Occupancy ±5%）</h3>
          <ul class="list">
            <li>90%：NOI <strong>¥16,524,000/年</strong></li>
            <li>100%：NOI <strong>¥18,360,000/年</strong></li>
          </ul>
        </div>
        <div class="card" style="grid-column: span 12;">
          <h3>注記</h3>
          <p class="muted">上記は概算の試算値であり、最終条件・仕様・工事範囲・共益費按分等により変動します。</p>
        </div>
      </div>
      <div class="foot"><span class="muted">Economics</span><span class="pnum">Page</span></div>
    </section>

    <!-- 4. Leasing Strategy -->
    <section class="slide">
      <div class="brand"><div class="mark"></div>三井不動産</div>
      <h2 class="title" style="font-size:28px;">リーシング戦略／ターゲット</h2>
      <div class="grid">
        <div class="card" style="grid-column: span 6;">
          <h3>ターゲットセグメント</h3>
          <ul class="list">
            <li>IT・SaaS・ゲーム・クリエイティブ</li>
            <li>資金調達後のスタートアップ（20〜80名規模）</li>
            <li>SNS/コミュニティ露出が高いクリエイター系企業</li>
          </ul>
        </div>
        <div class="card" style="grid-column: span 6;">
          <h3>差別化ポイント</h3>
          <ul class="list">
            <li>BTS（Build-to-Suit）対応／拡張余地の設計</li>
            <li>内装監修による<strong>入居即戦力仕様</strong>（会議室比率・防音・配線）</li>
            <li>ウェルビーイング観点の共用部計画（ラウンジ等）</li>
          </ul>
        </div>
        <div class="card" style="grid-column: span 12;">
          <h3>KPI（初期12か月）</h3>
          <div class="kpis">
            <div class="kpi"><span class="muted">内見コンバージョン</span><b>30% 目標</b></div>
            <div class="kpi"><span class="muted">平均成約期間</span><b>60日 以内</b></div>
            <div class="kpi"><span class="muted">成約平均坪単価</span><b>査定レンジ内維持</b></div>
          </div>
          <p class="muted" style="margin-top:8px;">KPIはマーケット状況に応じて四半期ごとに見直します。</p>
        </div>
      </div>
      <div class="foot"><span class="muted">Leasing Strategy</span><span class="pnum">Page</span></div>
    </section>

    <!-- 5. Schedule -->
    <section class="slide">
      <div class="brand"><div class="mark"></div>三井不動産</div>
      <h2 class="title" style="font-size:28px;">想定スケジュール（目安）</h2>
      <div class="grid">
        <div class="card" style="grid-column: span 7;">
          <h3>マイルストーン</h3>
          <div class="timeline">
            <div class="milestone"><b>基本合意（LOI）／要件整理</b><br><span class="muted">賃貸条件・仕様方針の確定、NDA締結</span></div>
            <div class="milestone"><b>設計・内装監修／BTS調整</b><br><span class="muted">ゾーニング・ボリューム・什器計画の確定</span></div>
            <div class="milestone"><b>リーシング着手</b><br><span class="muted">ターゲット先行打診・先行申込の獲得</span></div>
            <div class="milestone"><b>成約・引渡し</b><br><span class="muted">契約・工事・入居の順次実行</span></div>
          </div>
        </div>
        <div class="card" style="grid-column: span 5;">
          <h3>マスターリース（選択可）</h3>
          <ul class="list">
            <li>当社が一括借上げし、サブリース運用</li>
            <li>賃料の平準化・空室リスクの低減に寄与</li>
            <li>保証賃料・期間・原状回復等は個別協議</li>
          </ul>
        </div>
      </div>
      <div class="foot"><span class="muted">Schedule</span><span class="pnum">Page</span></div>
    </section>

    <!-- 6. Risks & Next Steps -->
    <section class="slide">
      <div class="brand"><div class="mark"></div>三井不動産</div>
      <h2 class="title" style="font-size:28px;">リスクと対応方針／次のステップ</h2>
      <div class="grid">
        <div class="card" style="grid-column: span 7;">
          <h3>主要リスクと対応</h3>
          <div class="two">
            <div class="risk">
              <h4>需給変動（賃料ソフト化）</h4>
              <p>フロア分割・フレキシブル条項・フリーレントの最適化で稼働率を確保</p>
            </div>
            <div class="risk">
              <h4>内装コスト超過</h4>
              <p>仕様のバリューマネジメント・固定価格契約・VE案の併走</p>
            </div>
            <div class="risk">
              <h4>入居遅延</h4>
              <p>先行内見・先行契約の活用、クリティカルパスの事前管理</p>
            </div>
            <div class="risk">
              <h4>解約リスク</h4>
              <p>中途解約条項の設計・保証金設定・テナント審査の厳格化</p>
            </div>
          </div>
        </div>
        <div class="card" style="grid-column: span 5;">
          <h3>次のステップ</h3>
          <ol class="list">
            <li>NDA締結・資料共有（査定書・需要レポート等）</li>
            <li>LOI合意・条項ドラフト作成</li>
            <li>リーシング・内装計画の詳細化</li>
            <li>契約締結・工事手配・入居開始</li>
          </ol>
          <p class="muted" style="margin-top:8px;">本資料は意向表明であり、最終条件は協議のうえ確定します。</p>
        </div>
      </div>
      <div class="foot"><span class="muted">Risk & Next Steps</span><span class="pnum">Page</span></div>
    </section>

  </div>
</body>
</html>
    `
const taishidoHtml =`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>太子堂プレイスメイキングプログラム｜世田谷アーバンデベロップメント</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body{margin:0;padding:0;font-family:"Inter","Hiragino Sans","Noto Sans JP",sans-serif;background:#0b111c;color:#f5f7fb;line-height:1.6;}
    .deck{counter-reset:slide;width:min(1200px,94vw);margin:32px auto;}
    .slide{counter-increment:slide;position:relative;width:100%;aspect-ratio:16/9;background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(5,12,21,.9)),url('https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1920&q=80');background-size:cover;background-position:center;border-radius:22px;overflow:hidden;box-shadow:0 30px 60px rgba(0,0,0,.4);margin-bottom:32px;padding:48px 56px;}
    .slide::after{content:counter(slide);position:absolute;bottom:24px;right:32px;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#9fb6ff;}
    .overlay{position:absolute;inset:0;background:linear-gradient(120deg,rgba(8,13,26,.88),rgba(8,13,26,.35));}
    .content{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;justify-content:space-between;}
    h1,h2,h3{margin:0;font-weight:800;letter-spacing:.2px;}
    h1{font-size:48px;line-height:1.2;}
    h2{font-size:26px;margin-bottom:16px;border-left:5px solid #61d6b2;padding-left:14px;}
    h3{font-size:18px;margin:18px 0 10px;}
    p,li{font-size:16px;color:#d5deff;}
    .meta{display:flex;flex-wrap:wrap;gap:12px;font-size:13px;color:#a9b9ff;}
    .pill{padding:6px 12px;background:rgba(97,214,178,.18);border:1px solid rgba(97,214,178,.35);border-radius:999px;color:#74f1ca;font-weight:600;font-size:13px;}
    .grid{display:grid;gap:18px;margin-top:20px;}
    .grid.two{grid-template-columns:repeat(12,1fr);}
    .card{backdrop-filter:blur(14px);background:rgba(8,17,34,.76);border:1px solid rgba(116,184,255,.18);border-radius:18px;padding:18px 22px;box-shadow:0 12px 32px rgba(0,0,0,.25);}
    .timeline{position:relative;padding-left:26px;margin-top:12px;}
    .timeline::before{content:"";position:absolute;left:10px;top:4px;bottom:4px;width:2px;background:linear-gradient(180deg,rgba(111,141,255,.9),rgba(97,214,178,.4));}
    .milestone{position:relative;margin-bottom:18px;padding-left:14px;}
    .milestone::before{content:"";position:absolute;left:-22px;top:6px;width:12px;height:12px;border-radius:50%;background:#6f8dff;box-shadow:0 0 0 5px rgba(111,141,255,.25);}
    ul{margin:0;padding-left:20px;}
    .footer{display:flex;justify-content:space-between;align-items:center;margin-top:24px;font-size:13px;color:#8ca2ff;}
  </style>
</head>
<body>
  <div class="deck">
    <section class="slide">
      <div class="overlay"></div>
      <div class="content">
        <div>
          <div class="meta">
            <span class="pill">暫定利用プログラム（12か月）</span>
            <span>作成日 2025-08-15</span>
            <span>所在地：東京都世田谷区太子堂4丁目1-1</span>
          </div>
          <h1>太子堂コミュニティプレイス<br>活性化プログラム</h1>
          <p style="margin-top:14px;max-width:70%;font-size:18px;">「開発待ち」の空き地を、地域の熱量とブランド価値を高める“都市の余白”へ。1年間のプレイスメイキングで、将来の賃料水準を底上げしながら収益も確保します。</p>
        </div>
        <div class="footer">
          <span>Setagaya Urban Development</span>
          <span>世田谷アーバンデベロップメント株式会社</span>
        </div>
      </div>
    </section>

    <section class="slide">
      <div class="overlay"></div>
      <div class="content">
        <div>
          <h2>1. プログラム全体像</h2>
          <div class="grid two">
            <div class="card" style="grid-column:span 7;">
              <h3>年間ロードマップ</h3>
              <div class="timeline">
                <div class="milestone"><strong>Phase1｜0-2か月</strong><br>準備期間：近隣合意・NDA・安全計画、SNSティザー開始</div>
                <div class="milestone"><strong>Phase2｜3-8か月</strong><br>集客期：毎週末のマーケット、月1回のアートイベント、地元コラボ</div>
                <div class="milestone"><strong>Phase3｜9-12か月</strong><br>価値顕在化：ポップアップモデルハウス、将来賃貸のテナント先行募集</div>
              </div>
            </div>
            <div class="card" style="grid-column:span 5;">
              <h3>KPI（年次目標）</h3>
              <ul>
                <li>来場者数：年間 48,000人（平均週末1,000人）</li>
                <li>SNS露出：ハッシュタグ投稿 8,000件以上</li>
                <li>周辺テナント売上：平均 +12%</li>
                <li>将来テナント候補：20社リスト化</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer">
          <span>Program Overview</span>
          <span>暫定利用で“場”を育て、ブランドを醸成</span>
        </div>
      </div>
    </section>

    <section class="slide">
      <div class="overlay"></div>
      <div class="content">
        <div>
          <h2>2. 収支シミュレーション（年間）</h2>
          <div class="grid two">
            <div class="card" style="grid-column:span 6;">
              <h3>収益想定</h3>
              <ul>
                <li>イベント利用料・スペースレンタル：<strong>280万円</strong></li>
                <li>スポンサー・ブランドタイアップ：<strong>150万円</strong></li>
                <li>フードトラック・物販手数料：<strong>70万円</strong></li>
                <li><strong>合計収益：500万円</strong></li>
              </ul>
            </div>
            <div class="card" style="grid-column:span 6;">
              <h3>コスト内訳</h3>
              <ul>
                <li>初期投資（照明・仮設電源・床整備）：<strong>120万円</strong></li>
                <li>運営・警備・清掃：<strong>150万円</strong></li>
                <li>コンテンツ制作・PR：<strong>80万円</strong></li>
                <li>その他（保険等）：<strong>40万円</strong></li>
                <li><strong>年間コスト：390万円</strong></li>
              </ul>
            </div>
            <div class="card" style="grid-column:span 12;display:flex;gap:24px;align-items:center;">
              <div>
                <h3>年間キャッシュフロー</h3>
                <p style="font-size:32px;font-weight:800;color:#74f1ca;">+110万円</p>
              </div>
              <p style="max-width:60%;">収益だけでなく、来街者データ／SNS投稿／アンケート情報を蓄積し、将来のリーシング・収益化施策につなげます。</p>
            </div>
          </div>
        </div>
        <div class="footer">
          <span>Financials</span>
          <span>初動投資を抑えつつブランド価値を創出</span>
        </div>
      </div>
    </section>

    <section class="slide">
      <div class="overlay"></div>
      <div class="content">
        <div>
          <h2>3. ランドスケープ &amp; プログラム例</h2>
          <div class="grid two">
            <div class="card" style="grid-column:span 5;">
              <h3>ゾーニング提案</h3>
              <ul>
                <li>エントランス：LEDサイン＋フォトスポット</li>
                <li>中央スペース：可動式マーケットブース（雨天対応テント）</li>
                <li>奥側：アートウォールとナイトライティング</li>
                <li>周辺：キッチンカー回遊導線／植栽演出</li>
              </ul>
            </div>
            <div class="card" style="grid-column:span 7;">
              <h3>月別テーマ例</h3>
              <ul>
                <li>4月：ローカルクラフト＆花マーケット</li>
                <li>6月：ナイトシネマ × クラフトビール</li>
                <li>8月：こども創造ワークショップ</li>
                <li>11月：サステナブルブランドフェア</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer">
          <span>Plac©emaking</span>
          <span>昼夜・平日週末で表情を変える“街のステージ”に</span>
        </div>
      </div>
    </section>

    <section class="slide">
      <div class="overlay"></div>
      <div class="content">
        <div>
          <h2>4. リスクとガバナンス</h2>
          <div class="grid two">
            <div class="card" style="grid-column:span 6;">
              <h3>主要リスク</h3>
              <ul>
                <li>近隣騒音・動線混雑 → 開催時間帯・入場制限・警備動線で制御</li>
                <li>雨天中止による収入変動 → 屋根付きスペース＆デジタル配信に切替</li>
                <li>安全管理 → イベント保険加入／警備員常駐／設備点検</li>
              </ul>
            </div>
            <div class="card" style="grid-column:span 6;">
              <h3>データ取得と可視化</h3>
              <ul>
                <li>来場者カウント（AIカメラ）・滞在時間ヒートマップ</li>
                <li>アンケート・SNS投稿の自動収集ダッシュボード</li>
                <li>周辺店舗とのPOS連携（任意）で経済効果を定量化</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer">
          <span>Risk &amp; Governance</span>
          <span>安全・安心とデータ取得を両立</span>
        </div>
      </div>
    </section>

    <section class="slide">
      <div class="overlay"></div>
      <div class="content">
        <div>
          <h2>5. 次のステップ</h2>
          <div class="grid two">
            <div class="card" style="grid-column:span 7;">
              <h3>初期アクション</h3>
              <ol style="margin:0;padding-left:20px;color:#d5deff;">
                <li>基本合意（NDA・暫定使用契約）</li>
                <li>安全計画・近隣説明会・行政調整</li>
                <li>初回シグネチャイベントの企画決定・集客開始</li>
              </ol>
            </div>
            <div class="card" style="grid-column:span 5;">
              <h3>地主様メリット</h3>
              <ul>
                <li>遊休期間の収益化＆ブランド向上</li>
                <li>将来開発の期待値向上（来街者増→賃料水準底上げ）</li>
                <li>近隣との共創による信頼醸成・行政評価の向上</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer">
          <span>Next Steps</span>
          <span>地域と共に“開発前夜の熱量”を創り出す12か月</span>
        </div>
      </div>
    </section>
  </div>
</body>
</html>

`
const taishidoSyakuchiHtml =`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>太子堂事業用定期借地プロジェクト｜野村不動産</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body{margin:0;background:#070d1a;color:#eef3ff;font-family:"Inter","Noto Sans JP",sans-serif;line-height:1.6;}
    .deck{counter-reset:slide;width:min(1200px,95vw);margin:40px auto;}
    .slide{counter-increment:slide;position:relative;width:100%;aspect-ratio:16/9;border-radius:20px;overflow:hidden;background:#0d1528;padding:44px 52px;box-shadow:0 30px 70px rgba(0,0,0,.45);margin-bottom:28px;}
    .slide::after{content:counter(slide);position:absolute;bottom:22px;right:28px;width:34px;height:34px;border-radius:50%;background:rgba(97,214,178,.18);border:1px solid rgba(97,214,178,.4);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#6ddccf;}
    header{display:flex;justify-content:space-between;align-items:flex-start;gap:24px;margin-bottom:24px;}
    .brand{font-weight:700;letter-spacing:.2px;display:flex;align-items:center;gap:10px;font-size:18px;color:#9fb6ff;}
    .brand::before{content:"";display:block;width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#6ddccf,#4a9dff);box-shadow:0 12px 28px rgba(77,161,252,.35);}
    h1 {margin:0;font-size:42px;font-weight:800;color:#ffffff;}
    h2 {margin:16px 0;font-size:26px;font-weight:700;color:#c6d7ff;border-left:4px solid #6ddccf;padding-left:14px;}
    h3 {margin:14px 0;font-size:18px;font-weight:700;color:#85a0ff;}
    p,li {font-size:16px;color:#d6e1ff;}
    .pill{display:inline-flex;align-items:center;padding:6px 14px;border-radius:14px;background:rgba(77,161,252,.15);border:1px solid rgba(77,161,252,.3);color:#8cbfff;font-size:13px;font-weight:600;margin-right:10px;}
    .grid{display:grid;gap:18px;margin-top:16px;}
    .grid.cols-12{grid-template-columns:repeat(12,1fr);}
    .card{background:linear-gradient(180deg,rgba(21,32,58,.85),rgba(13,21,40,.85));border:1px solid rgba(135,172,255,.2);border-radius:16px;padding:18px 20px;backdrop-filter:blur(12px);}
    .timeline{position:relative;padding-left:24px;margin-top:16px;}
    .timeline::before{content:"";position:absolute;left:8px;top:6px;bottom:6px;width:2px;background:linear-gradient(180deg,#6ddccf,#4a9dff);} 
    .milestone{position:relative;margin-bottom:18px;padding-left:12px;}
    .milestone::before{content:"";position:absolute;left:-22px;top:6px;width:10px;height:10px;border-radius:50%;background:#4a9dff;box-shadow:0 0 0 5px rgba(74,157,255,.2);}
    ul{margin:0;padding-left:18px;}
    table{width:100%;border-collapse:collapse;margin-top:10px;}
    th,td{padding:10px 12px;border-bottom:1px solid rgba(135,172,255,.18);text-align:left;font-size:15px;}
    th{color:#8cbfff;font-weight:600;}
    .footer{margin-top:24px;display:flex;justify-content:space-between;font-size:13px;color:#8cbfff;}
  </style>
</head>
<body>
  <div class="deck">
    <section class="slide">
      <header>
        <div>
          <div class="brand">野村不動産</div>
          <div style="margin-top:10px;">
            <span class="pill">事業用定期借地／50年</span>
            <span class="pill">契約一時金 2,000万円</span>
            <span class="pill">年間地代 800万円</span>
          </div>
        </div>
        <div style="text-align:right;color:#8cbfff;font-size:14px;">
          作成日 2025-08-12<br>
          対象地：東京都世田谷区太子堂4丁目1-1
        </div>
      </header>
      <h1>太子堂事業用定期借地プロジェクト提案</h1>
      <p style="margin-top:20px;font-size:18px;max-width:70%;">都市型複合施設（延床 9,800㎡）を開発し、期間中は安定収益を確保。契約満了後は更地返還で地主様の資産価値を完全に取り戻せるスキームをご提案します。</p>
      <div class="footer">
        <span>Nomura Real Estate Development</span>
        <span>Confidential Proposal</span>
      </div>
    </section>

    <section class="slide">
      <header>
        <div class="brand">野村不動産</div>
        <span class="pill">Project Overview</span>
      </header>
      <h2>1. プロジェクト概要</h2>
      <div class="grid cols-12">
        <div class="card" style="grid-column:span 6;">
          <h3>開発コンセプト</h3>
          <ul>
            <li>低層：コミュニティ型商業（カフェ・イベントスペース）</li>
            <li>中層：クリエイティブオフィス／サービスアパートメント</li>
            <li>屋上：地域開放型スカイガーデン（防災拠点兼用）</li>
          </ul>
        </div>
        <div class="card" style="grid-column:span 6;">
          <h3>スキーム</h3>
          <ul>
            <li>地主様：土地所有を維持しつつ地代収入を確保</li>
            <li>当社SPC：建設資金・施設運営・修繕を全て負担</li>
            <li>満了時：更地返還（附属建物は撤去）、更新協議も可能</li>
          </ul>
        </div>
      </div>
      <div class="footer">
        <span>Project Summary</span>
        <span>資産保全＆安定運用を両立する50年スキーム</span>
      </div>
    </section>

    <section class="slide">
      <header>
        <div class="brand">野村不動産</div>
        <span class="pill">Financials</span>
      </header>
      <h2>2. 収益シミュレーション（抜粋）</h2>
      <div class="grid cols-12">
        <div class="card" style="grid-column:span 6;">
          <h3>地代条件</h3>
          <table>
            <tbody>
              <tr><th>年間地代</th><td>8,000,000円（消費税別途）</td></tr>
              <tr><th>一時金</th><td>20,000,000円（契約締結時）</td></tr>
              <tr><th>地代改定</th><td>10年毎（CPI＋近隣地価を勘案）</td></tr>
              <tr><th>保証</th><td>連帯保証＋敷金相当保証金（年間地代の3か月分）</td></tr>
            </tbody>
          </table>
        </div>
        <div class="card" style="grid-column:span 6;">
          <h3>地主様キャッシュフロー（概算）</h3>
          <ul>
            <li>初年度現金収入：<strong>28,000,000円</strong>（地代＋一時金）</li>
            <li>平常年：<strong>8,000,000円</strong>（改定幅により増額）</li>
            <li>契約満了時：<strong>更地返還／設備撤去済み</strong></li>
          </ul>
        </div>
        <div class="card" style="grid-column:span 12;display:flex;gap:24px;align-items:center;">
          <div>
            <h3>長期安定性</h3>
            <p>当社責任で建物維持管理を行い、修繕リスク・入居者リスクを地主様から切り離します。賃料改定時には市場データ・CPI指標を用いた透明な協議を実施。</p>
          </div>
        </div>
      </div>
      <div class="footer">
        <span>Stable Income</span>
        <span>収益の平準化と資産価値維持を両立</span>
      </div>
    </section>

    <section class="slide">
      <header>
        <div class="brand">野村不動産</div>
        <span class="pill">Timeline &amp; Governance</span>
      </header>
      <h2>3. スケジュール＆ガバナンス</h2>
      <div class="grid cols-12">
        <div class="card" style="grid-column:span 7;">
          <h3>想定スケジュール</h3>
          <div class="timeline">
            <div class="milestone"><strong>2026年 Q1</strong> 事業用定期借地契約締結／一時金受領</div>
            <div class="milestone"><strong>2026年 Q2-Q4</strong> 設計・行政協議・テナントプリマーケティング</div>
            <div class="milestone"><strong>2027年 Q1</strong> 着工（建築期間：約18か月）</div>
            <div class="milestone"><strong>2028年 Q3</strong> 竣工・引渡し／地代開始</div>
          </div>
        </div>
        <div class="card" style="grid-column:span 5;">
          <h3>リスクマネジメント</h3>
          <ul>
            <li>施工リスク：実績豊富なゼネコンと早期VEでコスト統制</li>
            <li>リーシングリスク：アンカー企業仮契約＋用途複合化で分散</li>
            <li>地代滞納リスク：保証会社＋銀行保証状で対策</li>
          </ul>
        </div>
      </div>
      <div class="footer">
        <span>Governance</span>
        <span>透明性の高い管理体制でリスクを最小化</span>
      </div>
    </section>

    <section class="slide">
      <header>
        <div class="brand">野村不動産</div>
        <span class="pill">Next Steps</span>
      </header>
      <h2>4. 次のステップとお願い</h2>
      <div class="grid cols-12">
        <div class="card" style="grid-column:span 7;">
          <h3>地主様にお願いしたい事項</h3>
          <ol style="margin:0;padding-left:20px;color:#d6e1ff;">
            <li>秘密保持契約（NDA）締結</li>
            <li>土地測量図・登記資料の共有</li>
            <li>契約条件（地代改定方式・敷金等）の詳細協議</li>
          </ol>
        </div>
        <div class="card" style="grid-column:span 5;">
          <h3>ご提供価値</h3>
          <ul>
            <li>50年の安定収益と資産の完全返還</li>
            <li>地域貢献型のランドマーク開発でブランド価値向上</li>
            <li>運営・修繕・テナント対応は当社で一元管理</li>
          </ul>
        </div>
      </div>
      <div class="footer">
        <span>Thank you for your consideration</span>
        <span>私たちと共に、太子堂の未来をデザインしましょう。</span>
      </div>
    </section>
  </div>
</body>
</html>

`

const marunouchiHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>等価交換建替えのご提案｜丸の内デベロップメント</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root{
      --bg:#050910;
      --card:#0f1528;
      --panel:#101a33;
      --ink:#f4f6fb;
      --muted:#94a5c7;
      --accent:#f89b3a;
      --accent-2:#49d2ff;
      --danger:#ff7a7a;
      --border:#1d2c4e;
      --shadow:0 18px 40px rgba(5,9,16,.45);
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      background:
        radial-gradient(1200px 800px at 5% -10%, rgba(73,210,255,.18) 0%, transparent 60%),
        radial-gradient(900px 900px at 100% 0%, rgba(248,155,58,.18) 0%, transparent 65%),
        linear-gradient(180deg, #050910 0%, #040712 100%);
      color:var(--ink);
      font-family:"Inter","Noto Sans JP","Hiragino Kaku Gothic ProN","Meiryo",system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",Arial,sans-serif;
      line-height:1.65;
    }
    .deck{counter-reset:slide;width:min(1280px,95vw);margin:32px auto 64px;}
    .slide{
      counter-increment:slide;
      position:relative;
      width:100%;
      aspect-ratio:16/9;
      background:linear-gradient(180deg,rgba(255,255,255,.02),rgba(255,255,255,.0)),var(--card);
      border:1px solid var(--border);
      border-radius:18px;
      box-shadow:var(--shadow);
      padding:48px 56px;
      overflow:hidden;
      page-break-after:always;
    }
    .slide:last-child{page-break-after:auto;}
    .brand{display:flex;align-items:center;gap:12px;font-weight:700;letter-spacing:.2px;font-size:18px;}
    .brand .mark{
      width:28px;height:28px;border-radius:8px;
      background:radial-gradient(120% 120% at 20% 10%, #49d2ff, #1f7fe6 55%, #163fa4 100%);
      box-shadow:0 8px 16px rgba(73,210,255,.35), inset 0 0 1px rgba(255,255,255,.5);
    }
    .stamps{margin-left:auto;display:flex;gap:8px;}
    .stamp{
      padding:6px 11px;border:1px solid var(--border);border-radius:999px;
      font-size:12px;color:var(--muted);background:rgba(255,255,255,.03);
    }
    .title{margin:24px 0 10px;font-size:34px;line-height:1.3;font-weight:800;letter-spacing:.25px;}
    .subtitle{color:var(--muted);font-size:16px;margin-bottom:20px;}
    .hero{display:flex;align-items:flex-end;gap:20px;margin-top:8px;border-top:1px dashed #22365c;padding-top:18px;flex-wrap:wrap;}
    .pill{
      display:inline-flex;align-items:center;gap:8px;
      padding:10px 16px;border-radius:14px;border:1px solid var(--border);
      background:var(--panel);color:var(--ink);font-weight:600;font-size:16px;
    }
    .price{
      font-size:28px;font-weight:900;letter-spacing:.4px;
      background:linear-gradient(90deg,var(--accent),var(--accent-2));
      -webkit-background-clip:text;background-clip:text;color:transparent;
    }
    .grid{display:grid;gap:16px;margin-top:24px;grid-template-columns:repeat(12,1fr);}
    .card{
      background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01));
      border:1px solid var(--border);border-radius:14px;padding:18px 20px;min-height:120px;
    }
    .card h3{margin:0 0 6px;font-size:15px;color:#bed0f0;letter-spacing:.3px;font-weight:700;}
    .list{margin:6px 0 0 0;padding-left:18px;}
    .list li{margin:6px 0;}
    .kpis{display:flex;gap:12px;flex-wrap:wrap;margin-top:6px;}
    .kpi{flex:1 1 150px;border:1px solid var(--border);border-radius:12px;padding:12px 14px;background:rgba(255,255,255,.02);}
    .kpi b{font-size:19px;display:block;}
    .muted{color:var(--muted);font-size:13px;}
    .two{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
    .timeline{position:relative;margin-top:8px;padding-left:12px;}
    .timeline::before{content:"";position:absolute;left:4px;top:6px;bottom:6px;width:2px;background:#27406b;border-radius:2px;}
    .milestone{
      margin-left:12px;padding:8px 12px;border:1px solid var(--border);border-radius:12px;
      background:rgba(255,255,255,.02);position:relative;margin-bottom:10px;
    }
    .milestone::before{
      content:"";position:absolute;left:-19px;top:12px;width:10px;height:10px;border-radius:50%;
      background:linear-gradient(90deg,var(--accent),var(--accent-2));box-shadow:0 0 0 3px #0d1a33;
    }
    .foot{position:absolute;right:18px;bottom:16px;display:flex;gap:12px;align-items:center;color:var(--muted);font-size:12px;}
    .pnum{border:1px solid var(--border);padding:4px 8px;border-radius:8px;background:rgba(255,255,255,.02);}
    .pnum::after{content:counter(slide);margin-left:4px;font-weight:700;color:#dfe7ff;}
    @media print{
      body{background:#fff;}
      .deck{width:100%;margin:0;}
      .slide{
        border:none;border-radius:0;box-shadow:none;width:100%;height:100vh;padding:28mm 24mm;
        -webkit-print-color-adjust:exact;print-color-adjust:exact;
      }
      .foot{position:fixed;bottom:12mm;right:24mm;}
    }
  </style>
</head>
<body>
  <div class="deck">
    <section class="slide">
      <div style="position:absolute;right:-140px;top:-140px;width:440px;height:440px;border-radius:50%;background:radial-gradient(circle at 30% 30%, rgba(73,210,255,.28), rgba(73,210,255,0));filter:blur(6px);"></div>
      <div style="display:flex;align-items:center;">
        <div class="brand"><div class="mark" aria-hidden="true"></div>丸の内デベロップメント</div>
        <div class="stamps">
          <span class="stamp">等価交換建替え</span>
          <span class="stamp">作成日 2025-08-10</span>
        </div>
      </div>
      <h1 class="title">丸の内一丁目 ZEB オフィス再開発</h1>
      <p class="subtitle">対象地：東京都千代田区丸の内1丁目1-1（地積：約2,180㎡）</p>
      <div class="hero">
        <div class="pill">交換比率 <span class="price">60%</span></div>
        <div class="pill">竣工予定 <span class="price">2028年3月</span></div>
        <div class="pill">想定延床 <span class="price">約6,800㎡</span></div>
      </div>
      <div class="grid">
        <div class="card" style="grid-column:span 8;">
          <h3>プロジェクトの狙い</h3>
          <ul class="list">
            <li>旧耐震ビルを解体し、BCP・環境性能を備えたハイグレードオフィスに刷新。</li>
            <li>地権者様の保有土地を現物出資とし、交換持分60%で専有床（約408㎡）と共用持分を獲得。</li>
            <li>丸の内仲通りに開かれた商業・広場機能を整備し、回遊性と賑わいを強化。</li>
          </ul>
        </div>
        <div class="card" style="grid-column:span 4;">
          <h3>提供価値</h3>
          <ul class="list">
            <li>ZEB Ready水準／CO₂排出▲55%、中間期にZEH化も視野。</li>
            <li>竣工後は当社PM・リーシング部門が一体で空室リスクを低減。</li>
            <li>中枢業務継続：非常用発電72時間・井水活用・免震構造。</li>
          </ul>
        </div>
      </div>
      <div class="foot"><span class="muted">Overview</span><span class="pnum">Page</span></div>
    </section>

    <section class="slide">
      <div class="brand"><div class="mark" aria-hidden="true"></div>丸の内デベロップメント</div>
      <h2 class="title" style="font-size:30px;">敷地条件と企画方針</h2>
      <p class="subtitle">都心業務核の一等地。用途地域：商業地域／容積率1,300%／建蔽率80%</p>
      <div class="grid">
        <div class="card" style="grid-column:span 6;">
          <h3>敷地データ</h3>
          <div class="kpis">
            <div class="kpi"><span class="muted">敷地面積</span><b>約2,180㎡</b></div>
            <div class="kpi"><span class="muted">基準階</span><b>約680㎡</b></div>
            <div class="kpi"><span class="muted">想定階数</span><b>地上14F／地下2F</b></div>
          </div>
          <ul class="list">
            <li>丸の内仲通りに20m接道、北側は皇居外苑への眺望を確保。</li>
            <li>地下連絡通路を通じ東京駅丸の内北口と徒歩4分で直結可能。</li>
            <li>用途はオフィス＋商業＋カンファレンス。ナレッジ共有機能を1〜3階に配置。</li>
          </ul>
        </div>
        <div class="card" style="grid-column:span 6;">
          <h3>デザインハイライト</h3>
          <div class="two">
            <div>
              <p class="muted">Exterior &amp; ESG</p>
              <ul class="list">
                <li>低層部を透過性の高いガラスBOXと木調ルーバーで構成。</li>
                <li>屋上に約600㎡のスカイガーデンと太陽光発電（105kW）を設置。</li>
                <li>雨水と雑排水を再利用し、年間給水コスト▲18%を実現。</li>
              </ul>
            </div>
            <div>
              <p class="muted">Tenant Experience</p>
              <ul class="list">
                <li>ワンフロア当たり最大12分割まで柔軟にレイアウト。</li>
                <li>ウェルネス認証（WELL Gold）取得に向けた仕様標準化。</li>
                <li>スマートビルプラットフォームでエネルギー・入退館を統合管理。</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="card" style="grid-column:span 12;">
          <h3>権利調整・インフラ</h3>
          <ul class="list">
            <li>仮設事務所・駐車場の代替措置：JR貨物用地を活用した暫定利用計画を提示済み。</li>
            <li>既存テナント3社とは2026年3月までの退去合意書締結を進行中（2社合意済）。</li>
            <li>地中埋設物調査は2025年Q1に実施予定、杭抜き費用は上限4.5億円で当社負担。</li>
          </ul>
        </div>
      </div>
      <div class="foot"><span class="muted">Site & Vision</span><span class="pnum">Page</span></div>
    </section>

    <section class="slide">
      <div class="brand"><div class="mark" aria-hidden="true"></div>丸の内デベロップメント</div>
      <h2 class="title" style="font-size:30px;">等価交換スキームと経済性</h2>
      <div class="grid">
        <div class="card" style="grid-column:span 7;">
          <h3>交換条件（ドラフト）</h3>
          <div class="kpis">
            <div class="kpi"><span class="muted">交換比率</span><b>地権者 60%｜当社 40%</b></div>
            <div class="kpi"><span class="muted">地権者取得床</span><b>専有約408㎡</b></div>
            <div class="kpi"><span class="muted">想定賃料</span><b>坪32,000円</b></div>
            <div class="kpi"><span class="muted">NOI利回り</span><b>4.1%</b></div>
          </div>
          <ul class="list">
            <li>地権者様持分は主に7〜9階の専有区画＋共用持分（高効率フロア・天井高2,900mm）。</li>
            <li>弊社取得床は中高層の成長テナント向けフロアと高収益の1階商業区画。</li>
            <li>管理組合を共管し、修繕積立金は1㎡あたり月450円で20年計画を策定。</li>
          </ul>
        </div>
        <div class="card" style="grid-column:span 5;">
          <h3>経済性サマリー（概算）</h3>
          <div class="two">
            <div>
              <p class="muted">総事業費</p>
              <ul class="list">
                <li>解体・造成：12.4億円</li>
                <li>建築本体：63.8億円（@93万円/㎡）</li>
                <li>設備・内装：9.6億円</li>
                <li>諸経費・金利：6.2億円</li>
              </ul>
            </div>
            <div>
              <p class="muted">収益想定</p>
              <ul class="list">
                <li>安定稼働賃料：年間21.8億円（稼働率95%）</li>
                <li>地権者持分 NOI：年間8.6億円／税前</li>
                <li>開発者持分 NOI：年間12.1億円／税前</li>
                <li>出口利回り：4.0%（想定売却価値 約305億円）</li>
              </ul>
            </div>
          </div>
          <p class="muted" style="margin-top:8px;">※詳細な収支モデル・税務インパクトは添付「概算見積.xlsx」を参照ください。</p>
        </div>
        <div class="card" style="grid-column:span 12;">
          <h3>地権者様メリット</h3>
          <div class="two">
            <div>
              <ul class="list">
                <li>固定資産を換価せずに最新鋭オフィスを無借金で取得。</li>
                <li>稼働開始から安定賃料（年間8.6億円）＋将来売却益を確保。</li>
                <li>建替え期間中の仮移転費・PM費用は当社負担、税務・会計は提携士業がサポート。</li>
              </ul>
            </div>
            <div>
              <ul class="list">
                <li>カーボンクレジット活用によるESGレポーティングを共同で実施。</li>
                <li>BCP拠点として地権者向け専用防災ストックヤードを整備。</li>
                <li>持分売却・相続が必要となった場合の買戻し条項（当社／金融機関）を用意。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="foot"><span class="muted">Economics</span><span class="pnum">Page</span></div>
    </section>

    <section class="slide">
      <div class="brand"><div class="mark" aria-hidden="true"></div>丸の内デベロップメント</div>
      <h2 class="title" style="font-size:30px;">スケジュール・リスクマネジメント</h2>
      <div class="grid">
        <div class="card" style="grid-column:span 7;">
          <h3>想定タイムライン</h3>
          <div class="timeline">
            <div class="milestone"><strong>2025年 Q4</strong> 基本協定（等価交換契約）締結・SPC設立</div>
            <div class="milestone"><strong>2026年 Q1-Q2</strong> 実施設計・行政協議（景観審査／環境アセス）</div>
            <div class="milestone"><strong>2026年 Q3</strong> 既存テナント退去完了・解体着工</div>
            <div class="milestone"><strong>2027年 Q2</strong> 新築工事着工（工期：約20か月）</div>
            <div class="milestone"><strong>2028年 3月</strong> 竣工・検査済証取得／引渡し・賃料発生開始</div>
          </div>
        </div>
        <div class="card" style="grid-column:span 5;">
          <h3>主要リスクと対応</h3>
          <ul class="list">
            <li>工程遅延：ゼネコン3社によるVE入札とリードタイム共有、主要資材を前倒し発注。</li>
            <li>市況変動：リーシングは既存外資金融2社とLOI締結済み（85%事前確保）。</li>
            <li>コスト上昇：建築費の変動は指数連動条項でシェア、最大2%まで当社吸収。</li>
            <li>税務：組合型SPCで繰延税効果を最大化、相続発生時の持分承継スキームを設計。</li>
          </ul>
        </div>
        <div class="card" style="grid-column:span 12;">
          <h3>次のステップ</h3>
          <ol class="list" style="margin-left:18px;">
            <li>2025年11月までに交換契約の主要条項を確定（弁護士同席の協議会2回）。</li>
            <li>測量・地中障害調査（当社費用負担）を2025年12月〜2026年1月に実施。</li>
            <li>テナント移転計画の確定と仮使用権設定契約の締結。</li>
            <li>金融機関との協調融資枠 180億円のコミットメント取得。</li>
          </ol>
          <p class="muted" style="margin-top:8px;">ご質問や条件調整は随時オンライン／対面ミーティングにて対応いたします。</p>
        </div>
      </div>
      <div class="foot"><span class="muted">Timeline &amp; Governance</span><span class="pnum">Page</span></div>
    </section>
  </div>
</body>
</html>
`;
const shibuyaSignageHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>渋谷宇田川町 屋上サイネージ導入提案</title>
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 40px; background: #0f1a2b; color: #f4f7fb; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    h1 { margin: 0; font-size: 28px; }
    section { background: rgba(255,255,255,0.05); padding: 24px; border-radius: 16px; margin-bottom: 20px; }
    .kpi { display: flex; gap: 16px; }
    .kpi div { flex: 1; background: rgba(28,60,120,0.45); padding: 16px; border-radius: 12px; }
    .timeline li { margin-bottom: 8px; }
  </style>
</head>
<body>
  <header>
    <h1>屋上メディアサイネージ導入ご提案</h1>
    <div>作成日: 2025-09-08</div>
  </header>
  <section>
    <h2>提案サマリー</h2>
    <p>渋谷交差点に面した屋上へLEDビジョンを新設し、年間広告料1,200万円を保証するスキームです。電力・保守費用は当社負担、地域景観条例への適合確認済み。</p>
  </section>
  <section class="kpi">
    <div>
      <strong>契約期間</strong>
      <p>8年間（更新時協議）</p>
    </div>
    <div>
      <strong>初期投資</strong>
      <p>当社負担 3,800万円</p>
    </div>
    <div>
      <strong>撤去費用</strong>
      <p>当社負担 500万円</p>
    </div>
  </section>
  <section>
    <h2>タイムライン</h2>
    <ul class="timeline">
      <li>2025-10: 景観審査・近隣説明会（当社主導）</li>
      <li>2026-01: 設置工事完了・試験点灯</li>
      <li>2026-02: 広告配信開始／売上シェア開始</li>
    </ul>
  </section>
</body>
</html>
`;
const shibuyaFlexLeaseHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>渋谷宇田川町 フレックスオフィス専有契約提案</title>
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 36px; background: #111827; color: #e5e7eb; }
    h1 { margin-bottom: 12px; font-size: 26px; }
    section { margin-top: 20px; padding: 20px; border-radius: 18px; background: rgba(37,99,235,0.15); }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { padding: 10px 12px; border-bottom: 1px solid rgba(229,231,235,0.2); text-align: left; }
    .pill { display: inline-block; padding: 6px 12px; border-radius: 14px; background: rgba(59,130,246,0.35); margin-right: 8px; }
  </style>
</head>
<body>
  <h1>クリエイティブ企業向けフレックスオフィス提案</h1>
  <div class="pill">面積: 3-7階 合計1,260㎡</div>
  <div class="pill">想定入居: 海外系デザインスタジオ</div>
  <section>
    <h2>賃料条件</h2>
    <table>
      <tr><th>月額賃料</th><td>¥2,200,000（共益込）</td></tr>
      <tr><th>契約期間</th><td>6年（中途解約条項あり）</td></tr>
      <tr><th>フリーレント</th><td>4ヶ月</td></tr>
      <tr><th>内装支援</th><td>¥18,000,000（当社負担）</td></tr>
    </table>
  </section>
  <section>
    <h2>バリューアップ施策</h2>
    <ul>
      <li>24/7セキュリティとスマートアクセス導入</li>
      <li>屋上テラスを共用ワークラウンジ化</li>
      <li>地域共創イベント（月次）を当社で企画運営</li>
    </ul>
  </section>
</body>
</html>
`;
const taishidoSaleHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>太子堂ミックスプレイス 買取提案</title>
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; background: #101820; color: #f0f4f8; margin: 0; padding: 32px; }
    header { margin-bottom: 28px; }
    h1 { margin: 0 0 12px; font-size: 26px; }
    .grid { display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); }
    .card { background: rgba(31,41,55,0.55); border-radius: 16px; padding: 18px; }
  </style>
</head>
<body>
  <header>
    <h1>太子堂ミックスプレイス 即時買取のご提案</h1>
    <p>作成日: 2025-09-06 / ABC アーバンリノベーション</p>
  </header>
  <div class="grid">
    <div class="card">
      <h2>提案価格</h2>
      <p>¥3,480,000,000（現況渡し）</p>
      <p>クロージングまで120日、デューデリジェンス完了後に手付10%</p>
    </div>
    <div class="card">
      <h2>長所</h2>
      <ul>
        <li>用途変更後の複合商業再生プラン同梱</li>
        <li>既存テナントとの合意形成支援</li>
      </ul>
    </div>
    <div class="card">
      <h2>スケジュール</h2>
      <ol>
        <li>2025-10: デューデリジェンス着手</li>
        <li>2025-12: 売買契約締結</li>
        <li>2026-01: 残代金決済</li>
      </ol>
    </div>
  </div>
</body>
</html>
`;
const taishidoStorageHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>太子堂ミックスプレイス ストレージ複合活用</title>
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 32px; background: #0e1726; color: #edf2f7; }
    h1 { font-size: 24px; margin-bottom: 12px; }
    section { margin-top: 18px; padding: 18px; border-radius: 16px; background: rgba(148,163,184,0.12); }
    .kpi { display: flex; gap: 14px; }
    .kpi article { flex: 1; background: rgba(59,130,246,0.25); padding: 14px; border-radius: 12px; }
  </style>
</head>
<body>
  <h1>太子堂ミックスプレイス 短期保管＋D2C支援拠点</h1>
  <section>
    <h2>概要</h2>
    <p>低層部を都市型ストレージとD2Cショールームへコンバージョン。年間粗利6,800万円を見込む共同運営モデルです。</p>
  </section>
  <section class="kpi">
    <article><strong>契約期間</strong><p>7年（再契約協議）</p></article>
    <article><strong>CAPEX</strong><p>¥28,000,000（当社立替）</p></article>
    <article><strong>撤去費用</strong><p>¥6,000,000 当社負担</p></article>
  </section>
  <section>
    <h2>施策</h2>
    <ul>
      <li>1階にD2Cブランドの展示販売ゾーンを構築</li>
      <li>B1F・2Fをセルフストレージ（IoTロック）へ転用</li>
      <li>地域コミュニティ向け配送ハブを併設</li>
    </ul>
  </section>
</body>
</html>
`;
const marunouchiGroundHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>丸の内シナジータワー 定期借地スキーム</title>
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; background: #09111f; color: #f8fafc; margin: 0; padding: 40px; }
    h1 { margin-bottom: 10px; }
    dl { display: grid; grid-template-columns: 160px 1fr; gap: 6px 18px; }
    section { background: rgba(37, 99, 235, 0.18); border-radius: 18px; padding: 22px; margin-bottom: 18px; }
  </style>
</head>
<body>
  <h1>丸の内シナジータワー 定期借地＋再投資提案</h1>
  <section>
    <h2>概要</h2>
    <p>再開発期間中の区分床を事業用定期借地に切替え、年間地代1,150万円＋収益連動ボーナスを支払うプランです。</p>
  </section>
  <section>
    <h2>条件</h2>
    <dl>
      <dt>契約期間</dt><dd>35年・普通借地権</dd>
      <dt>初期一時金</dt><dd>¥25,000,000</dd>
      <dt>改定条項</dt><dd>5年ごと、CPI＋1%</dd>
    </dl>
  </section>
  <section>
    <h2>スケジュール</h2>
    <ol>
      <li>2025-12: 基本合意締結</li>
      <li>2026-03: 既存テナント退去完了</li>
      <li>2026-06: 改装着工・引渡し</li>
    </ol>
  </section>
</body>
</html>
`;
const marunouchiSkyEventHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>丸の内シナジータワー スカイデッキ活用案</title>
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; padding: 36px; background: #0b1628; color: #e2e8f0; }
    header { display:flex; justify-content:space-between; margin-bottom:24px; }
    section { margin-bottom: 18px; padding: 18px; border-radius: 16px; background: rgba(15,118,110,0.25); }
  </style>
</head>
<body>
  <header>
    <h1>スカイデッキ・イベントプラットフォーム提案</h1>
    <span>作成日: 2025-09-09</span>
  </header>
  <section>
    <h2>収益モデル</h2>
    <p>月2回の企業イベント利用を前提に年間売上9,200万円、固定賃料600万円＋売上の12%をお支払いします。</p>
  </section>
  <section>
    <h2>設備投資</h2>
    <ul>
      <li>全天候型可動屋根と照明設備（当社負担 9,500万円）</li>
      <li>防音・安全対策を含む改装設計費（当社負担 1,200万円）</li>
    </ul>
  </section>
  <section>
    <h2>タイムライン</h2>
    <p>2025-10 設計着手 → 2026-02 改装完了 → 2026-03 運用開始</p>
  </section>
</body>
</html>
`;
const marunouchiBridgeSaleHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <title>丸の内シナジータワー ブリッジファンド買取案</title>
  <style>
    body { font-family: 'Noto Sans JP', sans-serif; margin: 0; padding: 36px; background: #0d1324; color: #f1f5f9; }
    h1 { margin-bottom: 14px; }
    article { background: rgba(59,89,152,0.25); padding: 20px; border-radius: 16px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <h1>海外年金向けブリッジ買取スキーム</h1>
  <article>
    <h2>提示条件</h2>
    <p>取得価格 ¥4,320,000,000（株式譲渡）。PM契約は現行を1年間引継ぎ、以降は当社指定会社へ移管。</p>
  </article>
  <article>
    <h2>ファイナンス構成</h2>
    <ul>
      <li>エクイティ 60%（海外年金）</li>
      <li>メザニンローン 20%（当社アレンジ）</li>
      <li>シニアローン 20%（国内メガバンク）</li>
    </ul>
  </article>
  <article>
    <h2>移行スケジュール</h2>
    <p>2025-11 LOI締結 → 2026-01 SPA締結 → 2026-03 クロージング</p>
  </article>
</body>
</html>
`;
const mockProposals: Proposal[] = [
  {
    id: "p1",
    kind: "sale",
    target: "東京都渋谷区宇田川町 31-2",
    chiban: "宇田川町83-2",
    company: "渋谷アセットデベロップメント",
    created_at: "2025-08-20",
    summary: "マンション用地として2.4億円提示。",
    attachments: ["事業収支モデル.xlsx", "基本合意書（ドラフト）.pdf"],
    mode: "developer",
    price: 240000000,
    costs: { broker: 0, taxes: 1200000 },
    days_to_close: 90,
    confidence: 90,
    details:
      "実測・境界確定、土壌・地中障害の確認等を前提。デューデリジェンス期間30〜45日、契約締結後60〜90日で残代金決済を予定。測量・境界確定・税務面は当社主導で進行し、必要実費は別途精算とします。",
    htmlContent: shibuyahtml,
  },
  {
    id: "p4",
    kind: "lease",
    target: "東京都渋谷区宇田川町 31-2",
    chiban: "宇田川町83-2",
    company: "三井不動産",
    created_at: "2025-08-18",
    summary: "月額賃料180万円想定。",
    attachments: ["賃料査定書.pdf", "テナント需要レポート.pdf"],
    monthly_rent: 1800000,
    term_years: 5,
    opex_ratio: 0.15,
    occupancy: 0.95,
    confidence: 82,
    details:
      "当社が建物のバリューアップ企画・内装監修・リーシングを一体で推進します。5年の定期建物賃貸借を基本とし、想定稼働率95%の収益シミュレーションを添付。オプションで当社による一括借上げ（マスターリース）も選択可能で、賃料キャッシュフローの平準化に寄与します。",
    htmlContent: shibuyaleaseHtml,
  },
  {
    id: "p2",
    kind: "other",
    subkind: "event",
    target: "東京都世田谷区太子堂 4丁目1-1",
    chiban: "太子堂125-3",
    company: "世田谷アーバンデベロップメント",
    created_at: "2025-08-15",
    summary:
      "暫定利用（プレイスメイキング）で価値向上。イベント稼働時の来客増シミュレーション付き。",
    attachments: ["企画書.pdf"],
    term_years: 1,
    revenue_year: 5000000,
    capex: 1200000,
    opex_ratio: 0.2,
    confidence: 68,
    details:
      "本格開発着手前の1年間、週末ポップアップやアートイベント等の暫定利用を実施。初期投資120万円で年間500万円の収益を見込みつつ、来街者増・SNS露出により立地認知を強化します。将来の賃料水準底上げ（テナントアトラクション向上）を狙います。",
    htmlContent: taishidoHtml,
  },
  {
    id: "p5",
    kind: "groundlease",
    target: "東京都世田谷区太子堂 4丁目1-1",
    chiban: "太子堂125-3",
    company: "野村不動産",
    created_at: "2025-08-12",
    summary:
      "50年の事業用定期借地（固定＋改定条項）。長期安定地代と最終的な土地再取得性を確保。",
    attachments: ["コンサルティングレポート.pdf", "収支シミュレーション.xlsx"],
    lease_type: "fixed",
    annual_ground_rent: 8000000,
    key_money: 20000000,
    term_years: 50,
    reversion: { mode: "vacant_land" },
    expense_rate: 0.05,
    confidence: 74,
    details:
      "当社SPCを建て主として事業用定期借地契約を締結。年間地代800万円・一時金2,000万円の提示。10年毎の地代改定条項を設定し、CPI連動オプションにも対応。期間満了時は更地返還（reversion: vacant_land）で地主様の再活用自由度を担保します。",
    htmlContent: taishidoSyakuchiHtml,
  },
  {
    id: "p3",
    kind: "exchange",
    target: "東京都千代田区丸の内 1丁目1-1",
    chiban: "丸の内45-1",
    company: "丸の内デベロップメント",
    created_at: "2025-08-10",
    summary:
      "等価交換による高層ビル建替え（ZEB Ready）。地権者還元と環境性能を両立。",
    attachments: ["概算見積.xlsx", "配置図.dxf"],
    ratio: 0.6,
    acquired_area_m2: 408,
    completion_ym: "2028-03",
    post_strategy: "lease",
    assumed_rent_psm: 8000,
    opex_ratio: 0.18,
    confidence: 76,
    details:
      "土地資産を等価交換スキームで最新鋭オフィスへ建替え。交換比率60%で地権者持分に応じた新築床（想定408㎡）を取得。ZEB Ready水準での環境性能を確保し、完成後は当社がリーシングを主導。長期安定の賃料収益化を狙います。",
    htmlContent:marunouchiHtml,
  },
  {
    id: "p6",
    kind: "sale",
    target: "東京都渋谷区宇田川町 31-2",
    chiban: "宇田川町83-2",
    company: "大和証券不動産投資顧問",
    created_at: "2025-09-05",
    summary:
      "REITブリッジを前提としたレジ・商業複合開発用地の買取。価格は2.32億円。",
    attachments: ["査定根拠.pdf", "デューデリジェンス項目一覧.xlsx"],
    mode: "principal",
    price: 232000000,
    costs: { broker: 0, taxes: 1050000, others: 1500000 },
    days_to_close: 60,
    confidence: 88,
    details:
      "J-REITへの最終売却を見据えたブリッジ買取。既存テナントの退去交渉を当社が負担し、建物解体・更地引き渡しを条件としたスキームです。立地優位性を踏まえた土地値評価を添付しています。",
  },
  {
    id: "p7",
    kind: "lease",
    target: "東京都世田谷区太子堂 4丁目1-1",
    chiban: "太子堂125-3",
    company: "東急コミュニティー",
    created_at: "2025-08-30",
    summary:
      "シェアオフィス×飲食の複合リーシング。月額賃料140万円と改装支援を提案。",
    attachments: ["テナント需要分析.pdf", "改装計画書.pdf"],
    monthly_rent: 1400000,
    term_years: 7,
    free_rent_m: 2,
    ti: 12000000,
    occupancy: 0.92,
    opex_ratio: 0.18,
    confidence: 75,
    details:
      "1-3階をシェアオフィス、4階を飲食・イベントスペースとして複合的に活用。初期投資として1200万円の内装支援（当社立替）を前提に稼働率92%でのPLシミュレーションを提示しています。",
  },
  {
    id: "p8",
    kind: "sale",
    target: "東京都千代田区丸の内 1丁目1-1",
    chiban: "丸の内45-1",
    company: "安田地所リアルエステートサービス",
    created_at: "2025-09-03",
    summary:
      "老朽オフィスのポートフォリオ取得。価格4.05億円、PM引継ぎ条件付き。",
    attachments: ["投資委員会資料.pdf", "建物診断レポート.pdf"],
    mode: "principal",
    price: 405000000,
    costs: { broker: 0, taxes: 2100000 },
    days_to_close: 120,
    confidence: 84,
    details:
      "グローバル投資法人の取得案件として内諾済み。現行PM契約を2年間継続すること、主要テナントとの賃貸借条件維持を前提とした買取条件です。",
  },
  {
    id: "p9",
    kind: "lease",
    target: "東京都千代田区丸の内 1丁目1-1",
    chiban: "丸の内45-1",
    company: "四ツ橋不動産ビルマネジメント",
    created_at: "2025-08-28",
    summary:
      "グローバルテック企業による10年定期賃貸借。月額賃料400万円、フリーレント3ヶ月。",
    attachments: ["LOI.pdf", "フィットアウト計画.pdf"],
    monthly_rent: 4000000,
    term_years: 10,
    free_rent_m: 3,
    occupancy: 0.98,
    opex_ratio: 0.22,
    confidence: 78,
    details:
      "グローバルテック企業の日本本社サテライト拠点。高度セキュリティ仕様に合わせた内装費を当社が一部負担する条件で、長期の安定稼働と賃料の年次改定（CPI連動）を提案しています。",
  },
  {
    id: "p10",
    kind: "other",
    subkind: "ev",
    target: "東京都渋谷区宇田川町 31-2",
    chiban: "宇田川町83-2",
    company: "ENEOS e-Mobility",
    created_at: "2025-08-27",
    summary:
      "EV急速充電ステーション導入。年間売上見込み680万円、撤去時費用も当社負担。",
    attachments: ["システム構成図.pdf", "需要予測レポート.pdf"],
    term_years: 8,
    capex: 18000000,
    revenue_year: 6800000,
    opex_ratio: 0.25,
    occupancy: 0.9,
    removal_cost: 2000000,
    residual_value_rate: 0.1,
    confidence: 72,
    details:
      "区内のEV普及計画と連動した公共性の高い事業。設置・保守・撤去まで当社負担で、土地賃料のほか電力販売収益のシェアモデル（売上の8%）を提案。周辺交通量データによる利用予測を添付しています。",
  },
  {
    id: "p11",
    kind: "other",
    subkind: "parking",
    target: "東京都世田谷区太子堂 4丁目1-1",
    chiban: "太子堂125-3",
    company: "パーク24",
    created_at: "2025-08-22",
    summary:
      "暫定期間中の時間貸駐車場化。40台収容で年間営業利益3,200万円想定。",
    attachments: ["需要予測レポート.pdf", "設備配置図.dwg"],
    term_years: 5,
    capex: 8500000,
    revenue_year: 42000000,
    opex_ratio: 0.35,
    occupancy: 0.88,
    unit: { count: 40, price: 300 },
    removal_cost: 3000000,
    confidence: 70,
    details:
      "玉川通り沿いの交通量を活かした24時間コインパーキング運営。月極需要も取り込めるハイブリッド運用で、暫定活用期間中でも安定収益を確保します。",
  },
  {
    id: "p12",
    kind: "other",
    subkind: "signage",
    target: "東京都渋谷区宇田川町 31-2",
    chiban: "宇田川町83-2",
    company: "クリエイティブ・メディア・ネットワーク",
    created_at: "2025-09-08",
    summary:
      "屋上大型ビジョン導入で広告収入を共創。年間固定賃料1,200万円を保証。",
    attachments: ["屋上サイネージ基本計画.pdf", "景観協議資料.pdf"],
    term_years: 8,
    revenue_year: 12000000,
    capex: 38000000,
    opex_ratio: 0.18,
    occupancy: 0.9,
    removal_cost: 5000000,
    residual_value_rate: 0.05,
    confidence: 73,
    details:
      "渋谷スクランブル交差点からの視認性を最大化し、広告主ポートフォリオを当社が確保。景観条例クリア・夜間照度管理を含む実施計画を添付しています。",
    htmlContent: shibuyaSignageHtml,
  },
  {
    id: "p13",
    kind: "lease",
    target: "東京都渋谷区宇田川町 31-2",
    chiban: "宇田川町83-2",
    company: "ワールドクリエイティブスタジオ",
    created_at: "2025-09-07",
    summary:
      "3-7階をグローバルクリエイター向けフレックスオフィスとして6年確定賃貸。",
    attachments: ["内装コンセプトボード.pdf", "キャッシュフロー試算.xlsx"],
    monthly_rent: 2200000,
    term_years: 6,
    free_rent_m: 4,
    ti: 18000000,
    occupancy: 0.93,
    opex_ratio: 0.2,
    confidence: 79,
    details:
      "海外クリエイティブ企業の日本拠点誘致案件。スマートアクセスや共有ラウンジ等のバリューアップコストを当社が負担し、入居確定済のテナントLOIを付帯します。",
    htmlContent: shibuyaFlexLeaseHtml,
  },
  {
    id: "p14",
    kind: "sale",
    target: "東京都世田谷区太子堂 4丁目1-1",
    chiban: "太子堂125-3",
    company: "ABCアーバンリノベーション",
    created_at: "2025-09-06",
    summary:
      "複合商業再生を前提とした現況買取。再投資計画とESG改修案付き。",
    attachments: ["投資スキーム概要.pdf", "改修基本計画書.pdf"],
    mode: "principal",
    price: 3480000000,
    costs: { broker: 0, taxes: 1780000, others: 2500000 },
    days_to_close: 120,
    confidence: 77,
    details:
      "用途変更と耐震補強を含む再生計画。既存テナントとの条件調整、補助金活用スキーム、ESGレポートドラフトを本提案に同梱しています。",
    htmlContent: taishidoSaleHtml,
  },
  {
    id: "p15",
    kind: "other",
    subkind: "storage",
    target: "東京都世田谷区太子堂 4丁目1-1",
    chiban: "太子堂125-3",
    company: "シティリンク・ストレージ",
    created_at: "2025-09-04",
    summary:
      "低層部を都市型ストレージ＋D2Cショールームへ転用し、中期安定収益を創出。",
    attachments: ["用途変更概略図.pdf", "D2Cブランド連携リスト.xlsx"],
    term_years: 7,
    capex: 28000000,
    revenue_year: 68000000,
    opex_ratio: 0.32,
    occupancy: 0.9,
    removal_cost: 6000000,
    residual_value_rate: 0.08,
    confidence: 71,
    details:
      "IoTロックと24時間警備を備えたストレージ運営と、1階ショールームによる集客を両立。共同運営契約による売上分配モデルを提案します。",
    htmlContent: taishidoStorageHtml,
  },
  {
    id: "p16",
    kind: "groundlease",
    target: "東京都千代田区丸の内 1丁目1-1",
    chiban: "丸の内45-1",
    company: "丸の内アセットパートナーズ",
    created_at: "2025-09-05",
    summary:
      "区分床の再開発期間を活用した35年定期借地＋再投資スキーム。",
    attachments: ["借地契約ドラフト.pdf", "改修工程表.xlsx"],
    lease_type: "ordinary",
    annual_ground_rent: 11500000,
    key_money: 25000000,
    term_years: 35,
    revision: { every_years: 5, index: "CPI" },
    reversion: { mode: "vacant_land" },
    expense_rate: 0.06,
    confidence: 80,
    details:
      "国際金融テナントの再入居を見据えた借地利用。CPI連動改定と再投資保証を組み合わせ、地権者様のキャッシュフローを安定化させます。",
    htmlContent: marunouchiGroundHtml,
  },
  {
    id: "p17",
    kind: "other",
    subkind: "event",
    target: "東京都千代田区丸の内 1丁目1-1",
    chiban: "丸の内45-1",
    company: "トウキョウ・スカイイベントズ",
    created_at: "2025-09-09",
    summary:
      "屋上スカイデッキを企業イベント拠点として共同運営。固定賃料＋歩合収入。",
    attachments: ["イベント運営計画書.pdf", "防音対策レポート.pdf"],
    term_years: 5,
    revenue_year: 92000000,
    capex: 95000000,
    opex_ratio: 0.27,
    occupancy: 0.85,
    removal_cost: 12000000,
    residual_value_rate: 0.12,
    confidence: 69,
    details:
      "全天候型設備と照明システムを新設し、国内外企業のブランドイベントを年間24本実施。周辺ビルとの光害協議フローも整備済みです。",
    htmlContent: marunouchiSkyEventHtml,
  },
  {
    id: "p18",
    kind: "sale",
    target: "東京都千代田区丸の内 1丁目1-1",
    chiban: "丸の内45-1",
    company: "グローバルブリッジインベストメント",
    created_at: "2025-09-11",
    summary:
      "海外年金ファンド向けブリッジ買取。株式譲渡4.32億円、PM引継ぎ条件付き。",
    attachments: ["ファンドタームシート.pdf", "デューデリジェンス項目一覧.xlsx"],
    mode: "principal",
    price: 4320000000,
    costs: { broker: 0, taxes: 2150000, others: 3200000 },
    days_to_close: 150,
    confidence: 81,
    details:
      "海外年金の投資委員会承認を取得済み。メザニン組成と為替ヘッジ付きの取得スキームで、クロージング後12ヶ月以内の出口を想定しています。",
    htmlContent: marunouchiBridgeSaleHtml,
  },
];

const useAssetStore = create<AssetStore>((set, get) => ({
  assets: [
    {
      id: 1,
      name: "渋谷宇田川町物件",
      privacyLevel: "限定公開",
      address: "東京都渋谷区宇田川町 31-2",
      memo: "用途地域: 商業地域 / 建蔽率80% / 容積率600%",
      area: 1198.22,
      owner: "渋谷アセット合同会社",
      status: "現況: 事務所・商業施設",
      lat: 35.661521,
      lng: 139.697487,
      zoning: "商業地域",
      frontage: 18.5,
      depth: 64.8,
      roadAccess: "南側 幅員15.0m 接道長18.5m",
      registrationDate: "2021年6月20日",
      landCategory: "宅地",
      valuationMin: 220000000,
      valuationMax: 260000000,
      valuationMedian: 240000000,
      confidenceScore: "A",
      pricePerSqm: 200334,
      neighborhoodComparison: 6.2,
      lastUpdated: "2024年9月1日",
      coverageRatio: 80,
      floorAreaRatio: 600,
      nearestStation: "渋谷駅",
      stationDistance: 8,
      "referenceIndicators": {
        "kojiKakaku": {
          "year": 2025,
          "sourcePoint": "渋谷5-18 (東京都渋谷区宇田川町21-6)",
          "pricePerSqm": 28000000,
          "pricePerTsubo": 92561983,
          
        },
        "rosenka": {
          "year": 2024,
          "estimatedPricePerSqm": 22400000,
         
        }
      }
    },
    {
      id: 2,
      name: "太子堂複合施設",
      privacyLevel: "限定公開",
      address: "東京都世田谷区太子堂 4丁目1-1",
      memo: "用途地域: 商業地域 / 建蔽率80% / 容積率400%",
      area: 1198.22,
      owner: "太子堂不動産管理株式会社",
      status: "現況: 複合施設",
      lat: 35.64375696,
      lng: 139.6691615,
      zoning: "商業地域",
      frontage: 22.0,
      depth: 54.5,
      roadAccess: "東側 幅員12.0m 接道長22.0m",
      registrationDate: "2019年3月15日",
      landCategory: "宅地",
      valuationMin: 180000000,
      valuationMax: 220000000,
      valuationMedian: 200000000,
      confidenceScore: "B",
      pricePerSqm: 166945,
      neighborhoodComparison: 4.8,
      lastUpdated: "2024年9月1日",
      coverageRatio: 80,
      floorAreaRatio: 400,
      nearestStation: "三軒茶屋駅",
      stationDistance: 5,
      "referenceIndicators": {
        "kojiKakaku": {
          "year": 2025,
          "sourcePoint": "世田谷5-17 (東京都世田谷区太子堂4丁目22-10)",
          "pricePerSqm": 3440000,
          "pricePerTsubo": 11371900,
          "notes": "近隣の商業地の標準地データです。"
        },
        "rosenka": {
          "year": 2024,
          "estimatedPricePerSqm": 2752000,          
        }
      }
    },
    {
      id: 3,
      name: "丸の内オフィスビル",
      privacyLevel: "限定公開",
      address: "東京都千代田区丸の内 1丁目1-1",
      memo: "用途地域: 商業地域 / 建蔽率80% / 容積率1300%",
      area: 680.0,
      owner: "丸の内資産パートナーズ合同会社",
      status: "現況: オフィス",
      lat: 35.684701,
      lng: 139.76135,
      zoning: "商業地域",
      frontage: 20.0,
      depth: 34.0,
      roadAccess: "北側 幅員27.0m 接道長20.0m",
      registrationDate: "2020年11月10日",
      landCategory: "宅地",
      valuationMin: 380000000,
      valuationMax: 420000000,
      valuationMedian: 400000000,
      confidenceScore: "A+",
      pricePerSqm: 588235,
      neighborhoodComparison: 8.5,
      lastUpdated: "2024年9月1日",
      coverageRatio: 80,
      floorAreaRatio: 1300,
      nearestStation: "東京駅",
      stationDistance: 3,
      "referenceIndicators": {
        "kojiKakaku": {
          "year": 2025,
          "sourcePoint": "千代田5-3 (東京都千代田区丸の内1丁目4-1)",
          "pricePerSqm": 35000000,
          "pricePerTsubo": 115702479,
          "notes": "近隣の標準地のデータです。土地取引の目安となる価格です。"
        },
        "rosenka": {
          "year": 2024,
          "estimatedPricePerSqm": 28000000,
         
        }
      }
    },
  ],
  proposals: mockProposals,
  registryAlerts: [
    {
      id: "r1",
      parcel: "（隣地）渋谷区宇田川町 31-3",
      change: "所有者変更",
      date: "2025-09-01",
      note: "法務局オンライン登記情報の差分検出",
    },
    {
      id: "r2",
      parcel: "（隣地）世田谷区太子堂 4丁目1-2",
      change: "地目変更（宅地 → 雑種地）",
      date: "2025-08-28",
      note: "地番図・公図の更新差異",
    },
    {
      id: "r3",
      parcel: "（隣地）千代田区丸の内 1丁目1-2",
      change: "建物新築",
      date: "2025-08-25",
      note: "建築計画概要書の提出確認",
    },
  ],
  selectedAssetId: null,
  neighborParcels: neighborParcelsByAsset,
  neighborLoading: {},
  neighborError: {},
  setAssets: (assets) => set({ assets }),
  setAssetPrivacyLevel: (assetId, level) =>
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId ? { ...asset, privacyLevel: level } : asset
      ),
    })),
  setProposals: (proposals) => set({ proposals }),
  setRegistryAlerts: (alerts) => set({ registryAlerts: alerts }),
  setSelectedAssetId: (id) => set({ selectedAssetId: id }),

  getAssetById: (id) => {
    return get().assets.find((asset) => asset.id === id);
  },

  getProposalsForAsset: (assetId) => {
    const asset = get().getAssetById(assetId);
    if (!asset) return [];

    return get().proposals.filter((proposal) => {
      const targetAddress = proposal.target.toLowerCase();
      const assetAddress = asset.address.toLowerCase();
      return (
        assetAddress.includes(targetAddress) ||
        targetAddress.includes(assetAddress.split(" ")[0])
      );
    });
  },

  getNeighborParcels: (assetId) => {
    return get().neighborParcels[assetId] ?? EMPTY_NEIGHBOR_PARCELS;
  },

  getNeighborLoading: (assetId) => {
    return get().neighborLoading[assetId] ?? false;
  },

  getNeighborError: (assetId) => {
    return get().neighborError[assetId] ?? null;
  },
}));

export default useAssetStore;
