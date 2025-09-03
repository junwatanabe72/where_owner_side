export interface KPIProps {
  label: string;
  value: string;
}

export interface LayerToggleProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled: boolean;
}