
import { useEffect, useRef, useState } from 'react';
import { Incident } from '@/lib/types';
import RangeSelector from './RangeSelector';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Flame, 
  Waves, 
  AlertTriangle, 
  Wind, 
  CloudLightning,
  Mountain 
} from 'lucide-react';

// Mock map view component until we can add a real mapping library
const MapView = ({ incidents }: { incidents: Incident[] }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(50);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);

  // Mock map initialization and markers
  useEffect(() => {
    if (!mapRef.current) return;
    
    console.log('Map would initialize here with', incidents.length, 'incidents');
    // In a real implementation, we would initialize the map here 
    // and add markers for each incident
    
    // Mock setting user's location
    const mockSetUserLocation = () => {
      console.log('Setting user location');
    };
    
    mockSetUserLocation();
  }, [incidents]);

  // Get icon based on incident type
  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'fire':
        return <Flame className="h-5 w-5 text-emergency-red" />;
      case 'flood':
        return <Waves className="h-5 w-5 text-emergency-blue" />;
      case 'earthquake':
        return <AlertTriangle className="h-5 w-5 text-emergency-amber" />;
      case 'hurricane':
      case 'tornado':
        return <Wind className="h-5 w-5 text-primary" />;
      case 'landslide':
        return <Mountain className="h-5 w-5 text-emergency-amber" />;
      case 'tsunami':
        return <Waves className="h-5 w-5 text-emergency-blue" />;
      default:
        return <CloudLightning className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <div className="relative h-full w-full min-h-[500px] flex flex-col">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 glass rounded-lg p-4 shadow-md max-w-xs animate-fade-in">
        <RangeSelector 
          value={radius} 
          onChange={setRadius} 
          className="w-full" 
        />
      </div>
      
      {/* Map Container - This would be replaced with an actual map */}
      <div 
        ref={mapRef} 
        className="flex-1 bg-secondary/30 relative overflow-hidden rounded-lg border border-border"
      >
        {/* Mock Map UI */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-transparent to-background/20">
          <div className="text-center">
            <p className="text-muted-foreground mb-3">Interactive map would render here</p>
            <p className="text-sm text-muted-foreground mb-6">
              With {incidents.length} incidents within {radius === -1 ? 'global range' : `${radius}km radius`}
            </p>
          </div>
        </div>
        
        {/* Mock Incident Markers */}
        <div className="absolute inset-0">
          {incidents.map((incident, index) => (
            <button
              key={incident.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                activeIncident?.id === incident.id 
                  ? 'z-30 scale-125' 
                  : 'z-20 hover:scale-110'
              }`}
              style={{ 
                left: `${Math.random() * 80 + 10}%`, 
                top: `${Math.random() * 80 + 10}%`,
                animationDelay: `${index * 100}ms`
              }}
              onClick={() => setActiveIncident(incident)}
            >
              <div className={`glass rounded-full p-2 border-2 ${
                incident.severity === 'high' 
                  ? 'border-emergency-red' 
                  : incident.severity === 'medium' 
                    ? 'border-emergency-amber' 
                    : 'border-emergency-blue'
              }`}>
                {getIncidentIcon(incident.type)}
              </div>
              
              {/* Pulse animation for high severity */}
              {incident.severity === 'high' && (
                <span className="absolute inset-0 rounded-full animate-ping bg-emergency-red/30"></span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Active Incident Information */}
      {activeIncident && (
        <div className="absolute bottom-4 left-4 right-4 z-20 glass rounded-lg p-4 shadow-lg animate-slide-up max-w-md mx-auto">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">{activeIncident.title}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={() => setActiveIncident(null)}
            >
              ✕
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {activeIncident.description}
          </p>
          
          <div className="flex items-center text-sm mb-2">
            <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
            <span>
              {activeIncident.location.address || 
                `${activeIncident.location.lat.toFixed(4)}, ${activeIncident.location.lng.toFixed(4)}`}
            </span>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Button size="sm" className="w-full">View Details</Button>
            <Button size="sm" variant="outline" className="w-full">Get Directions</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
