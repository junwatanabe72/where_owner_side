export type MapMode = 'map' | 'sat';

export interface MapLayers {
  youto: boolean;
  admin: boolean;
  koudo: boolean;
  bouka: boolean;
  height: boolean;
  boundary: boolean;
  diff: boolean;
  night: boolean;
  potential: boolean;
}

export interface LandProperty {
  nearStation: Array<{
    min: number;
    geometry: {
      lat: number;
      lng: number;
    };
  }>;
  wood: {
    originalRaito: number;
  };
  address: string;
  area: number;
}