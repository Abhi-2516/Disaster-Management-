
export type Severity = 'high' | 'medium' | 'low';

export type IncidentType = 
  | 'flood' 
  | 'fire' 
  | 'earthquake' 
  | 'hurricane' 
  | 'tornado' 
  | 'landslide'
  | 'tsunami'
  | 'other';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  type: IncidentType;
  severity: Severity;
  location: Location;
  imageUrl?: string;
  reportedBy: string;
  timestamp: Date;
  verified: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface FilterOptions {
  radius: number; // in kilometers
  types: IncidentType[];
  severity: Severity[];
  timeframe: 'day' | 'week' | 'month' | 'all';
}
