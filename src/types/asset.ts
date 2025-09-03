export interface Asset {
  id: number;
  address: string;
  lat: number;
  lng: number;
  area: number;
  owner: string;
  status: string;
  memo: string;
  valuationMedian?: number;
}

export interface RegistryAlert {
  id: number;
  parcel: string;
  change: string;
  date: string;
  alertLevel: 'low' | 'medium' | 'high';
}