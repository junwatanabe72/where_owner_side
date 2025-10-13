export interface Asset {
  /**
   * Indicates whether the asset is publicly visible.
   * true → 公開, false → 非公開. Optional; defaults to public when omitted.
   */
  isPublic?: boolean;
  id: number;
  address: string;
  lat: number;
  lng: number;
  area: number;
  owner: string;
  status: string;
  memo: string;
  zoning?: string;
  valuationMedian?: number;
  name?: string;
  valuationMin?: number;
  valuationMax?: number;
  pricePerSqm?: number;
  coverageRatio?: number;
  floorAreaRatio?: number;
  nearestStation?: string;
  stationDistance?: number;
}

export interface RegistryAlert {
  id: string | number;
  parcel: string;
  change: string;
  date: string;
  alertLevel?: "low" | "medium" | "high";
  note?: string;
}
