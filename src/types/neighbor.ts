import type { Feature, FeatureCollection, Geometry } from 'geojson';

export type NeighborParcelStatus = 'subject' | 'watch' | 'info';

export type NeighborParcelEvent = {
  occurredAt: string;
  summary: string;
};

export type NeighborParcel = {
  id: string;
  assetId: number;
  label: string;
  areaSqm: number;
  landUse: string;
  note?: string;
  status: NeighborParcelStatus;
  alerts?: string[];
  lastEvent?: NeighborParcelEvent;
  geometry?: Geometry;
  footprint?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type NeighborParcelFeature = Feature<Geometry, NeighborParcel>;

export type NeighborParcelCollection = FeatureCollection<Geometry, NeighborParcel>;

export type NeighborViewMode = 'list' | 'map' | 'split';
