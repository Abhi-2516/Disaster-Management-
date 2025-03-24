
import { create } from 'zustand';
import { Incident } from '@/lib/types';

// Import mock data from the Feed page
const mockIncidents: Incident[] = [
  {
    id: '1',
    title: 'Flash Flooding on Main Street',
    description: 'Several blocks of Main Street are underwater after heavy rain. Cars are stuck and residents are evacuating.',
    type: 'flood',
    severity: 'high',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: 'Main Street, San Francisco, CA',
    },
    imageUrl: 'https://images.unsplash.com/photo-1618624103603-4c7607641b27?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    reportedBy: 'user123',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    verified: true,
  },
  {
    id: '2',
    title: 'Wildfire Approaching Southern Hills',
    description: 'A fast-moving wildfire is approaching the Southern Hills neighborhood. Evacuation orders are in place.',
    type: 'fire',
    severity: 'high',
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: 'Southern Hills, Los Angeles, CA',
    },
    imageUrl: 'https://images.unsplash.com/photo-1602010053227-5e8c145ea4e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    reportedBy: 'user456',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    verified: true,
  },
  {
    id: '3',
    title: 'Minor Earthquake Reported',
    description: 'A 3.5 magnitude earthquake was felt in the downtown area. No damage has been reported yet.',
    type: 'earthquake',
    severity: 'low',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: 'Downtown San Francisco, CA',
    },
    reportedBy: 'user789',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    verified: false,
  },
  {
    id: '4',
    title: 'Hurricane Warning Issued for Coastal Areas',
    description: 'A category 3 hurricane is expected to make landfall within 24 hours. Residents are advised to evacuate immediately.',
    type: 'hurricane',
    severity: 'high',
    location: {
      lat: 25.7617,
      lng: -80.1918,
      address: 'Miami Beach, FL',
    },
    imageUrl: 'https://images.unsplash.com/photo-1569282153428-3b34a71a0638?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    reportedBy: 'user101',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    verified: true,
  },
  {
    id: '5',
    title: 'Landslide Blocks Mountain Highway',
    description: 'A landslide has blocked both lanes of the mountain highway. No injuries reported but several vehicles are stranded.',
    type: 'landslide',
    severity: 'medium',
    location: {
      lat: 39.7392,
      lng: -104.9903,
      address: 'Mountain Highway 9, Denver, CO',
    },
    imageUrl: 'https://images.unsplash.com/photo-1626335500758-1f538def9ef3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80',
    reportedBy: 'user202',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    verified: true,
  },
  {
    id: '6',
    title: 'Tornado Touches Down in Rural Area',
    description: 'A tornado has been reported in the rural farmlands. Some property damage has occurred but no casualties reported yet.',
    type: 'tornado',
    severity: 'medium',
    location: {
      lat: 41.8781,
      lng: -87.6298,
      address: 'Rural Township, IL',
    },
    reportedBy: 'user303',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    verified: false,
  },
];

interface IncidentStore {
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, 'id' | 'timestamp' | 'reportedBy' | 'verified'>) => void;
  getIncidentById: (id: string) => Incident | undefined;
}

export const useIncidentStore = create<IncidentStore>((set, get) => ({
  incidents: mockIncidents,
  
  addIncident: (incidentData) => {
    const newIncident: Incident = {
      ...incidentData,
      id: Date.now().toString(),
      timestamp: new Date(),
      reportedBy: 'currentUser', // In a real app, this would be the logged-in user's ID
      verified: false,
    };
    
    set((state) => ({
      incidents: [newIncident, ...state.incidents]
    }));
    
    return newIncident;
  },
  
  getIncidentById: (id) => {
    return get().incidents.find(incident => incident.id === id);
  }
}));
