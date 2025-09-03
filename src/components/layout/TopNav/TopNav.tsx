import React from 'react';
import { Bell, ChevronDown, Settings, User, Menu } from 'lucide-react';
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
    <div className="w-full bg-[#0b3557] text-white relative">
      <div className="max-w-[1600px] mx-auto px-3 md:px-4">
        <div className="h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onMenuClick} className="lg:hidden p-1">
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-xl font-bold tracking-wide">WHERE</div>
            <span className="text-xs px-2 py-1 rounded-md bg-white text-[#0b3557] font-semibold">
              資産管理
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 text-sm opacity-90">
              JA <ChevronDown className="w-4 h-4" />
            </div>
            <Bell className="w-5 h-5 opacity-90" />
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="relative flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>設定</span>
            </button>
            <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg text-sm">
              <User className="w-4 h-4" /> J
            </div>
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="absolute top-14 right-4 bg-white rounded-lg shadow-lg border p-4 z-50 min-w-[250px]">
          <div className="text-gray-900">
            <div className="font-semibold text-sm mb-3">公開範囲設定</div>
            <div className="space-y-2">
              <PrivacyOption
                level="最小公開"
                description="用途地域・行政区画のみ"
                checked={privacyLevel === '最小公開'}
                onChange={() => {
                  setPrivacyLevel('最小公開');
                  setShowSettings(false);
                }}
              />
              <PrivacyOption
                level="限定公開"
                description="高度地区・防火地域を追加"
                checked={privacyLevel === '限定公開'}
                onChange={() => {
                  setPrivacyLevel('限定公開');
                  setShowSettings(false);
                }}
              />
              <PrivacyOption
                level="フル公開"
                description="すべてのレイヤーを表示可能"
                checked={privacyLevel === 'フル公開'}
                onChange={() => {
                  setPrivacyLevel('フル公開');
                  setShowSettings(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
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