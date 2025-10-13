import { PrivacyLevel } from '../types';

export const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `¥ ${(value / 100000000).toFixed(2)}億`;
  }
  if (value >= 10000) {
    return `¥ ${Math.round(value / 10000)}万`;
  }
  return `¥ ${value}`;
};

export const formatArea = (area: number): string => {
  const tsubo = area * 0.3025;
  return `${area.toLocaleString()}㎡（${tsubo.toFixed(1)}坪）`;
};

export const formatAreaByPrivacy = (
  area: number | undefined,
  privacyLevel: PrivacyLevel
): string => {
  if (area == null) return '-';
  if (privacyLevel === '最小公開') return '***';
  return `${area.toLocaleString('ja-JP')}㎡`;
};

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP');
};

export const formatAssetStatus = (status?: string): string => {
  if (!status) return '-';
  const normalized = status.trim().toLowerCase();
  switch (normalized) {
    case 'owned':
      return '所有中';
    case 'rental':
    case 'leased':
      return '賃貸中';
    case 'vacant':
      return '空き';
    default:
      return status;
  }
};

export const formatValuationByPrivacy = (
  value: number | undefined,
  privacyLevel: PrivacyLevel
): string => {
  if (value == null) return '-';
  if (privacyLevel === '最小公開') return '***';
  if (privacyLevel === '限定公開') {
    const millions = Math.round(value / 10000000);
    return `約${millions}千万円`;
  }
  return formatCurrency(value);
};
