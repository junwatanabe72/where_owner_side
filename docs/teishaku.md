A. 変更後のMVP機能セット（再定義）

入れる（必須）

オーナー登録／ログイン（権限・公開レベル管理）

物件登録・台帳化（CRUD＋書類アップロード）

マッププロット（所有資産の地図表示）

提案受領／比較（エージェント→オーナー）

チャット（RESTポーリング）：提案スレッド単位のやり取り

評価シミュレーター（3シナリオ）

定期借地権マンション（以下「定借マンション」）

等価交換（共同建替／権利変換）

一括借上（駐車場・ストレージ・太陽光など）
各シナリオで NPV/IRR/年次CF の比較可視化

入れない（今回の範囲外に移す／撤去）

登記監視（隣地登記の自動モニタリング一式）

WebSocket/SSE ベースの常時接続

参考：3シナリオは nexindex の中核メッセージ（「売らない」活用例）に該当。UI/文言の整合を取ります。

nexindex

B. チャットの実装（WebSocket不使用・REST）

要件

1提案 = 1スレッド。添付（PDF/画像/HTML）とメンション（@agent, @owner）対応。

10〜20秒間隔のクライアント側ポーリング（またはページ操作時トリガ）で十分。
通信量最適化のため ETag / If-None-Match を利用（差分のみ取得）。

通知はアプリ内バッジ＋**メール通知（任意）**で補完（プッシュ不要）。

API（例）

POST /threads（提案IDから新規作成）

GET /threads?assetId=...（一覧）

GET /threads/{id}/messages?since=ISO8601（差分取得）

POST /threads/{id}/messages（送信）

HEAD /threads/{id}/messages（ETag取得）

DB（最小）

threads(id, proposal_id, owner_id, agent_id, created_at, last_msg_at)

messages(id, thread_id, sender_id, body, attachments[], created_at, is_read)
※ 既読はユーザー×threadで集約してもOK（thread_reads）。

UI

提案詳細右側にスレッドパネル（テキスト＋添付）。

上部ベルアイコンは未読数を表示（サーバ集計 or クエリでカウント）。

C. 評価シミュレーター（3シナリオ）仕様

目標：「ざっくり比較」から「根拠ある方針検討」まで。
入力は資産台帳と連動、出力は NPV・IRR・年次CF・回収年、比較ビューで横並び。
簡易モデルをベースに、前提（利回り・単価等）はUIで調整可能にします。
（用語メモは末尾）

共通入力

土地：面積(㎡)、想定素地価格(円/㎡)

建築：容積率、建築可能延床(㎡)、建築コスト(円/㎡)、設計/諸経費(率 or 円)、工期

金融：割引率(＝資本コスト)、借入金利(任意)、自己資本比率(任意)

税・維持：固定資産税・都市計画税（率）、保守費（率）

出力：NPV（正味現在価値）、IRR、年次キャッシュフロー（グラフ）、実現可否（Feasibility）。

C-1. 定借マンション（定期借地権分譲）

追加入力

借地期間（例：50年）

借地料利回り（例：2.5〜4.0%／素地価×率＝年間地代の目安）

借地料エスカレーター（年%）

一時金・保証金（任意、0可）

オーナー住戸取得の有無（任意：面積 or 戸数）

計算イメージ

V_land = 面積 × 素地価格

年間地代 R0 = V_land × 借地料利回り

Rt = R0 × (1+g)^(t-1)（g＝エスカレータ）

税控除後の地代キャッシュフロー CFt = Rt − 税等

NPV = 一時金 + Σ CFt/(1+割引率)^t（t=1..期間）

オーナー住戸を取得する場合は賃料収入 or 自家使用の機会費用を加味

可視化

年次CFプロット、累積CF、地代の現在価値、期間末の取扱い（更地返還前提）注記

C-2. 等価交換（共同建替／権利変換）

追加入力

計画延床（売却可能面積）：計画延床 = 面積 × 容積率 × 事業効率(=有効率)

売却単価（円/㎡：住居/商業のミックス可）

建築コスト（円/㎡）、諸経費率、資金調達コスト、工期

ディベロッパー目標利益率（例：GDVに対して15%）

オーナー取得方法：住戸（面積指定） or 金銭清算（バランス）

計算フレーム

GDV（総売上） = Σ(用途別売却単価 × 売却面積)

総コスト = 建築 + 諸経費 + 金融 + 予備費

デベロッパー利益 = 目標利益率 × GDV

土地対価の上限 LandBudget = GDV − 総コスト − デベ利益

整合判定：LandBudget >= V_land なら成立

オーナー取得建物価値 = min(V_land, LandBudget)

住戸取得：オーナー取得面積 = 取得価値 / 平均売価

金銭清算：差額を現金化

オーナーのCF：工期中は0、竣工時に取得価値（住戸 or 現金）、以後は賃料収入（住戸保有時）− 税保守

NPV/IRR を算出（必要なら売却シナリオも選択可能）

可視化

成立/不成立フラグ、取得面積（戸数）・現金清算額、年次CF、感度分析（売価±、コスト±、利益率±）

C-3. 一括借上（※ご指示「一等借上」は文脈上「一括借上」の想定で設計します）

追加入力

業者からの保証賃料（円/㎡/月）

契約期間（例：10〜20年）、年次エスカレーター（%）

初期整備費（オーナー or 事業者負担）、原状回復の扱い（終期費用）

変動費（地代型案件なら最小）、税

計算イメージ

R0 = 面積 × 保証賃料 × 12

Rt = R0 × (1+g)^(t-1)

CFt = Rt − 税等 −（オーナー負担の維持費/初期整備費の償却）

NPV = − 初期投資 + Σ CFt/(1+割引率)^t、IRR も算出

収益安定性（実績連動がある場合は最低保証＋歩合の2段階も設定可）

可視化

NPV/IRR、回収年、安定収益レンジ

UI/UX（評価タブ）

AssetDetail > 「評価シミュレーター」タブ

左：前提入力（共通＋シナリオ固有）。スライダーと数値入力併用。

右：結果カード（NPV/IRR/回収年）＋年次CFグラフ。

上部に**「3シナリオ比較」**トグル：同条件で横並び比較。

注記：各モデルは「概算」。税・契約・会計の最終判断は専門家確認が前提。

型設計（TypeScript例：簡略）
// 共通
type Money = number; type Rate = number; // 0.03 = 3%
interface CommonInput {
  landAreaM2: number;
  landUnitPrice: Money;          // 円/m2（素地）
  far: number;                   // 容積率
  buildCostPerM2?: Money;
  softCostRate?: Rate;
  discountRate: Rate;
  taxRateFixedAsset?: Rate;
}

// 出力（共通）
interface SimulationResult {
  npv: Money;
  irr?: Rate;
  paybackYear?: number;
  annualCF: { year: number; cf: Money }[];
  feasible: boolean;
  notes: string[];
}

// 定借マンション
interface LeaseholdCondoInput extends CommonInput {
  leaseYears: number;
  groundRentYield: Rate;   // 借地料利回り
  escalatorRate: Rate;
  upfrontPremium?: Money;  // 一時金
  ownerUnitM2?: number;    // 任意取得
}

// 等価交換
interface LandSwapInput extends CommonInput {
  efficiency: Rate;               // 事業効率（有効率）
  salesPricePerM2: Money;         // 平均売価
  developerMarginRate: Rate;      // 目標利益率（対GDV）
  financeCostRate?: Rate;
}

// 一括借上
interface MasterLeaseInput extends CommonInput {
  baseRentPerM2PerMonth: Money;
  termYears: number;
  escalatorRate: Rate;
  initialCapexOwner?: Money;
}


既存の評価ロジック（路線価/公示の重み付け）を**「素地価格の初期値」**として活用し、上書き可能にします。
UIはTailwindに統一（MUI依存は撤去方針）で、既存の台帳・提案画面と同トーンに揃えます。

D. 不要機能・コードの整理（削除/停止）

登記監視に関するUI・モック・ジョブ：全撤去
例）「隣地監視」タブやダミーデータ、通知トリガなど（該当コンポーネントは削除 or Feature Flagで無効化）

WebSocket/SSE実装や依存：撤去（チャットはRESTポーリングへ置換）

UIフレームワークの二重化（Tailwind + MUI）
→ Tailwindに統一し、MUI依存コンポーネントは置換（スタイルの一貫性とバンドル削減）

秘匿情報（Mapboxトークン等）
→ .env経由の供給に限定（リポジトリ配布物から除外）

E. 実装ステップ（粒度＝Issue化しやすい単位）

評価シミュレーター

モジュール：calc/leaseholdCondo, calc/landSwap, calc/masterLease

単体テスト（前提値→期待NPV/IRRのスナップショット）

UI：評価タブ＋比較ビュー、前提のプリセット（都心/郊外など任意）

チャットREST化

API（threads / messages 一式）＋ETag対応

フロント：React Queryでポーリング、未読数バッジ

登記監視の撤去

UI/モック/ストアの削除、ルーティングと権限の清掃

UI統一と秘匿情報の是正

用語ミニ解説

NPV（正味現在価値）：将来のCFを割引率で現在価値に換算し合計した指標。0以上なら経済的に妥当。

IRR（内部収益率）：NPVが0になる割引率。要求利回り以上なら採算的に優位。

借地料利回り：素地価格に対する年地代の割合（例：3%なら、1億円の土地で年300万円が目安）。

等価交換：既存権利（主に土地）と新築建物の価値を等価に“交換”するスキーム。開発の総収支（GDV・コスト・開発者利益）でオーナーの取得建物価値が決まる。

一括借上：事業者が土地（または建物）をまとめて賃借し、一定の保証賃料を支払う方式。

補足

3シナリオは nexindex の「主な機能」および「売らない活用提案」の中核文脈に合致します。文言・アイコン・説明の整合を取り込みます。

nexindex

この方針でよろしければ、評価シミュレーターの型定義・関数スケルトンと、評価タブのUIラフまで本回答内の仕様でそのまま着手できます。