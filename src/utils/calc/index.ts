/**
 * 評価シミュレーター計算モジュール統合
 */

import type {
  SimulationScenario,
  ScenarioInput,
  SimulationResult,
  LeaseholdCondoInput,
  LandSwapInput,
  MasterLeaseInput,
} from '../../types/simulation';
import { calculateLeaseholdCondo } from './leaseholdCondo';
import { calculateLandSwap } from './landSwap';
import { calculateMasterLease } from './masterLease';

export { calculateLeaseholdCondo } from './leaseholdCondo';
export { calculateLandSwap } from './landSwap';
export { calculateMasterLease } from './masterLease';

/**
 * シナリオ種別に応じて適切な計算関数を実行
 */
export function runSimulation(
  scenario: SimulationScenario,
  input: ScenarioInput
): SimulationResult {
  switch (scenario) {
    case 'leaseholdCondo':
      return calculateLeaseholdCondo(input as LeaseholdCondoInput);
    case 'landSwap':
      return calculateLandSwap(input as LandSwapInput);
    case 'masterLease':
      return calculateMasterLease(input as MasterLeaseInput);
    default:
      throw new Error(`Unknown scenario: ${scenario}`);
  }
}
