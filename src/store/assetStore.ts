import { create } from 'zustand';

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
  revision?: { every_years: number; index: "CPI" | "none"; cap?: number; floor?: number; };
  reversion: { mode: "vacant_land" | "structure_reversion"; residual_value_rate?: number };
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

export type Proposal = SaleProposal | LeaseProposal | ExchangeProposal | GroundLeaseProposal | OtherProposal;


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
  setAssets: (assets: Asset[]) => void;
  setProposals: (proposals: Proposal[]) => void;
  setRegistryAlerts: (alerts: RegistryAlert[]) => void;
  setSelectedAssetId: (id: number | null) => void;
  getAssetById: (id: number) => Asset | undefined;
  getProposalsForAsset: (assetId: number) => Proposal[];
}
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
    confidence: 0.9,
    details:
      "実測・境界確定、土壌・地中障害の確認等を前提。デューデリジェンス期間30〜45日、契約締結後60〜90日で残代金決済を予定。測量・境界確定・税務面は当社主導で進行し、必要実費は別途精算とします。",
    htmlContent: `
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
    `,
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
    details:
      "当社が建物のバリューアップ企画・内装監修・リーシングを一体で推進します。5年の定期建物賃貸借を基本とし、想定稼働率95%の収益シミュレーションを添付。オプションで当社による一括借上げ（マスターリース）も選択可能で、賃料キャッシュフローの平準化に寄与します。",
    htmlContent: `
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

    `,
  },
  {
    id: "p2",
    kind: "other",
    subkind: "event",
    target: "東京都世田谷区太子堂 4丁目1-1",
    chiban: "太子堂125-3",
    company: "世田谷アーバンデベロップメント",
    created_at: "2025-08-15",
    summary: "暫定利用（プレイスメイキング）で価値向上。イベント稼働時の来客増シミュレーション付き。",
    attachments: ["企画書.pdf"],
    term_years: 1,
    revenue_year: 5000000,
    capex: 1200000,
    opex_ratio: 0.2,
    details:
      "本格開発着手前の1年間、週末ポップアップやアートイベント等の暫定利用を実施。初期投資120万円で年間500万円の収益を見込みつつ、来街者増・SNS露出により立地認知を強化します。将来の賃料水準底上げ（テナントアトラクション向上）を狙います。",
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head><title>暫定利用（プレイスメイキング）企画</title></head>
        <body>
          <h1>施設価値向上に向けた暫定利用のご提案</h1>
          <p><strong>対象物件:</strong> 東京都世田谷区太子堂 4丁目1-1</p>
          <h2>企画概要</h2>
          <p>週末のポップアップストア、アート展示、地域連携イベントを定期開催し、テナント誘致前の賑わい創出と収益化を図ります。</p>
          <h2>KPI（指標）</h2>
          <ul>
            <li>来場者数・滞在時間</li>
            <li>SNS露出・メディア掲載件数</li>
            <li>将来の募集賃料および反響率の改善</li>
          </ul>
        </body>
      </html>
    `,
  },
  {
    id: "p5",
    kind: "groundlease",
    target: "東京都世田谷区太子堂 4丁目1-1",
    chiban: "太子堂125-3",
    company: "野村不動産",
    created_at: "2025-08-12",
    summary: "50年の事業用定期借地（固定＋改定条項）。長期安定地代と最終的な土地再取得性を確保。",
    attachments: ["コンサルティングレポート.pdf", "収支シミュレーション.xlsx"],
    lease_type: "fixed",
    annual_ground_rent: 8000000,
    key_money: 20000000,
    term_years: 50,
    reversion: { mode: "vacant_land" },
    expense_rate: 0.05,
    details:
      "当社SPCを建て主として事業用定期借地契約を締結。年間地代800万円・一時金2,000万円の提示。10年毎の地代改定条項を設定し、CPI連動オプションにも対応。期間満了時は更地返還（reversion: vacant_land）で地主様の再活用自由度を担保します。",
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head><title>事業用定期借地提案書</title></head>
        <body>
          <h1>事業用定期借地権設定のご提案</h1>
          <p><strong>対象物件:</strong> 東京都世田谷区太子堂 4丁目1-1</p>
          <h2>提案概要</h2>
          <ul>
            <li>契約期間: 50年</li>
            <li>年間地代: 8,000,000円</li>
            <li>一時金: 20,000,000円</li>
            <li>改定条項: 10年毎（CPI連動オプション可）</li>
            <li>満了時: 更地返還</li>
          </ul>
          <p>長期安定収入を確保しつつ、満了時の土地自由度を担保します。</p>
        </body>
      </html>
    `,
  },
  {
    id: "p3",
    kind: "exchange",
    target: "東京都千代田区丸の内 1丁目1-1",
    chiban: "丸の内45-1",
    company: "丸の内デベロップメント",
    created_at: "2025-08-10",
    summary: "等価交換による高層ビル建替え（ZEB Ready）。地権者還元と環境性能を両立。",
    attachments: ["概算見積.xlsx", "配置図.dxf"],
    ratio: 0.6,
    acquired_area_m2: 408,
    completion_ym: "2028-03",
    post_strategy: "lease",
    assumed_rent_psm: 8000,
    opex_ratio: 0.18,
    details:
      "土地資産を等価交換スキームで最新鋭オフィスへ建替え。交換比率60%で地権者持分に応じた新築床（想定408㎡）を取得。ZEB Ready水準での環境性能を確保し、完成後は当社がリーシングを主導。長期安定の賃料収益化を狙います。",
    htmlContent: `
      <!DOCTYPE html>
      <html>
        <head><title>等価交換建替えのご提案</title></head>
        <body>
          <h1>等価交換事業のご提案</h1>
          <p><strong>対象物件:</strong> 東京都千代田区丸の内 1丁目1-1</p>
          <h2>事業概要</h2>
          <ul>
            <li>既存建物を解体し高層オフィスへ建替え</li>
            <li>交換比率: 60%（新築床を地権者様に還元）</li>
            <li>完成予定: 2028年3月</li>
            <li>環境性能: ZEB Ready</li>
          </ul>
          <h2>運営方針</h2>
          <p>当社がリーシング・運営計画を主導し、中長期の賃料最大化を図ります。</p>
        </body>
      </html>
    `,
  },
];


const useAssetStore = create<AssetStore>((set, get) => ({
  assets: [
    {
      id: 1,
      name: "渋谷宇田川町物件",
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
    },
    {
      id: 2,
      name: "太子堂複合施設",
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
    },
    {
      id: 3,
      name: "丸の内オフィスビル",
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
  
  setAssets: (assets) => set({ assets }),
  setProposals: (proposals) => set({ proposals }),
  setRegistryAlerts: (alerts) => set({ registryAlerts: alerts }),
  setSelectedAssetId: (id) => set({ selectedAssetId: id }),
  
  getAssetById: (id) => {
    return get().assets.find(asset => asset.id === id);
  },
  
  getProposalsForAsset: (assetId) => {
    const asset = get().getAssetById(assetId);
    if (!asset) return [];
    
    return get().proposals.filter(proposal => {
      const targetAddress = proposal.target.toLowerCase();
      const assetAddress = asset.address.toLowerCase();
      return assetAddress.includes(targetAddress) || targetAddress.includes(assetAddress.split(' ')[0]);
    });
  },
}));

export default useAssetStore;
