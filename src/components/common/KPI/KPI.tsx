import React from 'react';
import { KPIProps } from '../../../types';

const KPI: React.FC<KPIProps> = ({ label, value }) => {
  return (
    <div className="bg-slate-50 border rounded-xl p-3">
      <div className="text-[11px] text-slate-500">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
};

export default KPI;