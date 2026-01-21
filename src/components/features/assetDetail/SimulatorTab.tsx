import React, { useEffect, useMemo, useState } from 'react';
import {
  TrendingUp,
  Building2,
  RefreshCw,
  Home,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  DollarSign,
} from 'lucide-react';
import { getScenarioComparisonByAssetId } from '../../../mocks';
import type {
  LeaseholdCondoSimulation,
  LandSwapSimulation,
  MasterLeaseSimulation,
} from '../../../types/valuation';
import SimulatorSettings from './SimulatorSettings';
import {
  calculateLeaseholdCondo,
  calculateLandSwap,
  calculateMasterLease,
} from '../../../utils/simulatorCalculations';

interface SimulatorTabProps {
  assetId: number;
}

type ScenarioKey = 'leaseholdCondo' | 'landSwap' | 'masterLease';

type ScenarioParameters = {
  leaseholdCondo?: {
    landArea: number;
    floorAreaRatio: number;
    coverageRatio: number;
    leaseholdRatio?: number;
    groundRentRate: number;
  };
  landSwap?: {
    currentLandArea: number;
    currentLandValue: number;
    swapLandArea: number;
    swapLandValue: number;
    transferTaxRate: number;
  };
  masterLease?: {
    totalFloorArea: number;
    guaranteedRent: number;
    leaseTerm: number;
    occupancyRate: number;
    managementFeeRate: number;
  };
};

const computeGroundRentRate = (simulation: LeaseholdCondoSimulation): number => {
  const landValue = simulation.parameters.landArea * 1800000;
  if (!landValue) {
    return 0.6;
  }
  const rate = (simulation.financials.groundRent / landValue) * 100;
  return Number(rate.toFixed(1));
};

const mergeSimulation = <T extends Record<string, any>>(base: T, partial?: Partial<T>): T => {
  if (!partial) {
    return base;
  }

  return {
    ...base,
    ...partial,
    summary: {
      ...(base.summary ?? {}),
      ...(partial.summary ?? {}),
    },
    parameters: {
      ...(base.parameters ?? {}),
      ...(partial.parameters ?? {}),
    },
    financials: {
      ...(base.financials ?? {}),
      ...(partial.financials ?? {}),
    },
    timeline: base.timeline || partial.timeline ? { ...(base.timeline ?? {}), ...(partial.timeline ?? {}) } : undefined,
    comparison:
      base.comparison || partial.comparison
        ? { ...(base.comparison ?? {}), ...(partial.comparison ?? {}) }
        : undefined,
    cashflow: partial.cashflow ?? base.cashflow,
    risks:
      base.risks || partial.risks ? { ...(base.risks ?? {}), ...(partial.risks ?? {}) } : undefined,
  } as T;
};

const SimulatorTab: React.FC<SimulatorTabProps> = ({ assetId }) => {
  const comparison = useMemo(() => getScenarioComparisonByAssetId(assetId), [assetId]);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioKey | null>(() =>
    comparison?.recommendation.preferred ?? null
  );

  const defaultParams = useMemo<ScenarioParameters>(() => {
    if (!comparison) {
      return {};
    }

    const baseScenarios = comparison.scenarios;

    return {
      leaseholdCondo: baseScenarios.leaseholdCondo
        ? {
            landArea: baseScenarios.leaseholdCondo.parameters.landArea,
            floorAreaRatio: baseScenarios.leaseholdCondo.parameters.floorAreaRatio,
            coverageRatio: baseScenarios.leaseholdCondo.parameters.coverageRatio,
            leaseholdRatio: baseScenarios.leaseholdCondo.parameters.leaseholdRatio,
            groundRentRate: computeGroundRentRate(baseScenarios.leaseholdCondo),
          }
        : undefined,
      landSwap: baseScenarios.landSwap
        ? {
            currentLandArea: baseScenarios.landSwap.parameters.currentLandArea,
            currentLandValue: baseScenarios.landSwap.parameters.currentLandValue,
            swapLandArea: baseScenarios.landSwap.parameters.swapLandArea,
            swapLandValue: baseScenarios.landSwap.parameters.swapLandValue,
            transferTaxRate: baseScenarios.landSwap.parameters.transferTaxRate,
          }
        : undefined,
      masterLease: baseScenarios.masterLease
        ? {
            totalFloorArea: baseScenarios.masterLease.parameters.totalFloorArea,
            guaranteedRent: baseScenarios.masterLease.parameters.guaranteedRent,
            leaseTerm: baseScenarios.masterLease.parameters.leaseTerm,
            occupancyRate: baseScenarios.masterLease.parameters.occupancyRate ?? 90,
            managementFeeRate: baseScenarios.masterLease.parameters.managementFeeRate ?? 5,
          }
        : undefined,
    };
  }, [comparison]);

  const [scenarioParams, setScenarioParams] = useState<ScenarioParameters>(defaultParams);

  useEffect(() => {
    setScenarioParams(defaultParams);
  }, [defaultParams]);

  useEffect(() => {
    setSelectedScenario(comparison?.recommendation.preferred ?? null);
  }, [comparison]);

  const handleParameterChange = (scenario: ScenarioKey, key: string, value: number) => {
    setScenarioParams(prev => {
      const current = { ...(prev[scenario] as Record<string, number> | undefined) };
      return {
        ...prev,
        [scenario]: {
          ...current,
          [key]: value,
        },
      };
    });
  };

  const handleResetParameters = (scenario: ScenarioKey) => {
    const base = defaultParams[scenario];
    if (!base) {
      return;
    }

    setScenarioParams(prev => ({
      ...prev,
      [scenario]: { ...(base as Record<string, number>) },
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const scenarios = comparison?.scenarios;
  const hasLeaseholdCondo = !!scenarios?.leaseholdCondo;
  const hasLandSwap = !!scenarios?.landSwap;
  const hasMasterLease = !!scenarios?.masterLease;

  const baseLeasehold = scenarios?.leaseholdCondo;
  const baseLandSwap = scenarios?.landSwap;
  const baseMasterLease = scenarios?.masterLease;

  const recalculatedLeasehold = useMemo<LeaseholdCondoSimulation | undefined>(() => {
    if (!baseLeasehold || !scenarioParams.leaseholdCondo) {
      return baseLeasehold;
    }

    const {
      landArea,
      floorAreaRatio,
      coverageRatio,
      leaseholdRatio,
      groundRentRate,
    } = scenarioParams.leaseholdCondo;

    const partial = calculateLeaseholdCondo({
      landArea,
      floorAreaRatio,
      coverageRatio,
      leaseholdRatio,
      groundRentRate,
    });

    return mergeSimulation(baseLeasehold, partial);
  }, [baseLeasehold, scenarioParams.leaseholdCondo]);

  const recalculatedLandSwap = useMemo<LandSwapSimulation | undefined>(() => {
    if (!baseLandSwap || !scenarioParams.landSwap) {
      return baseLandSwap;
    }

    const { currentLandArea, currentLandValue, swapLandArea, swapLandValue, transferTaxRate } =
      scenarioParams.landSwap;

    const partial = calculateLandSwap({
      currentLandArea,
      currentLandValue,
      swapLandArea,
      swapLandValue,
      transferTaxRate,
    });

    return mergeSimulation(baseLandSwap, partial);
  }, [baseLandSwap, scenarioParams.landSwap]);

  const recalculatedMasterLease = useMemo<MasterLeaseSimulation | undefined>(() => {
    if (!baseMasterLease || !scenarioParams.masterLease) {
      return baseMasterLease;
    }

    const { totalFloorArea, guaranteedRent, leaseTerm, occupancyRate, managementFeeRate } =
      scenarioParams.masterLease;

    const partial = calculateMasterLease({
      totalFloorArea,
      guaranteedRent,
      leaseTerm,
      occupancyRate,
      managementFeeRate,
    });

    return mergeSimulation(baseMasterLease, partial);
  }, [baseMasterLease, scenarioParams.masterLease]);

  const selectedParameters = selectedScenario
    ? (scenarioParams[selectedScenario] as Record<string, number> | undefined)
    : undefined;

  const selectedSimulation = useMemo(() => {
    switch (selectedScenario) {
      case 'leaseholdCondo':
        return recalculatedLeasehold;
      case 'landSwap':
        return recalculatedLandSwap;
      case 'masterLease':
        return recalculatedMasterLease;
      default:
        return undefined;
    }
  }, [recalculatedLandSwap, recalculatedLeasehold, recalculatedMasterLease, selectedScenario]);

  if (!comparison) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">シミュレーションデータがありません</h3>
          <p className="text-gray-600">この物件の評価シミュレーションはまだ作成されていません。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 推奨シナリオ */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <div className="flex items-start space-x-4">
          <div className="bg-green-100 p-3 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">推奨シナリオ</h3>
            <p className="text-gray-700 mb-3">{comparison.recommendation.reason}</p>
            <div className="flex items-center space-x-4">
              <span className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium">
                {getScenarioName(comparison.recommendation.preferred)}
              </span>
              <span className="text-sm text-gray-600">
                スコア: {comparison.recommendation.score[comparison.recommendation.preferred]}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3シナリオ比較カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hasLeaseholdCondo && (
          <ScenarioCard
            type="leaseholdCondo"
            simulation={scenarios.leaseholdCondo!}
            score={comparison.recommendation.score.leaseholdCondo}
            isRecommended={comparison.recommendation.preferred === 'leaseholdCondo'}
            isActive={selectedScenario === 'leaseholdCondo'}
            formatCurrency={formatCurrency}
            formatPercent={formatPercent}
            onClick={() => setSelectedScenario('leaseholdCondo')}
          />
        )}
        {hasLandSwap && (
          <ScenarioCard
            type="landSwap"
            simulation={scenarios.landSwap!}
            score={comparison.recommendation.score.landSwap}
            isRecommended={comparison.recommendation.preferred === 'landSwap'}
            isActive={selectedScenario === 'landSwap'}
            formatCurrency={formatCurrency}
            formatPercent={formatPercent}
            onClick={() => setSelectedScenario('landSwap')}
          />
        )}
        {hasMasterLease && (
          <ScenarioCard
            type="masterLease"
            simulation={scenarios.masterLease!}
            score={comparison.recommendation.score.masterLease}
            isRecommended={comparison.recommendation.preferred === 'masterLease'}
            isActive={selectedScenario === 'masterLease'}
            formatCurrency={formatCurrency}
            formatPercent={formatPercent}
            onClick={() => setSelectedScenario('masterLease')}
          />
        )}
      </div>

      {/* 詳細表示 */}
      {selectedScenario && selectedSimulation && (
        <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {getScenarioName(selectedScenario)} - 詳細
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                スライダーでパラメータを調整すると、下記の数値がリアルタイムで更新されます。
              </p>
            </div>
            <button
              onClick={() => setSelectedScenario(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              閉じる
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              {selectedScenario === 'leaseholdCondo' && (
                <LeaseholdCondoDetail
                  simulation={selectedSimulation as LeaseholdCondoSimulation}
                  formatCurrency={formatCurrency}
                  formatPercent={formatPercent}
                />
              )}
              {selectedScenario === 'landSwap' && (
                <LandSwapDetail
                  simulation={selectedSimulation as LandSwapSimulation}
                  formatCurrency={formatCurrency}
                />
              )}
              {selectedScenario === 'masterLease' && (
                <MasterLeaseDetail
                  simulation={selectedSimulation as MasterLeaseSimulation}
                  formatCurrency={formatCurrency}
                  formatPercent={formatPercent}
                />
              )}
            </div>

            {selectedParameters && (
              <SimulatorSettings
                scenarioType={selectedScenario}
                parameters={selectedParameters}
                onParameterChange={(key, value) => handleParameterChange(selectedScenario, key, value)}
                onReset={() => handleResetParameters(selectedScenario)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const getScenarioName = (type: string): string => {
  switch (type) {
    case 'leaseholdCondo':
      return '借地権マンション';
    case 'landSwap':
      return '土地交換';
    case 'masterLease':
      return 'マスターリース';
    default:
      return type;
  }
};

const getScenarioIcon = (type: string) => {
  switch (type) {
    case 'leaseholdCondo':
      return <Building2 className="w-6 h-6" />;
    case 'landSwap':
      return <RefreshCw className="w-6 h-6" />;
    case 'masterLease':
      return <Home className="w-6 h-6" />;
    default:
      return <TrendingUp className="w-6 h-6" />;
  }
};

interface ScenarioCardProps {
  type: 'leaseholdCondo' | 'landSwap' | 'masterLease';
  simulation: any;
  score?: number;
  isRecommended: boolean;
  isActive: boolean;
  formatCurrency: (value: number) => string;
  formatPercent: (value: number) => string;
  onClick: () => void;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({
  type,
  simulation,
  score,
  isRecommended,
  isActive,
  formatCurrency,
  formatPercent,
  onClick,
}) => {
  const scoreLabel = score !== undefined ? `${score}/100` : '—';
  const landValue =
    type === 'leaseholdCondo' && simulation.parameters?.landArea
      ? simulation.parameters.landArea * 1800000
      : undefined;
  const groundRent = simulation.financials?.groundRent;
  const groundRentRate =
    landValue && groundRent ? (groundRent / landValue) * 100 : undefined;
  const cardClass = `text-left p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
    isRecommended ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-blue-300'
  } ${isActive ? 'ring-2 ring-blue-300 ring-offset-2' : ''}`;

  return (
    <button
      onClick={onClick}
      className={cardClass}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${isRecommended ? 'bg-green-100' : 'bg-blue-50'}`}>
          {getScenarioIcon(type)}
        </div>
        {isRecommended && (
          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">推奨</span>
        )}
      </div>

      <h4 className="text-lg font-semibold text-gray-900 mb-2">{getScenarioName(type)}</h4>

      <div className="space-y-2 mb-4">
        <div>
          <span className="text-sm text-gray-600">
            {type === 'leaseholdCondo' ? '地代（年額）' : '総評価額'}
          </span>
          <p className="text-xl font-bold text-gray-900">
            {type === 'leaseholdCondo'
              ? formatCurrency(groundRent ?? 0)
              : formatCurrency(simulation.summary.totalValue)}
          </p>
          {type === 'leaseholdCondo' && landValue && (
            <p className="text-xs text-gray-600 mt-1">
              土地評価（参考）: {formatCurrency(landValue)}
            </p>
          )}
        </div>
        {type === 'leaseholdCondo' && groundRentRate !== undefined && (
          <div>
            <span className="text-sm text-gray-600">地代利回り</span>
            <p className="text-lg font-semibold text-blue-600">
              {formatPercent(groundRentRate)}
            </p>
          </div>
        )}
        {type !== 'leaseholdCondo' && simulation.summary.roi && (
          <div>
            <span className="text-sm text-gray-600">ROI</span>
            <p className="text-lg font-semibold text-blue-600">
              {formatPercent(simulation.summary.roi)}
            </p>
          </div>
        )}
        {type !== 'leaseholdCondo' && simulation.summary.irr && (
          <div>
            <span className="text-sm text-gray-600">IRR</span>
            <p className="text-lg font-semibold text-purple-600">
              {formatPercent(simulation.summary.irr)}
            </p>
          </div>
        )}

        {/* オーナー視点KPI */}
        {type === 'landSwap' && simulation.comparison && (
          <div>
            <span className="text-sm text-gray-600">オーナーKPI: 資産価値上昇</span>
            <p className="text-lg font-semibold text-emerald-700">
              {formatCurrency(simulation.comparison.valueIncrease)}
            </p>
            {simulation.financials?.currentAssetValue !== undefined && (
              <p className="text-xs text-gray-600 mt-1">
                CF増分（推定）: {formatCurrency(
                  ((simulation.comparison.afterYield - simulation.comparison.beforeYield) / 100) *
                    simulation.financials.currentAssetValue
                )}
                /年
              </p>
            )}
          </div>
        )}
        {type === 'masterLease' && simulation.financials?.netOperatingIncome !== undefined && (
          <div>
            <span className="text-sm text-gray-600">オーナーKPI: 年次キャッシュフロー（NOI）</span>
            <p className="text-lg font-semibold text-emerald-700">
              {formatCurrency(simulation.financials.netOperatingIncome)}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <span className="text-sm text-gray-600">スコア: {scoreLabel}</span>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
    </button>
  );
};

// 借地権マンション詳細
const LeaseholdCondoDetail: React.FC<{
  simulation: LeaseholdCondoSimulation;
  formatCurrency: (value: number) => string;
  formatPercent: (value: number) => string;
}> = ({ simulation, formatCurrency, formatPercent }) => {
  const landValue = simulation.parameters.landArea * 1800000;
  const groundRentRate =
    landValue > 0 ? (simulation.financials.groundRent / landValue) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-blue-600" />
            土地条件
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">土地面積</span>
              <span className="font-medium">{simulation.parameters.landArea}㎡</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">延床面積（想定）</span>
              <span className="font-medium">{simulation.parameters.buildingArea}㎡</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">容積率</span>
              <span className="font-medium">{simulation.parameters.floorAreaRatio}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">建蔽率</span>
              <span className="font-medium">{simulation.parameters.coverageRatio}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">借地権割合</span>
              <span className="font-medium">
                {simulation.parameters.leaseholdRatio ? `${simulation.parameters.leaseholdRatio}%` : '-'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-emerald-600" />
            オーナー収益
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">地代（年額）</span>
              <span className="font-medium text-emerald-700 text-lg">
                {formatCurrency(simulation.financials.groundRent)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">地代利回り</span>
              <span className="font-medium">{formatPercent(groundRentRate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">土地評価（参考）</span>
              <span className="font-medium">{formatCurrency(landValue)}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-600">
        備考: 土地評価は参考値（単価仮定）です。オーナー収益は地代を基準に表示しています。
      </p>
    </div>
  );
};

// 土地交換詳細
const LandSwapDetail: React.FC<{
  simulation: LandSwapSimulation;
  formatCurrency: (value: number) => string;
}> = ({ simulation, formatCurrency }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">交換前</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">土地面積</span>
              <span className="font-medium">{simulation.parameters.currentLandArea}㎡</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">評価額</span>
              <span className="font-medium">{formatCurrency(simulation.parameters.currentLandValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">利回り</span>
              <span className="font-medium">{simulation.comparison.beforeYield}%</span>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">交換後</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">土地面積</span>
              <span className="font-medium">{simulation.parameters.swapLandArea}㎡</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">評価額</span>
              <span className="font-medium text-green-600">{formatCurrency(simulation.parameters.swapLandValue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">利回り</span>
              <span className="font-medium text-green-600">{simulation.comparison.afterYield}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">税務メリット</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 block mb-1">税制優遇額</span>
            <span className="font-medium text-lg text-green-600">{formatCurrency(simulation.financials.taxBenefit)}</span>
          </div>
          <div>
            <span className="text-gray-600 block mb-1">純利益</span>
            <span className="font-medium text-lg text-green-700">{formatCurrency(simulation.financials.netGain)}</span>
          </div>
        </div>
      </div>

      {/* オーナー視点 */}
      <div className="bg-emerald-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">オーナー視点の指標</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600 block mb-1">資産価値上昇</span>
            <span className="font-semibold text-emerald-700">
              {formatCurrency(simulation.comparison.valueIncrease)}
            </span>
          </div>
          <div>
            <span className="text-gray-600 block mb-1">CF増分（推定/年）</span>
            <span className="font-medium">
              {formatCurrency(
                ((simulation.comparison.afterYield - simulation.comparison.beforeYield) / 100) *
                  simulation.financials.currentAssetValue
              )}
            </span>
          </div>
          <div>
            <span className="text-gray-600 block mb-1">純増加額（税・費用考慮）</span>
            <span className="font-medium">{formatCurrency(simulation.financials.netGain)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// マスターリース詳細
const MasterLeaseDetail: React.FC<{
  simulation: MasterLeaseSimulation;
  formatCurrency: (value: number) => string;
  formatPercent: (value: number) => string;
}> = ({ simulation, formatCurrency, formatPercent }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="text-sm text-gray-600 mb-1">年間保証収益</h4>
          <p className="text-xl font-bold text-blue-600">
            {formatCurrency(simulation.financials.annualGuaranteedRevenue)}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="text-sm text-gray-600 mb-1">純営業収益(NOI)</h4>
          <p className="text-xl font-bold text-green-600">
            {formatCurrency(simulation.financials.netOperatingIncome)}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="text-sm text-gray-600 mb-1">還元利回り</h4>
          <p className="text-xl font-bold text-purple-600">
            {formatPercent(simulation.financials.capRate)}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">リスク評価</h4>
        <div className="grid grid-cols-3 gap-4">
          <RiskBadge label="空室リスク" level={simulation.risks.vacancyRisk} />
          <RiskBadge label="滞納リスク" level={simulation.risks.tenantDefaultRisk} />
          <RiskBadge label="賃料下落リスク" level={simulation.risks.marketRentDeclineRisk} />
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <h4 className="font-semibold text-gray-900 mb-3">10年間キャッシュフロー</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">年</th>
                <th className="text-right py-2">収益</th>
                <th className="text-right py-2">経費</th>
                <th className="text-right py-2">NOI</th>
                <th className="text-right py-2">累積NOI</th>
              </tr>
            </thead>
            <tbody>
              {simulation.cashflow.map((cf) => (
                <tr key={cf.year} className="border-b hover:bg-gray-50">
                  <td className="py-2">{cf.year}年目</td>
                  <td className="text-right">{formatCurrency(cf.revenue)}</td>
                  <td className="text-right text-red-600">{formatCurrency(cf.expenses)}</td>
                  <td className="text-right font-medium">{formatCurrency(cf.noi)}</td>
                  <td className="text-right font-semibold text-green-600">
                    {formatCurrency(cf.cumulativeNoi)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* オーナー視点 */}
      <div className="bg-emerald-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">オーナー視点の指標</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600 block mb-1">年次CF（NOI）</span>
            <span className="font-semibold text-emerald-700">
              {formatCurrency(simulation.financials.netOperatingIncome)}
            </span>
          </div>
          <div>
            <span className="text-gray-600 block mb-1">Cap Rate（参考）</span>
            <span className="font-medium">{formatPercent(simulation.financials.capRate)}</span>
          </div>
          <div>
            <span className="text-gray-600 block mb-1">評価額（NOI/CapRate）</span>
            <span className="font-medium">{formatCurrency((simulation.financials.netOperatingIncome / (simulation.financials.capRate / 100)))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RiskBadge: React.FC<{ label: string; level: 'low' | 'medium' | 'high' }> = ({
  label,
  level,
}) => {
  const colors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  const icons = {
    low: <CheckCircle2 className="w-4 h-4" />,
    medium: <AlertCircle className="w-4 h-4" />,
    high: <AlertCircle className="w-4 h-4" />,
  };

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${colors[level]}`}>
      <span className="text-sm font-medium">{label}</span>
      {icons[level]}
    </div>
  );
};

export default SimulatorTab;
