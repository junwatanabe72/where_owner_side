import { NeighborParcel } from '../types/neighbor';

const BASE_LNG = 139.764936;
const BASE_LAT = 35.681236;
const WIDTH = 0.00018;
const HEIGHT = 0.00018;
const COL_STEP = 0.00028;
const ROW_STEP = 0.00024;

const createRectangle = (centerLng: number, centerLat: number, width: number, height: number) => ({
  type: 'Polygon' as const,
  coordinates: [[
    [centerLng - width / 2, centerLat - height / 2],
    [centerLng + width / 2, centerLat - height / 2],
    [centerLng + width / 2, centerLat + height / 2],
    [centerLng - width / 2, centerLat + height / 2],
    [centerLng - width / 2, centerLat - height / 2],
  ]],
});

const neighborSeed: NeighborParcel[] = [
  {
    id: 'marunouchi-39-12',
    assetId: 3,
    label: '丸の内1-39-12',
    areaSqm: 180.12,
    landUse: '宅地',
    note: '対象地',
    status: 'subject',
    alerts: ['所有者変更あり'],
    lastEvent: {
      occurredAt: '2025-09-30',
      summary: '所有者変更登記申請',
    },
    geometry: createRectangle(BASE_LNG, BASE_LAT, WIDTH, HEIGHT),
    footprint: { x: 420, y: 420, width: 160, height: 160 },
  },
  {
    id: 'marunouchi-39-13',
    assetId: 3,
    label: '丸の内1-39-13',
    areaSqm: 180.12,
    landUse: '宅地',
    note: '高額抵当権設定',
    status: 'watch',
    alerts: ['抵当権極度額 18億円'],
    lastEvent: {
      occurredAt: '2025-09-22',
      summary: '根抵当権順位変更',
    },
    geometry: createRectangle(BASE_LNG, BASE_LAT + ROW_STEP, WIDTH, HEIGHT),
    footprint: { x: 420, y: 260, width: 160, height: 160 },
  },
  {
    id: 'marunouchi-39-11',
    assetId: 3,
    label: '丸の内1-39-11',
    areaSqm: 180.12,
    landUse: '宅地',
    note: '所有者高齢',
    status: 'info',
    lastEvent: {
      occurredAt: '2025-08-10',
      summary: '固定資産税評価確認',
    },
    geometry: createRectangle(BASE_LNG - COL_STEP, BASE_LAT + ROW_STEP, WIDTH, HEIGHT),
    footprint: { x: 260, y: 260, width: 160, height: 160 },
  },
  {
    id: 'marunouchi-39-18',
    assetId: 3,
    label: '丸の内1-39-18',
    areaSqm: 180.12,
    landUse: '宅地',
    note: '私道跨ぎ',
    status: 'info',
    geometry: createRectangle(BASE_LNG, BASE_LAT - ROW_STEP, WIDTH, HEIGHT),
    footprint: { x: 420, y: 580, width: 160, height: 160 },
  },
  {
    id: 'marunouchi-39-17',
    assetId: 3,
    label: '丸の内1-39-17',
    areaSqm: 180.12,
    landUse: '宅地',
    note: '私道跨ぎ',
    status: 'info',
    geometry: createRectangle(BASE_LNG - COL_STEP, BASE_LAT - ROW_STEP, WIDTH, HEIGHT),
    footprint: { x: 260, y: 580, width: 160, height: 160 },
  },
  {
    id: 'marunouchi-39-6',
    assetId: 3,
    label: '丸の内1-39-6',
    areaSqm: 320.5,
    landUse: '宅地',
    note: '共同化の可能性',
    status: 'watch',
    alerts: ['大型再開発協議中'],
    lastEvent: {
      occurredAt: '2025-09-05',
      summary: '開発候補地ヒアリング',
    },
    geometry: createRectangle(BASE_LNG + COL_STEP, BASE_LAT - ROW_STEP, WIDTH * 1.4, HEIGHT),
    footprint: { x: 580, y: 580, width: 220, height: 160 },
  },
  {
    id: 'marunouchi-39-10',
    assetId: 3,
    label: '丸の内1-39-10',
    areaSqm: 198.33,
    landUse: '宅地',
    note: '所有者変更予定',
    status: 'watch',
    geometry: createRectangle(BASE_LNG + COL_STEP, BASE_LAT + ROW_STEP, WIDTH * 1.1, HEIGHT),
    footprint: { x: 580, y: 260, width: 180, height: 160 },
  },
  {
    id: 'marunouchi-39-8',
    assetId: 3,
    label: '丸の内1-39-8',
    areaSqm: 210.5,
    landUse: '宅地',
    note: '特記事項なし',
    status: 'info',
    geometry: createRectangle(BASE_LNG + COL_STEP, BASE_LAT, WIDTH * 1.1, HEIGHT),
    footprint: { x: 580, y: 420, width: 180, height: 160 },
  },
];

export const neighborParcelsByAsset = neighborSeed.reduce<Record<number, NeighborParcel[]>>(
  (acc, parcel) => {
    if (!acc[parcel.assetId]) {
      acc[parcel.assetId] = [];
    }
    acc[parcel.assetId].push(parcel);
    return acc;
  },
  {}
);

export default neighborParcelsByAsset;
