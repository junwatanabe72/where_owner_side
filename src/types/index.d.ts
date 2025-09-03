interface LandProperty {
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
  address?: string;
  price?: number;
  area?: number;
}

type LayerCategories = 'youto' | 'bouka' | 'koudo' | 'height';

interface CustomLayers {
  youto: Record<string, string>;
  bouka: Record<string, string>;
  koudo: Record<string, string>;
  height: Record<string, string>;
}