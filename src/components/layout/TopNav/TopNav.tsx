import React from 'react';
import { Bell, ChevronDown, Settings, User, Menu, AlertCircle } from 'lucide-react';
import { PrivacyLevel } from '../../../types';

interface TopNavProps {
  privacyLevel: PrivacyLevel;
  setPrivacyLevel: (level: PrivacyLevel) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  onMenuClick: () => void;
}

const TopNav: React.FC<TopNavProps> = ({
  privacyLevel,
  setPrivacyLevel,
  showSettings,
  setShowSettings,
  onMenuClick,
}) => {
  return (
    <div className="w-full bg-[#0b3f4a] text-white relative">
      <div className="max-w-[1600px] mx-auto px-3 md:px-4">
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onMenuClick} className="lg:hidden p-1">
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-xl font-bold tracking-wide">WHERE OWNER</div>
            {/* Global nav (左寄せ) */}
            <nav className="hidden md:flex items-center gap-3 ml-2 text-sm">
              <button className="px-2 py-1 rounded hover:bg-white/10">探索</button>
              <button className="px-2 py-1 rounded hover:bg-white/10 flex items-center gap-1">
                資産管理 <ChevronDown className="w-4 h-4" />
              </button>
              <button className="px-3 py-1.5 rounded-md bg-white text-[#0b3f4a] font-semibold shadow-sm">AI探索</button>
              <button className="px-3 py-1.5 rounded-md border border-white/50 text-white hover:bg-white/10">セルフ探索</button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 text-sm opacity-90">
              JA <ChevronDown className="w-4 h-4" />
            </div>
            <div className="hidden sm:flex items-center gap-1 text-sm bg-white/10 px-2 py-1 rounded-md">
              <AlertCircle className="w-4 h-4 text-yellow-300" />
              <span>2件エラー</span>
            </div>
            <Bell className="w-5 h-5 opacity-90" />
            <div className="hidden lg:flex items-center gap-3 text-xs opacity-90">
              <span>株式会社WHERE</span>
              <span>取得数: 90件</span>
            </div>
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg text-sm">
              <User className="w-4 h-4" /> J
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface PrivacyOptionProps {
  level: PrivacyLevel;
  description: string;
  checked: boolean;
  onChange: () => void;
}

const PrivacyOption: React.FC<PrivacyOptionProps> = ({
  level,
  description,
  checked,
  onChange,
}) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
      <input
        type="radio"
        name="privacy"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4"
      />
      <div>
        <div className="text-sm font-medium">{level}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </label>
  );
};

export default TopNav;