
import { useState } from 'react';
import { Incident } from '@/lib/types';
import IncidentCard from './IncidentCard';
import RangeSelector from './RangeSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useIncidentStore } from '@/lib/store';

interface IncidentFeedProps {
  userLocation?: { lat: number; lng: number };
}

const IncidentFeed = ({ userLocation }: IncidentFeedProps) => {
  const { incidents } = useIncidentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [radius, setRadius] = useState(50);
  const [incidentType, setIncidentType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  
  // Filter incidents based on search, radius, and type
  const filteredIncidents = incidents.filter(incident => {
    // Search filter
    const matchesSearch = 
      searchTerm === '' || 
      incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const matchesType = 
      incidentType === 'all' || 
      incident.type === incidentType;
    
    // Radius filter (only if userLocation is available and radius is not global)
    let matchesRadius = true;
    if (userLocation && radius !== -1) {
      const distance = calculateDistance(
        userLocation.lat, 
        userLocation.lng,
        incident.location.lat,
        incident.location.lng
      );
      matchesRadius = distance <= radius;
    }
    
    return matchesSearch && matchesType && matchesRadius;
  });
  
  // Sort incidents
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    if (sortBy === 'recent') {
      return b.timestamp.getTime() - a.timestamp.getTime();
    } else if (sortBy === 'severity') {
      const severityOrder = { high: 3, medium: 2, low: 1 };
      // @ts-ignore
      return severityOrder[b.severity] - severityOrder[a.severity];
    }
    return 0;
  });

  // Calculate distance between two points (Haversine formula)
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  }
  
  function deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 bg-background/80 focus:bg-background"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-lg p-4">
            <RangeSelector
              value={radius}
              onChange={setRadius}
              showGlobal={true}
            />
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center mb-4">
              <Filter className="mr-2 h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Filter By Type</h3>
            </div>
            
            <Select 
              value={incidentType} 
              onValueChange={setIncidentType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="fire">Fire</SelectItem>
                <SelectItem value="earthquake">Earthquake</SelectItem>
                <SelectItem value="hurricane">Hurricane</SelectItem>
                <SelectItem value="tornado">Tornado</SelectItem>
                <SelectItem value="landslide">Landslide</SelectItem>
                <SelectItem value="tsunami">Tsunami</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="glass rounded-lg p-4">
            <div className="flex items-center mb-4">
              <Filter className="mr-2 h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Sort By</h3>
            </div>
            
            <Select 
              value={sortBy} 
              onValueChange={setSortBy}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="severity">Severity (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {sortedIncidents.length > 0 ? (
        <>
          <div className="text-sm text-muted-foreground">
            Showing {sortedIncidents.length} incident{sortedIncidents.length !== 1 ? 's' : ''}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedIncidents.map((incident) => (
              <div key={incident.id} className="animate-fade-in">
                <IncidentCard incident={incident} />
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-lg font-medium mb-2">No incidents match your filters</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your search criteria or expanding your radius
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setIncidentType('all');
              setRadius(-1);
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default IncidentFeed;
