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

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('ja-JP');
};