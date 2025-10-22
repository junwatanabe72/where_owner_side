/**
 * 評価シミュレータータブ
 *
 * 3シナリオ（定期借地権マンション、等価交換、一括借上）の評価シミュレーション機能
 * UI firstアプローチ：モックデータで先に画面実装し、後でAPI統合
 */

import React, { useState } from 'react';
import {
  Calculator,
  TrendingUp,
  Building2,
  Repeat,
  Home,
  ArrowLeftRight,
} from 'lucide-react';
import type {
  Asset,
  SimulationScenario,
  LeaseholdCondoInput,
  LandSwapInput,
  MasterLeaseInput,
  SimulationResult,
} from '../../../types';
import { SimulationScenarioLabels, SimulationScenarioDescriptions } from '../../../types';
import { runSimulation } from '../../../utils/calc';
import ScenarioInputForm from './evaluation/ScenarioInputForm';
import SimulationResultCard from './evaluation/SimulationResultCard';
import CashFlowChart from './evaluation/CashFlowChart';

interface EvaluationTabProps {
  asset: Asset;
}

const EvaluationTab: React.FC<EvaluationTabProps> = ({ asset }) => {
  const [selectedScenario, setSelectedScenario] = useState<SimulationScenario>('leaseholdCondo');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [results, setResults] = useState<Record<SimulationScenario, SimulationResult | null>>({
    leaseholdCondo: null,
    landSwap: null,
    masterLease: null,
  });

  // デフォルト入力値の生成
  const getDefaultInput = (scenario: SimulationScenario) => {
    const commonDefaults = {
      landAreaM2: asset.area,
      landUnitPrice: asset.pricePerSqm || 500000,
      far: asset.floorAreaRatio || 200,
      discountRate: 0.03,
      taxRateFixedAsset: 0.017,
      maintenanceRate: 0.005,
    };

    switch (scenario) {
      case 'leaseholdCondo':
        return {
          ...commonDefaults,
          leaseYears: 50,
          groundRentYield: 0.03,
          escalatorRate: 0.01,
          upfrontPremium: 0,
          ownerUnitM2: 0,
          ownerUnitRentPerM2: 0,
        } as LeaseholdCondoInput;

      case 'landSwap':
        return {
          ...commonDefaults,
          efficiency: 0.85,
          salesPricePerM2: 800000,
          buildCostPerM2: 400000,
          softCostRate: 0.15,
          developerMarginRate: 0.15,
          financeCostRate: 0.02,
          constructionYears: 2,
          ownerAcquisitionMode: 'auto' as const,
          unitRentPerM2: 3000,
          sellAfterAcquisition: false,
        } as LandSwapInput;

      case 'masterLease':
        return {
          ...commonDefaults,
          baseRentPerM2PerMonth: 2000,
          termYears: 20,
          escalatorRate: 0.01,
          initialCapexOwner: 0,
          terminalCost: 0,
          variableCostRate: 0,
        } as MasterLeaseInput;

      default:
        throw new Error(`Unknown scenario: ${scenario}`);
    }
  };

  // シミュレーション実行
  const handleRunSimulation = (scenario: SimulationScenario, input: any) => {
    try {
      const result = runSimulation(scenario, input);
      setResults(prev => ({ ...prev, [scenario]: result }));
    } catch (error) {
      console.error('Simulation error:', error);
    }
  };

  // 比較モード切り替え
  const handleToggleComparison = () => {
    setComparisonMode(prev => !prev);
  };

  const scenarioIcons: Record<SimulationScenario, React.ReactNode> = {
    leaseholdCondo: <Building2 className="w-5 h-5" />,
    landSwap: <ArrowLeftRight className="w-5 h-5" />,
    masterLease: <Home className="w-5 h-5" />,
  };

  // 静的なクラス名マッピング（Tailwindビルド時に検出されるように）
  const scenarioBgOpacityColors: Record<SimulationScenario, string> = {
    leaseholdCondo: 'bg-purple-50',
    landSwap: 'bg-orange-50',
    masterLease: 'bg-green-50',
  };

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calculator className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">評価シミュレーター</h2>
            <p className="text-sm text-gray-600">3つのシナリオで活用方法を比較検討</p>
          </div>
        </div>

        <button
          onClick={handleToggleComparison}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition ${
            comparisonMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Repeat className="w-4 h-4" />
          <span>{comparisonMode ? '単独表示' : '3シナリオ比較'}</span>
        </button>
      </div>

      {/* シナリオ選択タブ（単独表示モード時のみ） */}
      {!comparisonMode && (
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {(['leaseholdCondo', 'landSwap', 'masterLease'] as SimulationScenario[]).map((scenario) => (
              <button
                key={scenario}
                onClick={() => setSelectedScenario(scenario)}
                className={`flex items-center space-x-2 pb-4 px-1 border-b-2 font-medium text-sm transition ${
                  selectedScenario === scenario
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {scenarioIcons[scenario]}
                <span>{SimulationScenarioLabels[scenario]}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* コンテンツエリア */}
      {comparisonMode ? (
        // 比較モード：3シナリオ横並び
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(['leaseholdCondo', 'landSwap', 'masterLease'] as SimulationScenario[]).map((scenario) => (
            <div key={scenario} className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b">
                <div className={`p-2 rounded-lg ${scenarioBgOpacityColors[scenario]}`}>
                  {scenarioIcons[scenario]}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{SimulationScenarioLabels[scenario]}</h3>
                  <p className="text-xs text-gray-600">{SimulationScenarioDescriptions[scenario]}</p>
                </div>
              </div>

              <ScenarioInputForm
                scenario={scenario}
                defaultInput={getDefaultInput(scenario)}
                onRunSimulation={(input) => handleRunSimulation(scenario, input)}
                compact
              />

              {results[scenario] && (
                <>
                  <SimulationResultCard result={results[scenario]!} scenario={scenario} compact />
                  <CashFlowChart data={results[scenario]!.annualCF} compact />
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        // 単独モード：選択されたシナリオのみ表示
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側：入力フォーム */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">シナリオ概要</h3>
              <p className="text-sm text-gray-600">{SimulationScenarioDescriptions[selectedScenario]}</p>
            </div>

            <ScenarioInputForm
              scenario={selectedScenario}
              defaultInput={getDefaultInput(selectedScenario)}
              onRunSimulation={(input) => handleRunSimulation(selectedScenario, input)}
            />
          </div>

          {/* 右側：結果表示 */}
          <div className="space-y-4">
            {results[selectedScenario] ? (
              <>
                <SimulationResultCard result={results[selectedScenario]!} scenario={selectedScenario} />
                <CashFlowChart data={results[selectedScenario]!.annualCF} />
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  左側のフォームで条件を入力し、
                  <br />
                  「シミュレーション実行」をクリックしてください
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 注釈 */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          <strong>⚠️ 注意:</strong>
          このシミュレーション結果は概算値です。
          税務・法務・会計の最終判断は必ず専門家にご相談ください。
        </p>
      </div>
    </div>
  );
};

export default EvaluationTab;
