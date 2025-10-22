/**
 * キャッシュフローチャートコンポーネント
 *
 * 年次CFをシンプルなバーチャートで可視化（SVG使用）
 */

import React, { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import type { AnnualCashFlow } from '../../../../types';

interface CashFlowChartProps {
  data: AnnualCashFlow[];
  compact?: boolean;
}

const CashFlowChart: React.FC<CashFlowChartProps> = ({ data, compact = false }) => {
  const chartData = useMemo(() => {
    if (data.length === 0) return { bars: [], max: 0, min: 0, step: 1, isEmpty: true };

    // 最大・最小値を計算
    const values = data.map(d => d.cf);
    const max = Math.max(...values, 0);
    const min = Math.min(...values, 0);

    // 表示するデータポイント数を制限（最大30年分）
    const displayData = data.length > 30 ? data.filter((_, i) => i % Math.ceil(data.length / 30) === 0) : data;

    // rangeが0の場合は固定値を設定（全て同じ値の場合）
    const safeMax = max === min ? (max > 0 ? max : 100) : max;
    const safeMin = max === min ? (min < 0 ? min : -100) : min;

    return {
      bars: displayData,
      max: safeMax,
      min: safeMin,
      step: Math.max(1, Math.floor(displayData.length / 20)),
      isEmpty: false,
    };
  }, [data]);

  const formatCurrency = (value: number): string => {
    const absValue = Math.abs(value);
    if (absValue >= 100000000) {
      return `${(value / 100000000).toFixed(1)}億円`;
    } else if (absValue >= 10000) {
      return `${(value / 10000).toFixed(0)}万円`;
    } else {
      return `${value.toLocaleString()}円`;
    }
  };

  // データが空の場合は空のメッセージを表示
  if (chartData.isEmpty || chartData.bars.length === 0) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 shadow-card ${compact ? 'p-3' : 'p-6'}`}>
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className={compact ? "w-4 h-4 text-blue-600" : "w-5 h-5 text-blue-600"} />
          <h3 className={compact ? "text-sm font-semibold" : "text-base font-semibold"}>年次キャッシュフロー</h3>
        </div>
        <div className="flex items-center justify-center h-48 text-gray-500">
          <p className="text-sm">データがありません</p>
        </div>
      </div>
    );
  }

  const height = compact ? 200 : 300;
  const width = 600;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  const chartHeight = height - padding.top - padding.bottom;
  const chartWidth = width - padding.left - padding.right;

  // Y軸のスケール
  const range = chartData.max - chartData.min;
  const yScale = (value: number) => {
    return chartHeight - ((value - chartData.min) / range) * chartHeight;
  };

  // X軸のスケール（ゼロ除算を防ぐ）
  const barWidth = chartData.bars.length > 0 ? chartWidth / chartData.bars.length : 0;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-card ${compact ? 'p-3' : 'p-6'}`}>
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className={compact ? "w-4 h-4 text-blue-600" : "w-5 h-5 text-blue-600"} />
        <h3 className={compact ? "text-sm font-semibold" : "text-base font-semibold"}>年次キャッシュフロー</h3>
      </div>

      <div className="overflow-x-auto">
        <svg width={width} height={height} className="mx-auto">
          {/* Y軸 */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#d1d5db"
            strokeWidth="1"
          />

          {/* X軸 */}
          <line
            x1={padding.left}
            y1={padding.top + yScale(0)}
            x2={width - padding.right}
            y2={padding.top + yScale(0)}
            stroke="#6b7280"
            strokeWidth="2"
          />

          {/* Y軸ラベル */}
          <text
            x={padding.left - 10}
            y={padding.top + yScale(chartData.max)}
            textAnchor="end"
            fontSize="10"
            fill="#6b7280"
          >
            {formatCurrency(chartData.max)}
          </text>
          <text
            x={padding.left - 10}
            y={padding.top + yScale(0) + 4}
            textAnchor="end"
            fontSize="10"
            fill="#6b7280"
          >
            0
          </text>
          {chartData.min < 0 && (
            <text
              x={padding.left - 10}
              y={padding.top + yScale(chartData.min)}
              textAnchor="end"
              fontSize="10"
              fill="#6b7280"
            >
              {formatCurrency(chartData.min)}
            </text>
          )}

          {/* バー */}
          {chartData.bars.map((item, index) => {
            const x = padding.left + index * barWidth + barWidth * 0.1;
            const barHeight = Math.abs(yScale(item.cf) - yScale(0));
            const y = item.cf >= 0
              ? padding.top + yScale(item.cf)
              : padding.top + yScale(0);

            const fillColor = item.cf >= 0 ? '#10b981' : '#ef4444';

            return (
              <g key={item.year}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth * 0.8}
                  height={barHeight}
                  fill={fillColor}
                  opacity="0.8"
                  className="hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <title>{`${item.year}年目: ${formatCurrency(item.cf)}`}</title>
                </rect>

                {/* X軸ラベル（年数） */}
                {index % chartData.step === 0 && (
                  <text
                    x={x + barWidth * 0.4}
                    y={height - padding.bottom + 15}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#6b7280"
                  >
                    {item.year}
                  </text>
                )}
              </g>
            );
          })}

          {/* X軸タイトル */}
          <text
            x={padding.left + chartWidth / 2}
            y={height - 5}
            textAnchor="middle"
            fontSize="12"
            fill="#374151"
            fontWeight="600"
          >
            年数
          </text>

          {/* Y軸タイトル */}
          <text
            x={15}
            y={padding.top + chartHeight / 2}
            textAnchor="middle"
            fontSize="12"
            fill="#374151"
            fontWeight="600"
            transform={`rotate(-90, 15, ${padding.top + chartHeight / 2})`}
          >
            キャッシュフロー
          </text>
        </svg>
      </div>

      {/* 凡例 */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-xs text-gray-600">プラス収支</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-xs text-gray-600">マイナス収支</span>
        </div>
      </div>
    </div>
  );
};

export default CashFlowChart;
