declare global {
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
    address: string;
    area: number;
  }
}

export {};