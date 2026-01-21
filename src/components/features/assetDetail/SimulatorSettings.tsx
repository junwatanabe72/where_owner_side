/**
 * シミュレーター設定変更UIコンポーネント
 * パラメータを調整して再計算するためのインターフェース
 */

import React from 'react';
import { Sliders, RotateCcw } from 'lucide-react';

interface SimulatorSettingsProps {
  scenarioType: 'leaseholdCondo' | 'landSwap' | 'masterLease';
  parameters: Record<string, number>;
  onParameterChange: (key: string, value: number) => void;
  onReset: () => void;
}

const SimulatorSettings: React.FC<SimulatorSettingsProps> = ({
  scenarioType,
  parameters,
  onParameterChange,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
          <Sliders className="w-5 h-5 mr-2 text-blue-600" />
          パラメータ調整
        </h4>
        <button
          onClick={onReset}
          className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>リセット</span>
        </button>
      </div>

      <div className="space-y-6">
        {scenarioType === 'leaseholdCondo' && (
          <LeaseholdCondoSettings
            parameters={parameters}
            onParameterChange={onParameterChange}
          />
        )}
        {scenarioType === 'landSwap' && (
          <LandSwapSettings parameters={parameters} onParameterChange={onParameterChange} />
        )}
        {scenarioType === 'masterLease' && (
          <MasterLeaseSettings parameters={parameters} onParameterChange={onParameterChange} />
        )}
      </div>
    </div>
  );
};

// 借地権マンション設定
const LeaseholdCondoSettings: React.FC<{
  parameters: Record<string, number>;
  onParameterChange: (key: string, value: number) => void;
}> = ({ parameters, onParameterChange }) => {
  return (
    <>
      <ParameterSlider
        label="地代率（年率%）"
        value={parameters.groundRentRate || 0.6}
        min={0.3}
        max={1.5}
        step={0.1}
        onChange={(val) => onParameterChange('groundRentRate', val)}
        formatValue={(val) => `${val.toFixed(1)}%`}
      />
    </>
  );
};

// 土地交換設定
const LandSwapSettings: React.FC<{
  parameters: Record<string, number>;
  onParameterChange: (key: string, value: number) => void;
}> = ({ parameters, onParameterChange }) => {
  return (
    <>
      <ParameterSlider
        label="交換先土地面積（㎡）"
        value={parameters.swapLandArea || 300}
        min={200}
        max={800}
        step={10}
        onChange={(val) => onParameterChange('swapLandArea', val)}
        formatValue={(val) => `${val}㎡`}
      />
      <ParameterSlider
        label="交換先土地評価額（億円）"
        value={parameters.swapLandValue || 720000000}
        min={300000000}
        max={2000000000}
        step={10000000}
        onChange={(val) => onParameterChange('swapLandValue', val)}
        formatValue={(val) => `¥${(val / 100000000).toFixed(1)}億`}
      />
      <ParameterSlider
        label="譲渡税率（%）"
        value={parameters.transferTaxRate || 20.315}
        min={15}
        max={30}
        step={0.1}
        onChange={(val) => onParameterChange('transferTaxRate', val)}
        formatValue={(val) => `${val.toFixed(1)}%`}
      />
    </>
  );
};

// マスターリース設定
const MasterLeaseSettings: React.FC<{
  parameters: Record<string, number>;
  onParameterChange: (key: string, value: number) => void;
}> = ({ parameters, onParameterChange }) => {
  return (
    <>
      <ParameterSlider
        label="月額保証賃料（万円）"
        value={parameters.guaranteedRent || 1800000}
        min={500000}
        max={5000000}
        step={100000}
        onChange={(val) => onParameterChange('guaranteedRent', val)}
        formatValue={(val) => `¥${(val / 10000).toFixed(0)}万`}
      />
      <ParameterSlider
        label="契約期間（年）"
        value={parameters.leaseTerm || 10}
        min={5}
        max={30}
        step={1}
        onChange={(val) => onParameterChange('leaseTerm', val)}
        formatValue={(val) => `${val}年`}
      />
      <ParameterSlider
        label="想定稼働率（%）"
        value={parameters.occupancyRate || 90}
        min={70}
        max={100}
        step={5}
        onChange={(val) => onParameterChange('occupancyRate', val)}
        formatValue={(val) => `${val}%`}
      />
      <ParameterSlider
        label="管理手数料率（%）"
        value={parameters.managementFeeRate || 5}
        min={3}
        max={10}
        step={0.5}
        onChange={(val) => onParameterChange('managementFeeRate', val)}
        formatValue={(val) => `${val.toFixed(1)}%`}
      />
    </>
  );
};

// スライダーコンポーネント
interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
}

const ParameterSlider: React.FC<ParameterSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-blue-600">{formatValue(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};

export default SimulatorSettings;
