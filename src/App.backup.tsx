import { useMemo, useState, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  FileText,
  Send,
  User,
  X,
  Info,
  Search,
  Settings,
  Menu,
  Layers,
  Eye,
  TrendingUp,
  DollarSign,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Map from "./map";
import AssetDetail from "./components/AssetDetail";
import ProposalDetailView from "./components/ProposalDetailView";
import "mapbox-gl/dist/mapbox-gl.css";
import useAssetStore from "./store/assetStore";
import LayerToggle from "./components/atoms/LayerToggle";

export default function App() {
  const { assets, proposals, registryAlerts, setSelectedAssetId, selectedAssetId } = useAssetStore();
  const [privacyLevel, setPrivacyLevel] = useState<"最小公開" | "限定公開" | "フル公開">("限定公開");
  const [showSettings, setShowSettings] = useState(false);
  const [showAssetDetail, setShowAssetDetail] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (showAssetDetail && selectedAssetId !== null) {
    return (
      <AssetDetail 
        assetId={selectedAssetId} 
        onBack={() => {
          setShowAssetDetail(false);
          setSelectedAssetId(null);
        }}
        privacyLevel={privacyLevel}
      />
    );
  }

  return (
    <div className="w-full h-full min-h-screen bg-slate-50 text-slate-900">
      <TopNav 
        privacyLevel={privacyLevel}
        setPrivacyLevel={setPrivacyLevel}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="px-2 md:px-4 lg:px-6 pb-3">
        <AssetView
          assets={assets}
          proposals={proposals}
          alerts={registryAlerts}
          privacyLevel={privacyLevel}
          onAssetClick={(assetId: number) => {
            setSelectedAssetId(assetId);
            setShowAssetDetail(true);
          }}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
    </div>
  );
}

function TopNav({ privacyLevel, setPrivacyLevel, showSettings, setShowSettings, onMenuClick }: any) {
  return (
    <div className="w-full bg-[#0b3557] text-white relative">
      <div className="max-w-[1600px] mx-auto px-3 md:px-4">
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onMenuClick} className="lg:hidden p-1">
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-xl font-bold tracking-wide">WHERE</div>
            <span className="text-xs px-2 py-1 rounded-md bg-white text-[#0b3557] font-semibold">資産管理</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 text-sm opacity-90">
              JA <ChevronDown className="w-4 h-4" />
            </div>
            <Bell className="w-5 h-5 opacity-90" />
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="relative flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>設定</span>
            </button>
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg text-sm">
              <User className="w-4 h-4" /> J
            </div>
          </div>
        </div>
      </div>
      
      {showSettings && (
        <div className="absolute top-14 right-4 bg-white rounded-lg shadow-lg border p-4 z-50 min-w-[250px]">
          <div className="text-gray-900">
            <div className="font-semibold text-sm mb-3">公開範囲設定</div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input 
                  type="radio" 
                  name="privacy" 
                  checked={privacyLevel === "最小公開"}
                  onChange={() => {
                    setPrivacyLevel("最小公開");
                    setShowSettings(false);
                  }}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-sm font-medium">最小公開</div>
                  <div className="text-xs text-gray-500">用途地域・行政区画のみ</div>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input 
                  type="radio" 
                  name="privacy" 
                  checked={privacyLevel === "限定公開"}
                  onChange={() => {
                    setPrivacyLevel("限定公開");
                    setShowSettings(false);
                  }}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-sm font-medium">限定公開</div>
                  <div className="text-xs text-gray-500">高度地区・防火地域を追加</div>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input 
                  type="radio" 
                  name="privacy" 
                  checked={privacyLevel === "フル公開"}
                  onChange={() => {
                    setPrivacyLevel("フル公開");
                    setShowSettings(false);
                  }}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-sm font-medium">フル公開</div>
                  <div className="text-xs text-gray-500">すべてのレイヤーを表示可能</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const AssetListSidebar = ({ assets, selected, onAssetClick, totalValuation, formatCurrency, setIsSidebarOpen }: any) => (
  <div className="bg-white rounded-2xl shadow p-3 h-full overflow-y-auto flex flex-col">
    <div className="flex items-center justify-between mb-2">
      <div className="font-semibold">所有不動産のリスト</div>
      <div className="text-xs text-slate-500">登録数: {assets.length}件</div>
    </div>
    <div className="mt-2 grid grid-cols-1 gap-2 text-center">
      <KPI label="評価額（概算）" value={formatCurrency(totalValuation)} />
    </div>
    <div className="mt-3 divide-y flex-1 overflow-y-auto">
      {assets.map((a: any) => (
        <button
          key={a.id}
          onClick={() => {
            onAssetClick(a.id);
            if(setIsSidebarOpen) setIsSidebarOpen(false);
          }}
          className={`w-full text-left p-3 rounded-lg ${selected === a.id ? "bg-emerald-50" : "hover:bg-slate-50"}`}
        >
          <div className="text-sm font-semibold">{a.address}</div>
          <div className="text-xs text-slate-600 mt-1">{a.memo}</div>
          <div className="text-xs mt-1">{a.status}</div>
        </button>
      ))}
    </div>
  </div>
);

function AssetView({ assets, proposals, alerts, privacyLevel, onAssetClick, isSidebarOpen, setIsSidebarOpen }: any) {
  const [mapMode, setMapMode] = useState<"map" | "sat">("map");
  const [selected, setSelected] = useState<number | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [showInfoTip, setShowInfoTip] = useState(false);
  const [tipAlert, setTipAlert] = useState<any>(alerts?.[0] ?? null);
  const [showLayers, setShowLayers] = useState(false);
  const sel = useMemo(() => assets.find((a: any) => a.id === selected) || null, [selected, assets]);
  
  const totalValuation = useMemo(() => {
    return assets.reduce((sum: number, asset: any) => sum + (asset.valuationMedian || 0), 0);
  }, [assets]);

  const formatCurrency = (value: number) => {
    if (value >= 100000000) {
      return `¥ ${(value / 100000000).toFixed(2)}億`;
    }
    if (value >= 10000) {
      return `¥ ${Math.round(value / 10000)}万`;
    }
    return `¥ ${value}`;
  };

  const [mapLayers, setMapLayers] = useState({
    youto: true, admin: true, koudo: privacyLevel !== "最小公開", bouka: privacyLevel !== "最小公開",
    height: privacyLevel === "フル公開", boundary: false, diff: false, night: false, potential: false,
  });

  useEffect(() => {
    setMapLayers(prev => ({ ...prev, koudo: privacyLevel !== "最小公開", bouka: privacyLevel !== "最小公開", height: privacyLevel === "フル公開", boundary: privacyLevel === "フル公開", diff: privacyLevel === "フル公開", night: privacyLevel === "フル公開", potential: privacyLevel === "フル公開" }));
  }, [privacyLevel]);

  const landProperties = useMemo<LandProperty[]>(() => assets.map((asset: any) => ({
    nearStation: [{ min: 5, geometry: { lat: asset.lat, lng: asset.lng } }],
    wood: { originalRaito: 750 }, address: asset.address, area: asset.area,
  })), [assets]);

  useEffect(() => {
    const id = setInterval(() => {
      const visible = Math.random() < 0.5;
      setShowInfoTip(visible);
      if (visible && alerts?.length) setTipAlert(alerts[Math.floor(Math.random() * alerts.length)]);
    }, 6000);
    return () => clearInterval(id);
  }, [alerts]);

  useEffect(() => {
    if (selected !== null) {
      const visible = Math.random() < 0.7;
      setShowInfoTip(visible);
      if (visible && alerts?.length) setTipAlert(alerts[Math.floor(Math.random() * alerts.length)]);
    }
  }, [selected, alerts]);

  const handleAssetClick = (assetId: number) => {
    setSelected(assetId);
    onAssetClick(assetId);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div className="fixed inset-0 z-30 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/30" onClick={() => setIsSidebarOpen(false)} />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 h-full w-full max-w-sm bg-transparent p-4"
            >
              <AssetListSidebar assets={assets} selected={selected} onAssetClick={handleAssetClick} totalValuation={totalValuation} formatCurrency={formatCurrency} setIsSidebarOpen={setIsSidebarOpen} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-3 mt-3">
        <div className="hidden lg:block col-span-12 lg:col-span-4 xl:col-span-3">
           <AssetListSidebar assets={assets} selected={selected} onAssetClick={handleAssetClick} totalValuation={totalValuation} formatCurrency={formatCurrency} />
        </div>

        <div className="col-span-12 lg:col-span-8 xl:col-span-9 bg-white rounded-2xl shadow overflow-hidden relative">
          <div className="relative h-[66vh] min-h-[520px]">
            <Map currentStore={landProperties} isSample={true} privacyLevel={privacyLevel} mapMode={mapMode} mapLayers={mapLayers} />
            <div className="absolute top-3 left-3 right-3 z-10">
              <div className="flex gap-2">
                <button onClick={() => setMapMode("map")} className={`px-3 py-2 backdrop-blur rounded-lg text-sm shadow-sm border ${mapMode === "map" ? "bg-blue-500 text-white border-blue-500" : "bg-white/95 hover:bg-gray-50"}`}>地図</button>
                <button onClick={() => setMapMode("sat")} className={`px-3 py-2 backdrop-blur rounded-lg text-sm shadow-sm border ${mapMode === "sat" ? "bg-blue-500 text-white border-blue-500" : "bg-white/95 hover:bg-gray-50"}`}>航空写真</button>
                <div className="flex-1 flex items-center gap-2 bg-white/95 backdrop-blur rounded-lg shadow-sm border px-3">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="マップを検索" className="w-full py-2 text-sm outline-none bg-transparent" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-3 right-3 z-10">
              <button
                onClick={() => setShowLayers(!showLayers)}
                className="p-2 bg-white/95 backdrop-blur rounded-lg shadow-sm border hover:bg-gray-50"
              >
                <Layers className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <AnimatePresence>
              {showLayers && (
                <motion.div
                  className="absolute bottom-16 right-3 z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <div className="w-auto bg-white/95 backdrop-blur rounded-lg p-2 shadow-lg border">
                    <div className="flex flex-wrap gap-2">
                      <LayerToggle label="用途地域" checked={mapLayers.youto} onChange={(v: boolean) => setMapLayers({ ...mapLayers, youto: v })} disabled={false} />
                      <LayerToggle label="行政区画" checked={mapLayers.admin || false} onChange={(v: boolean) => setMapLayers({ ...mapLayers, admin: v })} disabled={false} />
                      <LayerToggle label="高度地区" checked={mapLayers.koudo} onChange={(v: boolean) => setMapLayers({ ...mapLayers, koudo: v })} disabled={privacyLevel === "最小公開"} />
                      <LayerToggle label="防火地域" checked={mapLayers.bouka} onChange={(v: boolean) => setMapLayers({ ...mapLayers, bouka: v })} disabled={privacyLevel === "最小公開"} />
                      <LayerToggle label="建物高さ" checked={mapLayers.height} onChange={(v: boolean) => setMapLayers({ ...mapLayers, height: v })} disabled={privacyLevel !== "フル公開"} />
                      <LayerToggle label="筆界" checked={mapLayers.boundary || false} onChange={(v: boolean) => setMapLayers({ ...mapLayers, boundary: v })} disabled={privacyLevel !== "フル公開"} />
                      <LayerToggle label="差異検出" checked={mapLayers.diff || false} onChange={(v: boolean) => setMapLayers({ ...mapLayers, diff: v })} disabled={privacyLevel !== "フル公開"} />
                      <LayerToggle label="夜間光" checked={mapLayers.night || false} onChange={(v: boolean) => setMapLayers({ ...mapLayers, night: v })} disabled={privacyLevel !== "フル公開"} />
                      <LayerToggle label="高ポテンシャル" checked={mapLayers.potential || false} onChange={(v: boolean) => setMapLayers({ ...mapLayers, potential: v })} disabled={privacyLevel !== "フル公開"} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {showInfoTip && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-12 right-4 bg-white/95 shadow-lg border rounded-xl p-2 pr-8 text-xs max-w-xs z-20">
                <button className="absolute top-1.5 right-1.5 p-1 rounded hover:bg-slate-100" onClick={() => setShowInfoTip(false)}><X className="w-4 h-4" /></button>
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-sky-600" />
                  <div>
                    <div className="text-sky-700 font-medium">隣地 登記変更を検出</div>
                    <div className="mt-0.5">{tipAlert?.parcel ?? "（サンプル）堺市中区…"}</div>
                    <div className="text-slate-500">{tipAlert?.change ?? "所有者変更"} / {tipAlert?.date ?? "2025-09-01"}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <PropertySlideOver open={openDetail} asset={sel} onClose={() => setOpenDetail(false)} proposals={proposals} />
      </div>
    </div>
  );
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-50 border rounded-xl p-3">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

// Proposal Section Component
function ProposalSection({ asset, proposals }: { asset: any; proposals: any[] }) {
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  const getKindLabel = (kind: string) => {
    const labels: Record<string, string> = {
      sale: '売却',
      lease: '賃貸',
      exchange: '等価交換',
      groundlease: '借地',
      other: 'その他'
    };
    return labels[kind] || kind;
  };

  const getBadgeColor = (kind: string) => {
    const colors: Record<string, string> = {
      sale: 'bg-red-100 text-red-700 border-red-300',
      lease: 'bg-purple-100 text-purple-700 border-purple-300',
      exchange: 'bg-blue-100 text-blue-700 border-blue-300',
      groundlease: 'bg-green-100 text-green-700 border-green-300',
      other: 'bg-gray-100 text-gray-700 border-gray-300'
    };
    return colors[kind] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const formatPrice = (proposal: any) => {
    if (proposal.kind === 'sale' && proposal.price) {
      return `¥${proposal.price.toLocaleString('ja-JP')}`;
    }
    if (proposal.kind === 'lease' && proposal.monthly_rent) {
      return `¥${proposal.monthly_rent.toLocaleString('ja-JP')}/月`;
    }
    if (proposal.kind === 'groundlease' && proposal.annual_ground_rent) {
      return `¥${proposal.annual_ground_rent.toLocaleString('ja-JP')}/年`;
    }
    if (proposal.kind === 'exchange') {
      return `等価交換${proposal.ratio ? ` ${proposal.ratio}%` : ''}`;
    }
    return '-';
  };

  const calculateNPV = (proposal: any) => {
    if (proposal.kind === 'sale' && proposal.price) return Math.round(proposal.price * 0.85);
    if (proposal.kind === 'lease' && proposal.monthly_rent && proposal.term_years) {
      return Math.round(proposal.monthly_rent * 12 * proposal.term_years * 0.7);
    }
    if (proposal.kind === 'groundlease' && proposal.annual_ground_rent && proposal.term_years) {
      return Math.round(proposal.annual_ground_rent * proposal.term_years * 0.75);
    }
    return 0;
  };

  const handleViewDetail = (proposal: any) => {
    setSelectedProposal(proposal);
    setShowDetail(true);
  };

  if (showDetail && selectedProposal) {
    return (
      <ProposalDetailView 
        proposal={selectedProposal}
        onBack={() => {
          setShowDetail(false);
          setSelectedProposal(null);
        }}
        onShowHtml={() => {}}
      />
    );
  }

  return (
    <div className="pt-2 border-t">
      <div className="font-semibold text-sm mb-3">プロからの提案</div>
      {proposals.length === 0 ? (
        <div className="text-xs text-slate-500">この物件への提案はまだありません。</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-2 text-left font-medium text-gray-500">種別</th>
                <th className="px-2 py-2 text-left font-medium text-gray-500">提案者</th>
                <th className="px-2 py-2 text-left font-medium text-gray-500">価格/賃料</th>
                <th className="px-2 py-2 text-left font-medium text-gray-500">NPV(10年)</th>
                <th className="px-2 py-2 text-left font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {proposals.map((proposal) => (
                <tr key={proposal.id} className="hover:bg-gray-50">
                  <td className="px-2 py-2 whitespace-nowrap">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium border ${getBadgeColor(proposal.kind)}`}>
                      {getKindLabel(proposal.kind)}
                    </span>
                  </td>
                  <td className="px-2 py-2">
                    <div className="font-medium text-gray-900">{proposal.company}</div>
                    <div className="text-gray-500">{new Date(proposal.created_at).toLocaleDateString('ja-JP')}</div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="font-semibold">{formatPrice(proposal)}</div>
                  </td>
                  <td className="px-2 py-2">
                    <div className="flex items-center">
                      <DollarSign className="w-3 h-3 text-green-500 mr-1" />
                      <span>¥{calculateNPV(proposal).toLocaleString('ja-JP')}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => handleViewDetail(proposal)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      提案を見る
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PropertySlideOver({ open, onClose, asset, proposals }: { open: boolean; onClose: () => void; asset: any; proposals: any[]; }) {
  const related = useMemo(() => {
    if (!asset) return [];
    return proposals.filter((p) => asset.address && p.target && asset.address.includes(p.target));
  }, [asset, proposals]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[70]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/30" onClick={onClose} />
          <motion.div
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl border-l rounded-l-2xl flex flex-col"
          >
            <div className="h-14 flex items-center justify-between px-4 border-b">
              <div className="font-semibold">物件情報</div>
              <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-100"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              {asset ? (
                <>
                  <div className="space-y-1 text-sm">
                    <div className="font-semibold">{asset.address}</div>
                    <div className="text-slate-600">面積: {asset.area.toLocaleString()}㎡（{(asset.area * 0.3025).toFixed(1)}坪）</div>
                    <div className="text-slate-600">所有者: {asset.owner}</div>
                    <div className="text-slate-600">現況: {asset.status}</div>
                    <div className="text-slate-600">{asset.memo}</div>
                  </div>
                  <ProposalSection asset={asset} proposals={related} />
                </>
              ) : (
                <div className="text-sm text-slate-500">物件を選択してください。</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}