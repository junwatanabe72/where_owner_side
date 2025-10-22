/**
 * シナリオ入力フォームコンポーネント
 *
 * 各シナリオ（定期借地権マンション、等価交換、一括借上）の入力パラメータを管理
 */

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import type {
  SimulationScenario,
  LeaseholdCondoInput,
  LandSwapInput,
  MasterLeaseInput,
} from '../../../../types';

interface ScenarioInputFormProps {
  scenario: SimulationScenario;
  defaultInput: LeaseholdCondoInput | LandSwapInput | MasterLeaseInput;
  onRunSimulation: (input: any) => void;
  compact?: boolean;
}

const ScenarioInputForm: React.FC<ScenarioInputFormProps> = ({
  scenario,
  defaultInput,
  onRunSimulation,
  compact = false,
}) => {
  const [input, setInput] = useState(defaultInput);

  const handleChange = (field: string, value: any) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRunSimulation(input);
  };

  const inputClassName = compact
    ? "block w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
    : "block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const labelClassName = compact
    ? "block text-xs font-medium text-gray-700 mb-1"
    : "block text-sm font-medium text-gray-700 mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 共通フィールド */}
      <div className={compact ? "space-y-2" : "space-y-4"}>
        <div>
          <label className={labelClassName}>土地面積（㎡）</label>
          <input
            type="number"
            value={(input as any).landAreaM2}
            onChange={(e) => handleChange('landAreaM2', parseFloat(e.target.value))}
            className={inputClassName}
            step="0.01"
            required
          />
        </div>

        <div>
          <label className={labelClassName}>素地価格（円/㎡）</label>
          <input
            type="number"
            value={(input as any).landUnitPrice}
            onChange={(e) => handleChange('landUnitPrice', parseFloat(e.target.value))}
            className={inputClassName}
            step="1000"
            required
          />
        </div>

        <div>
          <label className={labelClassName}>割引率（%）</label>
          <input
            type="number"
            value={(input as any).discountRate * 100}
            onChange={(e) => handleChange('discountRate', parseFloat(e.target.value) / 100)}
            className={inputClassName}
            step="0.1"
            min="0"
            max="20"
            required
          />
        </div>
      </div>

      {/* シナリオ固有フィールド */}
      {scenario === 'leaseholdCondo' && (
        <LeaseholdCondoFields input={input as LeaseholdCondoInput} onChange={handleChange} className={inputClassName} labelClassName={labelClassName} />
      )}

      {scenario === 'landSwap' && (
        <LandSwapFields input={input as LandSwapInput} onChange={handleChange} className={inputClassName} labelClassName={labelClassName} />
      )}

      {scenario === 'masterLease' && (
        <MasterLeaseFields input={input as MasterLeaseInput} onChange={handleChange} className={inputClassName} labelClassName={labelClassName} />
      )}

      {/* 実行ボタン */}
      <button
        type="submit"
        className={`w-full flex items-center justify-center space-x-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium ${
          compact ? 'px-3 py-2 text-sm' : 'px-4 py-3'
        }`}
      >
        <Play className={compact ? "w-4 h-4" : "w-5 h-5"} />
        <span>シミュレーション実行</span>
      </button>
    </form>
  );
};

// 定期借地権マンション固有フィールド
const LeaseholdCondoFields: React.FC<{
  input: LeaseholdCondoInput;
  onChange: (field: string, value: any) => void;
  className: string;
  labelClassName: string;
}> = ({ input, onChange, className, labelClassName }) => (
  <>
    <div>
      <label className={labelClassName}>借地期間（年）</label>
      <input
        type="number"
        value={input.leaseYears}
        onChange={(e) => onChange('leaseYears', parseInt(e.target.value))}
        className={className}
        min="10"
        max="99"
        required
      />
    </div>

    <div>
      <label className={labelClassName}>借地料利回り（%）</label>
      <input
        type="number"
        value={input.groundRentYield * 100}
        onChange={(e) => onChange('groundRentYield', parseFloat(e.target.value) / 100)}
        className={className}
        step="0.1"
        min="0"
        max="10"
        required
      />
    </div>

    <div>
      <label className={labelClassName}>エスカレーター（%/年）</label>
      <input
        type="number"
        value={input.escalatorRate * 100}
        onChange={(e) => onChange('escalatorRate', parseFloat(e.target.value) / 100)}
        className={className}
        step="0.1"
        min="-5"
        max="5"
      />
    </div>

    <div>
      <label className={labelClassName}>一時金（円）</label>
      <input
        type="number"
        value={input.upfrontPremium || 0}
        onChange={(e) => onChange('upfrontPremium', parseFloat(e.target.value))}
        className={className}
        step="1000000"
        min="0"
      />
    </div>
  </>
);

// 等価交換固有フィールド
const LandSwapFields: React.FC<{
  input: LandSwapInput;
  onChange: (field: string, value: any) => void;
  className: string;
  labelClassName: string;
}> = ({ input, onChange, className, labelClassName }) => (
  <>
    <div>
      <label className={labelClassName}>容積率（%）</label>
      <input
        type="number"
        value={input.far}
        onChange={(e) => onChange('far', parseFloat(e.target.value))}
        className={className}
        min="0"
        max="1000"
        required
      />
    </div>

    <div>
      <label className={labelClassName}>事業効率</label>
      <input
        type="number"
        value={input.efficiency * 100}
        onChange={(e) => onChange('efficiency', parseFloat(e.target.value) / 100)}
        className={className}
        step="1"
        min="50"
        max="100"
        required
      />
    </div>

    <div>
      <label className={labelClassName}>売却単価（円/㎡）</label>
      <input
        type="number"
        value={input.salesPricePerM2}
        onChange={(e) => onChange('salesPricePerM2', parseFloat(e.target.value))}
        className={className}
        step="10000"
        required
      />
    </div>

    <div>
      <label className={labelClassName}>建築コスト（円/㎡）</label>
      <input
        type="number"
        value={input.buildCostPerM2 || 400000}
        onChange={(e) => onChange('buildCostPerM2', parseFloat(e.target.value))}
        className={className}
        step="10000"
      />
    </div>

    <div>
      <label className={labelClassName}>ディベロッパー利益率（%）</label>
      <input
        type="number"
        value={input.developerMarginRate * 100}
        onChange={(e) => onChange('developerMarginRate', parseFloat(e.target.value) / 100)}
        className={className}
        step="1"
        min="0"
        max="30"
        required
      />
    </div>
  </>
);

// 一括借上固有フィールド
const MasterLeaseFields: React.FC<{
  input: MasterLeaseInput;
  onChange: (field: string, value: any) => void;
  className: string;
  labelClassName: string;
}> = ({ input, onChange, className, labelClassName }) => (
  <>
    <div>
      <label className={labelClassName}>保証賃料（円/㎡/月）</label>
      <input
        type="number"
        value={input.baseRentPerM2PerMonth}
        onChange={(e) => onChange('baseRentPerM2PerMonth', parseFloat(e.target.value))}
        className={className}
        step="100"
        min="0"
        required
      />
    </div>

    <div>
      <label className={labelClassName}>契約期間（年）</label>
      <input
        type="number"
        value={input.termYears}
        onChange={(e) => onChange('termYears', parseInt(e.target.value))}
        className={className}
        min="1"
        max="50"
        required
      />
    </div>

    <div>
      <label className={labelClassName}>エスカレーター（%/年）</label>
      <input
        type="number"
        value={input.escalatorRate * 100}
        onChange={(e) => onChange('escalatorRate', parseFloat(e.target.value) / 100)}
        className={className}
        step="0.1"
        min="-5"
        max="5"
      />
    </div>

    <div>
      <label className={labelClassName}>初期整備費（円）</label>
      <input
        type="number"
        value={input.initialCapexOwner || 0}
        onChange={(e) => onChange('initialCapexOwner', parseFloat(e.target.value))}
        className={className}
        step="100000"
        min="0"
      />
    </div>
  </>
);

export default ScenarioInputForm;
