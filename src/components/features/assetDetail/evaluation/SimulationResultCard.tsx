/**
 * シミュレーション結果カードコンポーネント
 *
 * NPV、IRR、回収年数などの主要指標を表示
 */

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import type { SimulationResult, SimulationScenario } from '../../../../types';

interface SimulationResultCardProps {
  result: SimulationResult;
  scenario: SimulationScenario;
  compact?: boolean;
}

const SimulationResultCard: React.FC<SimulationResultCardProps> = ({ result, scenario, compact = false }) => {
  const formatCurrency = (value: number): string => {
    const absValue = Math.abs(value);
    if (absValue >= 100000000) {
      return `${(value / 100000000).toFixed(2)}億円`;
    } else if (absValue >= 10000) {
      return `${(value / 10000).toFixed(0)}万円`;
    } else {
      return `${value.toLocaleString()}円`;
    }
  };

  const formatPercent = (value?: number): string => {
    if (value === undefined) return 'N/A';
    return `${(value * 100).toFixed(2)}%`;
  };

  // 静的なクラス名マッピング
  const scenarioBorderColors: Record<SimulationScenario, string> = {
    leaseholdCondo: 'border-purple-200',
    landSwap: 'border-orange-200',
    masterLease: 'border-green-200',
  };

  const scenarioTextColors: Record<SimulationScenario, string> = {
    leaseholdCondo: 'text-purple-600',
    landSwap: 'text-orange-600',
    masterLease: 'text-green-600',
  };

  const borderClass = result.feasible ? scenarioBorderColors[scenario] : 'border-gray-200';
  const textClass = scenarioTextColors[scenario];

  return (
    <div className={`bg-white rounded-xl border-2 ${borderClass} shadow-card ${compact ? 'p-3' : 'p-6'}`}>
      {/* ヘッダー：実現可否 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {result.feasible ? (
            <>
              <CheckCircle className={`w-5 h-5 ${textClass}`} />
              <span className={`font-semibold ${textClass}`}>実現可能</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-gray-700">要検討</span>
            </>
          )}
        </div>
      </div>

      {/* 主要指標 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* NPV */}
        <div className={compact ? "space-y-1" : "space-y-2"}>
          <div className="flex items-center space-x-1 text-gray-600">
            <DollarSign className={compact ? "w-3 h-3" : "w-4 h-4"} />
            <span className={compact ? "text-xs" : "text-sm"}>NPV</span>
          </div>
          <div className={`font-bold ${result.npv > 0 ? 'text-green-600' : 'text-red-600'} ${compact ? 'text-lg' : 'text-2xl'}`}>
            {result.npv > 0 ? '+' : ''}{formatCurrency(result.npv)}
          </div>
          {result.npv > 0 ? (
            <TrendingUp className={`text-green-500 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          ) : (
            <TrendingDown className={`text-red-500 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          )}
        </div>

        {/* IRR */}
        <div className={compact ? "space-y-1" : "space-y-2"}>
          <div className="flex items-center space-x-1 text-gray-600">
            <Percent className={compact ? "w-3 h-3" : "w-4 h-4"} />
            <span className={compact ? "text-xs" : "text-sm"}>IRR</span>
          </div>
          <div className={`font-bold text-gray-900 ${compact ? 'text-lg' : 'text-2xl'}`}>
            {formatPercent(result.irr)}
          </div>
        </div>
      </div>

      {/* 副次指標 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* 回収年数 */}
        <div className={compact ? "space-y-1" : "space-y-2"}>
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className={compact ? "w-3 h-3" : "w-4 h-4"} />
            <span className={compact ? "text-xs" : "text-sm"}>回収年数</span>
          </div>
          <div className={compact ? "text-sm font-semibold" : "text-lg font-semibold"}>
            {result.paybackYear ? `${result.paybackYear}年` : 'N/A'}
          </div>
        </div>

        {/* 総収入 */}
        <div className={compact ? "space-y-1" : "space-y-2"}>
          <div className="text-gray-600">
            <span className={compact ? "text-xs" : "text-sm"}>総収入</span>
          </div>
          <div className={compact ? "text-sm font-semibold" : "text-lg font-semibold"}>
            {formatCurrency(result.totalRevenue || 0)}
          </div>
        </div>
      </div>

      {/* 注記 */}
      {!compact && result.notes.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">詳細情報</h4>
          <ul className="space-y-1">
            {result.notes.slice(0, 3).map((note, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start">
                <span className="mr-2">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SimulationResultCard;
