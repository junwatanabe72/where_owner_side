import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  List as ListIcon,
  Map as MapIcon,
} from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import type { FeatureCollection, Geometry } from 'geojson';
import Map from '../../../map';
import useAssetStore from '../../../store/assetStore';
import type { NeighborParcel, NeighborViewMode } from '../../../types/neighbor';
import type { LandProperty, MapLayers } from '../../../types/map';
import { customLayers } from '../../../map/constants';

const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN || process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || '';

if (mapboxToken) {
  mapboxgl.accessToken = mapboxToken;
}

type AssetStoreState = ReturnType<typeof useAssetStore.getState>;

type NeighborMonitorTabProps = {
  assetId: number;
};

type SimpleNeighborViewMode = Extract<NeighborViewMode, 'list' | 'map'>;

const VIEW_MODE_OPTIONS: Array<{
  id: SimpleNeighborViewMode;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hideOnMobile?: boolean;
}> = [
  { id: 'list', label: 'リスト', icon: ListIcon },
  { id: 'map', label: '地図', icon: MapIcon },
];

const statusLabel: Record<NeighborParcel['status'], string> = {
  subject: '対象地',
  watch: '要監視',
  info: '隣地',
};

const statusColor: Record<NeighborParcel['status'], string> = {
  subject: 'bg-rose-500/90 text-white',
  watch: 'bg-amber-500/90 text-white',
  info: 'bg-blue-500/90 text-white',
};

const mapFillColor: Record<NeighborParcel['status'], string> = {
  subject: '#F97375',
  watch: '#FACC15',
  info: '#60A5FA',
};

const mapStrokeColor: Record<NeighborParcel['status'], string> = {
  subject: '#B91C1C',
  watch: '#B45309',
  info: '#2563EB',
};

const DEFAULT_CENTER: [number, number] = [139.7620533, 35.6800181];
const MAP_PLACEHOLDER_PROPERTIES: LandProperty[] = [];
const MAP_LAYER_VISIBILITY: MapLayers = {
  youto: false,
  admin: false,
  koudo: false,
  bouka: false,
  height: false,
  boundary: false,
  diff: false,
  night: false,
  potential: false,
};

const formatArea = (value: number) => `${value.toLocaleString()}㎡`;

const formatDate = (value?: string) => {
  if (!value) return '—';
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } catch (error) {
    return value;
  }
};

const NeighborMonitorTab: React.FC<NeighborMonitorTabProps> = ({ assetId }) => {
  const selectParcels = useCallback((state: AssetStoreState) => state.getNeighborParcels(assetId), [assetId]);
  const selectLoading = useCallback((state: AssetStoreState) => state.getNeighborLoading(assetId), [assetId]);
  const selectError = useCallback((state: AssetStoreState) => state.getNeighborError(assetId), [assetId]);

  const parcels = useAssetStore(selectParcels);
  const isLoading = useAssetStore(selectLoading);
  const error = useAssetStore(selectError);

  const sortedParcels = useMemo(() => {
    return [...parcels].sort((a, b) => a.label.localeCompare(b.label, 'ja'));
  }, [parcels]);

  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [hoveredParcelId, setHoveredParcelId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<SimpleNeighborViewMode>('list');

  const effectiveSelectedParcelId = useMemo(() => {
    if (selectedParcelId && sortedParcels.some((parcel) => parcel.id === selectedParcelId)) {
      return selectedParcelId;
    }
    return sortedParcels[0]?.id ?? null;
  }, [selectedParcelId, sortedParcels]);

  const handleSelect = useCallback((parcelId: string) => {
    setSelectedParcelId(parcelId);
  }, []);

  const handleHover = useCallback((parcelId: string | null) => {
    setHoveredParcelId(parcelId);
  }, []);

  const renderListView = () => (
    <NeighborParcelTable
      parcels={sortedParcels}
      selectedParcelId={effectiveSelectedParcelId}
      hoveredParcelId={hoveredParcelId}
      onSelect={handleSelect}
      onHover={handleHover}
    />
  );

  const renderMapView = () => (
    <div>
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <h3 className="text-sm font-semibold text-slate-800">地図ビュー</h3>
        <button
          type="button"
          onClick={() => setViewMode('list')}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>一覧に戻る</span>
        </button>
      </div>
      <div className="px-5 pb-5">
        <NeighborParcelMap
          parcels={sortedParcels}
          selectedParcelId={effectiveSelectedParcelId}
          hoveredParcelId={hoveredParcelId}
          onSelect={handleSelect}
          onHover={handleHover}
        />
      </div>
    </div>
  );

  let content: React.ReactNode = null;
  let showLegend = false;

  if (isLoading) {
    content = <NeighborLoading />;
  } else if (error) {
    content = <NeighborError message={error} />;
  } else if (!sortedParcels.length) {
    content = <NeighborEmpty />;
  } else {
    showLegend = true;
    content = viewMode === 'map' ? renderMapView() : renderListView();
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">隣接土地監視</h2>
          <p className="mt-1 text-sm text-slate-500">対象地と隣接地の状況を一覧と地図で確認できます。</p>
        </div>
        <ViewModeToggle viewMode={viewMode} onChange={setViewMode} />
      </div>
      <div className="border-b border-slate-200">
        {content}
      </div>
      {showLegend ? (
        <div className="bg-slate-50 px-5 py-3">
          <NeighborLegend />
        </div>
      ) : null}
    </section>
  );
};

type NeighborParcelTableProps = {
  parcels: NeighborParcel[];
  selectedParcelId: string | null;
  hoveredParcelId: string | null;
  onSelect: (parcelId: string) => void;
  onHover: (parcelId: string | null) => void;
};

const NeighborParcelTable: React.FC<NeighborParcelTableProps> = ({ parcels, selectedParcelId, hoveredParcelId, onSelect, onHover }) => (
  <div>
    <div className="border-b border-slate-200 px-5 py-4">
      <h3 className="text-sm font-semibold text-slate-800">隣接筆一覧</h3>
    </div>
    <div className="overflow-x-auto px-5 pb-5">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left font-medium text-slate-500">地番</th>
            <th scope="col" className="px-4 py-3 text-left font-medium text-slate-500">地積(㎡)</th>
            <th scope="col" className="px-4 py-3 text-left font-medium text-slate-500">用途</th>
            <th scope="col" className="px-4 py-3 text-left font-medium text-slate-500">備考</th>
            <th scope="col" className="px-4 py-3 text-left font-medium text-slate-500">最終イベント</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {parcels.map((parcel) => {
            const isSelected = parcel.id === selectedParcelId;
            const isHovered = parcel.id === hoveredParcelId;
            return (
              <tr
                key={parcel.id}
                className={`${isSelected ? 'bg-blue-50/80' : isHovered ? 'bg-blue-50/40' : 'hover:bg-slate-50'} cursor-pointer transition`}
                onClick={() => onSelect(parcel.id)}
                onMouseEnter={() => onHover(parcel.id)}
                onMouseLeave={() => onHover(null)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${statusColor[parcel.status]}`}>
                      {statusLabel[parcel.status]}
                    </span>
                    <span className="font-medium text-slate-800">{parcel.label}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{formatArea(parcel.areaSqm)}</td>
                <td className="px-4 py-3 text-slate-600">{parcel.landUse}</td>
                <td className="px-4 py-3 text-slate-600">
                  <div className="flex items-center gap-2">
                    {parcel.alerts?.length ? <AlertCircle className="h-4 w-4 text-amber-500" /> : null}
                    <span>{parcel.note ?? '—'}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {parcel.lastEvent ? (
                    <div>
                      <div className="text-xs text-slate-400">{formatDate(parcel.lastEvent.occurredAt)}</div>
                      <div>{parcel.lastEvent.summary}</div>
                    </div>
                  ) : (
                    <span>—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

type NeighborParcelMapProps = {
  parcels: NeighborParcel[];
  selectedParcelId: string | null;
  hoveredParcelId: string | null;
  onSelect: (parcelId: string) => void;
  onHover: (parcelId: string | null) => void;
};

const SOURCE_ID = 'neighbor-monitor-source';
const FILL_LAYER_ID = 'neighbor-monitor-fill';
const LINE_LAYER_ID = 'neighbor-monitor-outline';
const LABEL_LAYER_ID = 'neighbor-monitor-label';

const NeighborParcelMap: React.FC<NeighborParcelMapProps> = ({ parcels, selectedParcelId, hoveredParcelId, onSelect, onHover }) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapReadyRef = useRef(false);
  const hoverStateRef = useRef<string | null>(null);
  const selectedStateRef = useRef<string | null>(null);
  const previousSelectionRef = useRef<string | null>(null);
  const initialFitRef = useRef(false);
  const styleHandlerRef = useRef<(() => void) | null>(null);
  const eventsBoundRef = useRef(false);

  const featureCollection = useMemo(() => buildFeatureCollection(parcels), [parcels]);

  const ensureSourceAndLayers = useCallback((map: mapboxgl.Map) => {
    if (!map.getSource(SOURCE_ID)) {
      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        promoteId: 'id',
      });
    }

    if (!map.getLayer(FILL_LAYER_ID)) {
      map.addLayer({
        id: FILL_LAYER_ID,
        type: 'fill',
        source: SOURCE_ID,
        paint: {
          'fill-color': ['match', ['get', 'status'], 'subject', mapFillColor.subject, 'watch', mapFillColor.watch, mapFillColor.info],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            0.82,
            ['boolean', ['feature-state', 'hover'], false],
            0.7,
            0.55,
          ],
        },
      });
    }

    if (!map.getLayer(LINE_LAYER_ID)) {
      map.addLayer({
        id: LINE_LAYER_ID,
        type: 'line',
        source: SOURCE_ID,
        paint: {
          'line-width': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            4,
            ['boolean', ['feature-state', 'hover'], false],
            3,
            2,
          ],
          'line-color': ['match', ['get', 'status'], 'subject', mapStrokeColor.subject, 'watch', mapStrokeColor.watch, mapStrokeColor.info],
          'line-opacity': 0.85,
        },
      });
    }

    if (!map.getLayer(LABEL_LAYER_ID)) {
      map.addLayer({
        id: LABEL_LAYER_ID,
        type: 'symbol',
        source: SOURCE_ID,
        layout: {
          'text-field': ['get', 'label'],
          'text-size': 12,
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.6],
        },
        paint: {
          'text-color': '#1f2937',
        },
      });
    }
  }, []);

  const hideBaseLayers = useCallback((map: mapboxgl.Map) => {
    if (!mapReadyRef.current) {
      return;
    }

    Object.values(customLayers).forEach((layerGroup) => {
      Object.values(layerGroup).forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', 'none');
        }
      });
    });

    // map.setFog で Mapbox GL JS v3.0 以降に例外が発生するケースがあるため一時的に無効化
  }, []);

  const setHoverStateOnMap = useCallback((id: string | null) => {
    const map = mapRef.current;
    if (!map || !map.getSource(SOURCE_ID)) return;
    const previous = hoverStateRef.current;
    if (previous && previous !== id) {
      try {
        map.setFeatureState({ source: SOURCE_ID, id: previous }, { hover: false });
      } catch (error) {
        // no-op
      }
    }
    if (id && previous !== id) {
      try {
        map.setFeatureState({ source: SOURCE_ID, id }, { hover: true });
      } catch (error) {
        // no-op
      }
    }
    hoverStateRef.current = id;
  }, []);

  const setSelectedStateOnMap = useCallback((id: string | null) => {
    const map = mapRef.current;
    if (!map || !map.getSource(SOURCE_ID)) return;
    const previous = selectedStateRef.current;
    if (previous && previous !== id) {
      try {
        map.setFeatureState({ source: SOURCE_ID, id: previous }, { selected: false });
      } catch (error) {
        // no-op
      }
    }
    if (id) {
      try {
        map.setFeatureState({ source: SOURCE_ID, id }, { selected: true });
      } catch (error) {
        // no-op
      }
    }
    selectedStateRef.current = id;
  }, []);

  const refreshFeatureCollection = useCallback(() => {
    const map = mapRef.current;
    if (!map || !mapReadyRef.current) return;

    ensureSourceAndLayers(map);
    const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined;
    if (!source) return;

    source.setData(featureCollection);

    if (!initialFitRef.current) {
      const bounds = getCollectionBounds(featureCollection);
      if (bounds) {
        map.fitBounds(bounds, { padding: 80, duration: 0, maxZoom: 18 });
      } else {
        map.easeTo({ center: DEFAULT_CENTER, zoom: 16, duration: 0 });
      }
      initialFitRef.current = true;
    }

    if (selectedStateRef.current) {
      setSelectedStateOnMap(selectedStateRef.current);
    }
    if (hoverStateRef.current) {
      setHoverStateOnMap(hoverStateRef.current);
    }
  }, [ensureSourceAndLayers, featureCollection, setHoverStateOnMap, setSelectedStateOnMap]);

  useEffect(() => {
    initialFitRef.current = false;
  }, [featureCollection]);

  useEffect(() => {
    refreshFeatureCollection();
  }, [refreshFeatureCollection]);

  useEffect(() => {
    setHoverStateOnMap(hoveredParcelId);
  }, [hoveredParcelId, setHoverStateOnMap]);

  useEffect(() => {
    setSelectedStateOnMap(selectedParcelId);
    const map = mapRef.current;
    if (!map || !selectedParcelId) {
      previousSelectionRef.current = selectedParcelId;
      return;
    }

    const targetParcel = parcels.find((parcel) => parcel.id === selectedParcelId);
    const bounds = targetParcel?.geometry ? getGeometryBounds(targetParcel.geometry) : null;
    if (bounds) {
      map.fitBounds(bounds, {
        padding: 120,
        maxZoom: 18,
        duration: previousSelectionRef.current ? 600 : 0,
      });
    }
    previousSelectionRef.current = selectedParcelId;
  }, [selectedParcelId, parcels, setSelectedStateOnMap]);

  const handleMouseEnter = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    map.getCanvas().style.cursor = 'pointer';
  }, []);

  const handleMouseLeave = useCallback(() => {
    const map = mapRef.current;
    if (map) {
      map.getCanvas().style.cursor = '';
    }
    hoverStateRef.current = null;
    setHoverStateOnMap(null);
    onHover(null);
  }, [onHover, setHoverStateOnMap]);

  const handleMouseMove = useCallback(
    (event: mapboxgl.MapLayerMouseEvent) => {
      const featureId = event.features?.[0]?.id;
      if (typeof featureId === 'string') {
        hoverStateRef.current = featureId;
        onHover(featureId);
        setHoverStateOnMap(featureId);
      }
    },
    [onHover, setHoverStateOnMap],
  );

  const handleClick = useCallback(
    (event: mapboxgl.MapLayerMouseEvent) => {
      const featureId = event.features?.[0]?.id;
      if (typeof featureId === 'string') {
        selectedStateRef.current = featureId;
        onSelect(featureId);
      }
    },
    [onSelect],
  );

  const handleMapReady = useCallback(
    (map: mapboxgl.Map) => {
      mapRef.current = map;

      const onStyleLoad = () => {
        mapReadyRef.current = true;
        ensureSourceAndLayers(map);
        hideBaseLayers(map);
        refreshFeatureCollection();
      };

      if (map.isStyleLoaded()) {
        onStyleLoad();
      }
      map.on('style.load', onStyleLoad);
      styleHandlerRef.current = () => {
        map.off('style.load', onStyleLoad);
      };

      if (!eventsBoundRef.current) {
        map.on('mouseenter', FILL_LAYER_ID, handleMouseEnter);
        map.on('mouseleave', FILL_LAYER_ID, handleMouseLeave);
        map.on('mousemove', FILL_LAYER_ID, handleMouseMove);
        map.on('click', FILL_LAYER_ID, handleClick);
        eventsBoundRef.current = true;
      }
    },
    [ensureSourceAndLayers, hideBaseLayers, refreshFeatureCollection, handleMouseEnter, handleMouseLeave, handleMouseMove, handleClick],
  );

  useEffect(() => {
    return () => {
      const map = mapRef.current;
      if (!map) return;
      if (styleHandlerRef.current) {
        styleHandlerRef.current();
        styleHandlerRef.current = null;
      }
      if (eventsBoundRef.current) {
        map.off('mouseenter', FILL_LAYER_ID, handleMouseEnter);
        map.off('mouseleave', FILL_LAYER_ID, handleMouseLeave);
        map.off('mousemove', FILL_LAYER_ID, handleMouseMove);
        map.off('click', FILL_LAYER_ID, handleClick);
        eventsBoundRef.current = false;
      }
      mapReadyRef.current = false;
    };
  }, [handleMouseEnter, handleMouseLeave, handleMouseMove, handleClick]);

  if (!mapboxToken) {
    return (
      <NeighborParcelStaticMap
        parcels={parcels}
        selectedParcelId={selectedParcelId}
        hoveredParcelId={hoveredParcelId}
        onSelect={onSelect}
        onHover={onHover}
        reason="Mapbox のアクセストークンが未設定のため静的表示"
      />
    );
  }

  return (
    <div className="relative h-[420px] w-full sm:h-[500px] md:h-[560px]">
      <Map
        currentStore={MAP_PLACEHOLDER_PROPERTIES}
        isSample={false}
        mapMode="map"
        initialCenter={DEFAULT_CENTER}
        mapLayers={MAP_LAYER_VISIBILITY}
        onMapReady={handleMapReady}
      />
      <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-lg bg-white/90 px-4 py-2 text-xs text-slate-500 shadow">
        対象地を赤、要監視地を黄、その他の隣地を青で表示しています。ポリゴンをクリックすると詳細を表示します。
      </div>
    </div>
  );
};

type NeighborParcelStaticMapProps = NeighborParcelMapProps & { reason: string };

const NeighborParcelStaticMap: React.FC<NeighborParcelStaticMapProps> = ({ parcels, selectedParcelId, hoveredParcelId, onSelect, onHover, reason }) => {
  const viewBoxWidth = 960;
  const viewBoxHeight = 720;
  const bottomMessage = reason.includes('アクセストークン')
    ? 'Mapbox のアクセストークンを設定すると実地図が表示されます。'
    : 'ジオメトリを設定すると実地図が表示されます。';

  const renderParcel = (parcel: NeighborParcel) => {
    if (!parcel.footprint) return null;
    const isSelected = parcel.id === selectedParcelId;
    const isHovered = parcel.id === hoveredParcelId;
    const fill = mapFillColor[parcel.status];
    const stroke = mapStrokeColor[parcel.status];
    const opacity = isSelected ? 0.95 : isHovered ? 0.9 : 0.75;

    return (
      <g
        key={parcel.id}
        className="cursor-pointer"
        onClick={() => onSelect(parcel.id)}
        onMouseEnter={() => onHover(parcel.id)}
        onMouseLeave={() => onHover(null)}
      >
        <rect
          x={parcel.footprint.x}
          y={parcel.footprint.y}
          width={parcel.footprint.width}
          height={parcel.footprint.height}
          rx={12}
          ry={12}
          fill={fill}
          fillOpacity={opacity}
          stroke={stroke}
          strokeWidth={isSelected ? 8 : 4}
          strokeOpacity={isSelected ? 0.9 : isHovered ? 0.85 : 0.7}
        />
        <text
          x={parcel.footprint.x + parcel.footprint.width / 2}
          y={parcel.footprint.y + parcel.footprint.height / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill={isSelected ? '#111827' : '#0f172a'}
          fontSize={parcel.status === 'subject' ? 24 : 20}
          fontWeight={parcel.status === 'subject' ? 700 : 600}
        >
          {parcel.label.split('-').slice(-1)[0]}
        </text>
        {parcel.alerts?.length ? (
          <g transform={`translate(${parcel.footprint.x + parcel.footprint.width - 12}, ${parcel.footprint.y - 18})`}>
            <rect width={120} height={34} rx={10} ry={10} fill="#F8FAFC" stroke="#F97316" strokeWidth={2} />
            <text x={60} y={21} textAnchor="middle" fontSize={14} fill="#F97316" fontWeight={600}>
              {parcel.alerts[0]}
            </text>
          </g>
        ) : null}
      </g>
    );
  };

  return (
    <div className="relative h-[420px] w-full">
      <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="h-full w-full">
        <defs>
          <linearGradient id="neighbor-sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#BAE6FD" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <rect width={viewBoxWidth} height={viewBoxHeight} fill="url(#neighbor-sky)" />
        <rect x={0} y={320} width={viewBoxWidth} height={96} fill="#CBD5F5" fillOpacity={0.6} />
        <rect x={300} y={0} width={96} height={viewBoxHeight} fill="#CBD5F5" fillOpacity={0.6} />
        <rect x={600} y={0} width={80} height={viewBoxHeight} fill="#CBD5F5" fillOpacity={0.6} />
        {parcels.map(renderParcel)}
      </svg>
      <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-lg bg-white/90 px-4 py-2 text-xs text-slate-500 shadow">
        {bottomMessage}
      </div>
      <div className="pointer-events-none absolute right-4 top-4 rounded bg-white/90 px-3 py-1 text-[11px] text-slate-500 shadow">
        {reason}
      </div>
    </div>
  );
};

type NeighborFeatureProperties = {
  id: string;
  label: string;
  status: NeighborParcel['status'];
  alerts: string[];
};

const buildFeatureCollection = (parcels: NeighborParcel[]): FeatureCollection<Geometry, NeighborFeatureProperties> => ({
  type: 'FeatureCollection',
  features: parcels
    .filter((parcel) => parcel.geometry)
    .map((parcel) => ({
      type: 'Feature' as const,
      id: parcel.id,
      geometry: parcel.geometry!,
      properties: {
        id: parcel.id,
        label: parcel.label,
        status: parcel.status,
        alerts: parcel.alerts ?? [],
      },
    })),
});

const extendBoundsWithGeometry = (base: mapboxgl.LngLatBounds | null, geometry?: Geometry): mapboxgl.LngLatBounds | null => {
  let bounds = base;
  if (!geometry) return bounds;

  const addPoint = (point: [number, number]) => {
    if (!bounds) {
      bounds = new mapboxgl.LngLatBounds(point, point);
    } else {
      bounds.extend(point);
    }
  };

  const traverse = (coords: unknown): void => {
    if (!Array.isArray(coords)) return;
    if (typeof coords[0] === 'number') {
      addPoint(coords as [number, number]);
    } else {
      (coords as unknown[]).forEach(traverse);
    }
  };

  const handleGeometry = (geom: Geometry) => {
    if (geom.type === 'GeometryCollection') {
      geom.geometries.forEach(handleGeometry);
    } else if ('coordinates' in geom) {
      traverse((geom as { coordinates: unknown }).coordinates);
    }
  };

  handleGeometry(geometry);
  return bounds ?? null;
};

const getGeometryBounds = (geometry?: Geometry): mapboxgl.LngLatBounds | null => {
  return extendBoundsWithGeometry(null, geometry);
};

const getCollectionBounds = (collection: FeatureCollection<Geometry, NeighborFeatureProperties>): mapboxgl.LngLatBounds | null => {
  return collection.features.reduce<mapboxgl.LngLatBounds | null>((current, feature) => {
    return extendBoundsWithGeometry(current, feature.geometry);
  }, null);
};

const NeighborLoading: React.FC = () => (
  <div className="px-5 py-5">
    <div className="space-y-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="h-12 animate-pulse rounded-lg bg-slate-100" />
      ))}
    </div>
  </div>
);

const NeighborEmpty: React.FC = () => (
  <div className="px-5 py-8 text-center text-sm text-slate-500">
    <p>隣接筆情報が登録されていません。境界データを追加するとここに表示されます。</p>
  </div>
);

const NeighborError: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-rose-50 px-5 py-5 text-sm text-rose-700">
    <div className="flex items-start gap-3">
      <AlertCircle className="mt-0.5 h-5 w-5" />
      <div>
        <div className="font-semibold">隣接データの取得に失敗しました。</div>
        <div className="mt-1 text-xs text-rose-600">{message}</div>
      </div>
    </div>
  </div>
);

const NeighborLegend: React.FC = () => (
  <div className="flex flex-wrap gap-4 text-xs text-slate-600">
    <LegendItem colorClass="bg-rose-500" label="対象地" description="監視対象の基準地。" />
    <LegendItem colorClass="bg-amber-500" label="要監視" description="重要イベントが発生・予定されている隣地。" />
    <LegendItem colorClass="bg-blue-500" label="隣地" description="参考情報として把握している周辺地。" />
  </div>
);

const LegendItem: React.FC<{ colorClass: string; label: string; description: string }> = ({ colorClass, label, description }) => (
  <div className="flex items-start gap-2">
    <span className={`mt-1 inline-block h-3 w-3 rounded-full ${colorClass}`} />
    <div>
      <div className="font-medium text-slate-700">{label}</div>
      <div className="text-[11px] text-slate-500">{description}</div>
    </div>
  </div>
);

const ViewModeToggle: React.FC<{ viewMode: SimpleNeighborViewMode; onChange: (mode: SimpleNeighborViewMode) => void }> = ({ viewMode, onChange }) => (
  <div className="flex items-center gap-2">
    {VIEW_MODE_OPTIONS.map(({ id, label, icon: Icon, hideOnMobile }) => (
      <button
        key={id}
        type="button"
        onClick={() => onChange(id)}
        className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition ${
          viewMode === id
            ? 'border-blue-500 bg-blue-50 text-blue-600 shadow-sm'
            : 'border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
        } ${hideOnMobile ? 'hidden lg:inline-flex' : ''}`}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </button>
    ))}
  </div>
);

export default NeighborMonitorTab;
