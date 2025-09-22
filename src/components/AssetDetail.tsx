import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Home,
  Calendar,
  FileText,
  ChevronRight,
  Star,
  Info,
  Download,
  Bell,
  Ruler,
  Navigation,
  X,
  Menu,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Map from "../map";
import "mapbox-gl/dist/mapbox-gl.css";
import useAssetStore from "../store/assetStore";
import LayerToggle from "./atoms/LayerToggle";
import { estimateByUnitPrices } from "../utils";
import ProposalHtmlModal from "./features/ProposalHtmlModal";
import AdjacentParcelsTab from "./features/AdjacentParcelsTab";

interface AssetDetailProps {
  assetId: number;
  onBack: () => void;
  privacyLevel: "最小公開" | "限定公開" | "フル公開";
}

const SidebarContent: React.FC<any> = ({ asset, formatCurrency, formatNumber }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-xl font-bold text-gray-900">{asset.name}</h1>
      <p className="text-sm text-gray-600 mt-1">{asset.address}</p>
    </div>

    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
      <div className="text-xs text-gray-600 mb-1">評価額レンジ</div>
      <div className="text-2xl font-bold text-gray-900">
        {formatCurrency(asset.valuationMedian!)}
      </div>
      <div className="text-sm text-gray-600 mt-1">
        {formatCurrency(asset.valuationMin!)} ~ {formatCurrency(asset.valuationMax!)}
      </div>
      <div className="flex items-center mt-2 space-x-2">
        <div className="flex items-center">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium ml-1">{asset.confidenceScore}</span>
        </div>
        <span className="text-xs text-gray-500">信頼度</span>
      </div>
    </div>

    <div className="space-y-3">
      <div className="flex items-start space-x-3">
        <Ruler className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <div className="text-sm font-medium">地積</div>
          <div className="text-sm text-gray-600">
            {formatNumber(asset.area)}㎡ ({formatNumber(asset.area * 0.3025)}坪)
          </div>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <Home className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <div className="text-sm font-medium">用途地域</div>
          <div className="text-sm text-gray-600">{asset.zoning}</div>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <Navigation className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <div className="text-sm font-medium">接道</div>
          <div className="text-sm text-gray-600">{asset.roadAccess}</div>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <div className="text-sm font-medium">最終更新</div>
          <div className="text-sm text-gray-600">{asset.lastUpdated}</div>
        </div>
      </div>
    </div>
  </div>
);



// ProposalsTab Component
const ProposalsTab: React.FC<{ proposals: any[] }> = ({ proposals }) => {
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [showHtml, setShowHtml] = useState(false);

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

  const handleViewDetail = (proposal: any) => {
    setSelectedProposal(proposal);
    setShowHtml(true);
  };

  return (
    <>
      <div className="space-y-4">
        {proposals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            この物件への提案はまだありません
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">種別</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提案者</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">提案内容</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">価格/賃料</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">期間</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {proposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium border ${getBadgeColor(proposal.kind)}`}>
                        {getKindLabel(proposal.kind)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{proposal.company}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(proposal.created_at).toLocaleDateString('ja-JP')}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{proposal.summary}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{formatPrice(proposal)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {proposal.term_years ? `${proposal.term_years}年` : 
                         proposal.days_to_close ? `${proposal.days_to_close}日` : '-'}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetail(proposal)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
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
      
      {showHtml && selectedProposal && selectedProposal.htmlContent && (
        <ProposalHtmlModal
          htmlContent={selectedProposal.htmlContent}
          onClose={() => {
            setShowHtml(false);
            setSelectedProposal(null);
          }}
        />
      )}
    </>
  );
};

const AssetDetail: React.FC<AssetDetailProps> = ({ assetId, onBack, privacyLevel }) => {
  const { getAssetById, getProposalsForAsset } = useAssetStore();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [showNotification, setShowNotification] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [monitoringSettings, setMonitoringSettings] = useState({
    ownerChange: true,
    landCategoryChange: false,
    boundaryChange: true,
    radius: 50,
  });

  const [mapLayers, setMapLayers] = useState({
    youto: true,
    admin: true,
    koudo: privacyLevel !== "最小公開",
    bouka: privacyLevel !== "最小公開",
    height: privacyLevel === "フル公開",
    boundary: privacyLevel === "フル公開",
    diff: privacyLevel === "フル公開",
    night: privacyLevel === "フル公開",
    potential: privacyLevel === "フル公開",
  });

  useEffect(() => {
    setMapLayers(prev => ({
      ...prev,
      koudo: privacyLevel !== "最小公開" ? prev.koudo : false,
      bouka: privacyLevel !== "最小公開" ? prev.bouka : false,
      height: privacyLevel === "フル公開" ? prev.height : false,
      boundary: privacyLevel === "フル公開" ? prev.boundary : false,
      diff: privacyLevel === "フル公開" ? prev.diff : false,
      night: privacyLevel === "フル公開" ? prev.night : false,
      potential: privacyLevel === "フル公開" ? prev.potential : false,
    }));
  }, [privacyLevel]);

  const asset = getAssetById(assetId);
  const proposals = getProposalsForAsset(assetId);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("ja-JP").format(value);
  };

  const tabs = [
    { id: "overview", label: "概要" },
    { id: "valuation", label: "評価" },
    { id: "legal", label: "権利" },
    { id: "documents", label: "資料" },
  
    { id: "proposals", label: "受領提案" },
    { id: "adjacentParcels", label: "隣地状況" },
     { id: "history", label: "履歴" },
  ];

  const landProperties = useMemo<LandProperty[]>(() => {
    if (!asset) return [];
    return [{
      nearStation: [{ min: 5, geometry: { lat: asset.lat, lng: asset.lng } }],
      wood: { originalRaito: 750 }, address: asset.address, area: asset.area,
    }];
  }, [asset]);

  if (!asset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">資産が見つかりません</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>WHERE OWNER</span>
              <ChevronRight className="w-4 h-4" />
              <span>資産管理</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">{asset.name}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm">編集</button>
            <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm">共有</button>
          </div>
        </div>
      </div>

      <div className="flex">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div className="fixed inset-0 z-40 bg-black/30 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSidebarOpen(false)} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div className="fixed top-0 left-0 h-full w-80 bg-white z-50 lg:hidden border-r border-gray-200 p-6 overflow-y-auto" initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
              <SidebarContent asset={asset} formatCurrency={formatCurrency} formatNumber={formatNumber} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200 p-6 h-[calc(100vh-73px)] overflow-y-auto">
          <SidebarContent asset={asset} formatCurrency={formatCurrency} formatNumber={formatNumber} />
        </div>

        <div className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-73px)]">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      selectedTab === tab.id
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {selectedTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">基本情報</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-600">地積</span><span className="font-medium">{formatNumber(asset.area)}㎡</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">用途地域</span><span className="font-medium">{asset.zoning}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">地目</span><span className="font-medium">{asset.landCategory}</span></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">建築制限</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-600">建蔽率</span><span className="font-medium">{asset.coverageRatio}%</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">容積率</span><span className="font-medium">{asset.floorAreaRatio}%</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">防火指定</span><span className="font-medium">防火地域</span></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">接道・形状</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-600">間口</span><span className="font-medium">{asset.frontage}m</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">奥行</span><span className="font-medium">{asset.depth}m</span></div>
                      <div className="text-sm"><span className="text-gray-600">接道</span><div className="font-medium mt-1">{asset.roadAccess}</div></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">周辺環境</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-600">最寄駅</span><span className="font-medium">{asset.nearestStation}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">駅距離</span><span className="font-medium">徒歩{asset.stationDistance}分</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">学区</span><span className="font-medium">区立小学校</span></div>
                    </div>
                  </div>
                </div>
              )}
              {selectedTab === "valuation" && (
                <ValuationPanel asset={asset} formatCurrency={formatCurrency} />
              )}
              {selectedTab === "legal" && (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">登記情報</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-gray-600">所有者</span><span className="font-medium">{asset.owner}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">権利形態</span><span className="font-medium">所有権</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">地目</span><span className="font-medium">{asset.landCategory}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">登記日</span><span className="font-medium">{asset.registrationDate}</span></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">変更履歴</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3"><div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div><div className="flex-1"><div className="text-sm font-medium">所有権移転</div><div className="text-xs text-gray-600 mt-1">2020年3月15日 - 前所有者から渡辺家ホールディングスへ</div></div></div>
                      <div className="flex items-start space-x-3"><div className="w-2 h-2 bg-gray-400 rounded-full mt-1.5"></div><div className="flex-1"><div className="text-sm font-medium">地目変更</div><div className="text-xs text-gray-600 mt-1">2018年11月20日 - 雑種地から宅地へ</div></div></div>
                    </div>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">監視設定</h3>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3"><input type="checkbox" checked={monitoringSettings.ownerChange} onChange={(e) => setMonitoringSettings({ ...monitoringSettings, ownerChange: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">所有者変更</span></label>
                      <label className="flex items-center space-x-3"><input type="checkbox" checked={monitoringSettings.landCategoryChange} onChange={(e) => setMonitoringSettings({ ...monitoringSettings, landCategoryChange: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">地目変更</span></label>
                      <label className="flex items-center space-x-3"><input type="checkbox" checked={monitoringSettings.boundaryChange} onChange={(e) => setMonitoringSettings({ ...monitoringSettings, boundaryChange: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" /><span className="text-sm">地番改編</span></label>
                      <div className="flex items-center space-x-3"><span className="text-sm">監視範囲</span><select value={monitoringSettings.radius} onChange={(e) => setMonitoringSettings({ ...monitoringSettings, radius: parseInt(e.target.value)})} className="px-3 py-1 border border-gray-300 rounded-lg text-sm"><option value={50}>半径50m</option><option value={100}>半径100m</option><option value={200}>半径200m</option></select></div>
                    </div>
                  </div>
                </div>
              )}
              {selectedTab === "documents" && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"><div className="h-32 bg-gray-100 rounded mb-3"></div><h4 className="text-sm font-medium">公図</h4><p className="text-xs text-gray-600 mt-1">2024/08/15</p><button className="mt-2 text-blue-600 text-xs flex items-center space-x-1"><Download className="w-3 h-3" /><span>ダウンロード</span></button></div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"><div className="h-32 bg-gray-100 rounded mb-3"></div><h4 className="text-sm font-medium">地積測量図</h4><p className="text-xs text-gray-600 mt-1">2020/03/10</p><button className="mt-2 text-blue-600 text-xs flex items-center space-x-1"><Download className="w-3 h-3" /><span>ダウンロード</span></button></div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"><div className="h-32 bg-gray-100 rounded mb-3"></div><h4 className="text-sm font-medium">位置図</h4><p className="text-xs text-gray-600 mt-1">2024/09/01</p><button className="mt-2 text-blue-600 text-xs flex items-center space-x-1"><Download className="w-3 h-3" /><span>ダウンロード</span></button></div>
                </div>
              )}
              {selectedTab === "history" && (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><Info className="w-4 h-4 text-blue-600" /></div><div className="flex-1"><div className="text-sm font-medium">評価額更新</div><div className="text-xs text-gray-600 mt-1">2024/09/01 14:30 - システム自動更新</div></div></div>
                  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><FileText className="w-4 h-4 text-green-600" /></div><div className="flex-1"><div className="text-sm font-medium">資料アップロード</div><div className="text-xs text-gray-600 mt-1">2024/08/15 10:15 - 田中太郎が公図を追加</div></div></div>
                  <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg"><div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center"><Bell className="w-4 h-4 text-yellow-600" /></div><div className="flex-1"><div className="text-sm font-medium">監視設定変更</div><div className="text-xs text-gray-600 mt-1">2024/07/20 16:45 - 監視範囲を100mに変更</div></div></div>
                </div>
              )}
              {selectedTab === "proposals" && (
                <ProposalsTab proposals={proposals} />
              )}
              {selectedTab === "adjacentParcels" && (
                <AdjacentParcelsTab />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetail;

// ---- Valuation (Land Only) Panel ----
const ValuationPanel: React.FC<{ asset: any; formatCurrency: (n: number) => string }> = ({ asset, formatCurrency }) => {
  // 5年分のダミー系列（基準値 ±8%レンジ）
  const currentYear = new Date().getFullYear();
  const baseRosenka = asset?.referenceIndicators?.rosenka?.estimatedPricePerSqm ?? 300000; // 円/㎡
  const baseKoji = asset?.referenceIndicators?.kojiKakaku?.pricePerSqm ?? 350000; // 円/㎡
  const multipliers = [0.92, 0.96, 1.0, 1.04, 1.08];
  const rosenkaSeries = multipliers.map((m, i) => ({ year: currentYear - (4 - i), psm: Math.round(baseRosenka * m) }));
  const kojiSeries = multipliers.map((m, i) => ({ year: currentYear - (4 - i), psm: Math.round(baseKoji * m) }));

  const [selectedRYear, setSelectedRYear] = useState<number>(rosenkaSeries[4].year);
  const [selectedKYear, setSelectedKYear] = useState<number>(kojiSeries[4].year);

  const selectedRosenkaPsm = useMemo(() => rosenkaSeries.find(r => r.year === selectedRYear)?.psm, [rosenkaSeries, selectedRYear]);
  const selectedKojiPsm = useMemo(() => kojiSeries.find(k => k.year === selectedKYear)?.psm, [kojiSeries, selectedKYear]);

  const [rosenkaToMarket, setRosenkaToMarket] = useState(1.15);
  const [kojiToMarket, setKojiToMarket] = useState(0.95);
  const [wR, setWR] = useState(0.5); // 0..1（公示は1-wR）
  const [sens, setSens] = useState(0.1);

  const result = useMemo(() => {
    return estimateByUnitPrices({
      areaSqm: asset.area,
      rosenkaPsm: selectedRosenkaPsm,
      kojiPsm: selectedKojiPsm,
      rosenkaToMarket,
      kojiToMarket,
      weights: { rosenka: wR, koji: 1 - wR },
      sensitivity: sens,
    });
  }, [asset.area, selectedRosenkaPsm, selectedKojiPsm, rosenkaToMarket, kojiToMarket, wR, sens]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
        <h3 className="text-lg font-medium mb-4">土地評価（単価ベース）</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600">下限値</div>
            <div className="text-xl font-bold">{formatCurrency(Math.round(result.min))}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">中央値</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(Math.round(result.median))}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600">上限値</div>
            <div className="text-xl font-bold">{formatCurrency(Math.round(result.max))}</div>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-600 flex flex-wrap gap-3">
          {result.breakdown?.rosenka !== undefined && <span className="px-2 py-1 bg-white rounded border">路線価寄与: {formatCurrency(Math.round(result.breakdown.rosenka))}</span>}
          {result.breakdown?.koji !== undefined && <span className="px-2 py-1 bg-white rounded border">公示価格寄与: {formatCurrency(Math.round(result.breakdown.koji))}</span>}
          <span className="px-2 py-1 bg-white rounded border">面積: {asset.area.toLocaleString()}㎡</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">参照単価（直近5年から選択）</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3">
              <label className="text-gray-600">路線価 年度</label>
              <select value={selectedRYear} onChange={(e) => setSelectedRYear(Number(e.target.value))} className="px-2 py-1 border rounded w-40">
                {rosenkaSeries.map(r => (
                  <option key={r.year} value={r.year}>{r.year}年（{r.psm.toLocaleString()} 円/㎡）</option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-between gap-3">
              <label className="text-gray-600">公示価格 年度</label>
              <select value={selectedKYear} onChange={(e) => setSelectedKYear(Number(e.target.value))} className="px-2 py-1 border rounded w-40">
                {kojiSeries.map(k => (
                  <option key={k.year} value={k.year}>{k.year}年（{k.psm.toLocaleString()} 円/㎡）</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">補正・重み・感度</h4>
          <div className="space-y-4 text-sm">
            <div>
              <div className="flex items-center justify-between">
                <label className="text-gray-600">路線価→市場 補正</label>
                <span className="text-gray-800 font-medium">× {rosenkaToMarket.toFixed(2)}</span>
              </div>
              <input type="range" min={0.9} max={1.3} step={0.01} value={rosenkaToMarket} onChange={(e) => setRosenkaToMarket(Number(e.target.value))} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500"><span>0.90</span><span>1.10</span><span>1.30</span></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-gray-600">公示価格→市場 補正</label>
                <span className="text-gray-800 font-medium">× {kojiToMarket.toFixed(2)}</span>
              </div>
              <input type="range" min={0.85} max={1.15} step={0.01} value={kojiToMarket} onChange={(e) => setKojiToMarket(Number(e.target.value))} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500"><span>0.85</span><span>1.00</span><span>1.15</span></div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-gray-600">重み（路線価 ↔ 公示価格）</label>
                <span className="text-gray-800 font-medium">{Math.round(wR*100)}% / {Math.round((1-wR)*100)}%</span>
              </div>
              <input type="range" min={0} max={1} step={0.05} value={wR} onChange={(e) => setWR(Number(e.target.value))} className="w-full" />
              <div className="mt-1 h-2 rounded-full overflow-hidden bg-gray-200">
                <div className="h-full bg-blue-500" style={{ width: `${wR*100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-gray-600">感度（±）</label>
                <span className="text-gray-800 font-medium">{Math.round(sens*100)}%</span>
              </div>
              <input type="range" min={0} max={0.3} step={0.01} value={sens} onChange={(e) => setSens(Number(e.target.value))} className="w-full" />
              <div className="flex justify-between text-xs text-gray-500"><span>0%</span><span>15%</span><span>30%</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
