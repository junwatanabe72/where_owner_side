// HTML Content for Proposals
export const htmlContentSale = `
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

  </div>
</body>
</html>
`;

export const htmlContentLease = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <title>リーシング＆バリューアップ提案｜三井不動産</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    /* CSS省略 - 実際は上記と同じスタイル */
  </style>
</head>
<body>
  <h1>リーシング提案書</h1>
  <p>月額賃料: 1,800,000円</p>
</body>
</html>
`;

export const htmlContentEvent = `
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
`;

export const htmlContentGroundlease = `
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
`;

export const htmlContentExchange = `
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
`;