import React from 'react';

interface LayerToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const LayerToggle: React.FC<LayerToggleProps> = ({ label, checked, onChange, disabled = false }) => {
  return (
    <label className={`inline-flex items-center gap-1.5 px-2 py-1 rounded ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}>
      <input 
        type="checkbox" 
        className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
        checked={checked} 
        onChange={(e) => !disabled && onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className={`text-xs ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>{label}</span>
    </label>
  );
};

export default LayerToggle;
