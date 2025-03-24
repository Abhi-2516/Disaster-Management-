
import { useEffect, useRef, useState } from 'react';
import { Incident } from '@/lib/types';
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
import { toast } from 'sonner';

interface GoogleMapViewProps {
  incidents: Incident[];
  onIncidentSelect?: (incident: Incident) => void;
}

const GoogleMapView = ({ incidents, onIncidentSelect }: GoogleMapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);
  const googleMapsApiKey = "AIzaSyC3rhSVUC5lxLVl1NYBb526puVFv-gQb3I"; // Google Maps API key

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

  // Get icon URL for Google Maps marker
  const getMarkerIconUrl = (type: string, severity: string) => {
    const iconColor = severity === 'high' ? 'red' : severity === 'medium' ? 'orange' : 'blue';
    return `http://maps.google.com/mapfiles/ms/icons/${iconColor}-dot.png`;
  };

  // Initialize the map
  useEffect(() => {
    if (!mapRef.current) return;

    // Load Google Maps API script
    const loadGoogleMapsApi = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initializeMap();
      };
      
      script.onerror = () => {
        toast.error('Failed to load Google Maps. Please try again later.');
      };
      
      document.head.appendChild(script);
    };

    // Check if Google Maps API is already loaded
    if (typeof window.google === 'undefined' || typeof window.google.maps === 'undefined') {
      loadGoogleMapsApi();
    } else {
      initializeMap();
    }

    function initializeMap() {
      if (!mapRef.current || typeof window.google === 'undefined') return;

      const mapOptions: google.maps.MapOptions = {
        center: { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
        zoom: 4,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
          }
        ]
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);

      // Try to get user's location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            newMap.setCenter(userLocation);
            newMap.setZoom(8);
          },
          () => {
            // If user denies location access, keep default center
            console.log('User denied geolocation');
          }
        );
      }
    }

    return () => {
      // Clean up markers when component unmounts
      markers.forEach(marker => marker.setMap(null));
    };
  }, []);

  // Add markers for incidents
  useEffect(() => {
    if (!map || typeof window.google === 'undefined') return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    const newMarkers: google.maps.Marker[] = [];

    // Add markers for each incident
    incidents.forEach(incident => {
      const marker = new window.google.maps.Marker({
        position: { lat: incident.location.lat, lng: incident.location.lng },
        map: map,
        title: incident.title,
        icon: getMarkerIconUrl(incident.type, incident.severity),
        animation: window.google.maps.Animation.DROP
      });

      // Create info window for the marker
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="max-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">${incident.title}</h3>
            <p style="font-size: 0.9em; margin-bottom: 5px;">${incident.description.substring(0, 100)}${incident.description.length > 100 ? '...' : ''}</p>
            <p style="font-size: 0.8em; color: #666;">Reported: ${incident.timestamp.toLocaleString()}</p>
          </div>
        `
      });

      // Add click event to the marker
      marker.addListener('click', () => {
        // Close any open info windows
        newMarkers.forEach(m => {
          window.google.maps.event.clearListeners(m, 'closeclick');
        });

        // Open this info window
        infoWindow.open(map, marker);

        // Set active incident
        setActiveIncident(incident);
        if (onIncidentSelect) {
          onIncidentSelect(incident);
        }

        // Add close event to info window
        infoWindow.addListener('closeclick', () => {
          setActiveIncident(null);
        });
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // Fit bounds to show all markers if there are any
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        bounds.extend(marker.getPosition()!);
      });
      map.fitBounds(bounds);
      
      // Don't zoom in too far
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom()! > 15) {
          map.setZoom(15);
        }
        window.google.maps.event.removeListener(listener);
      });
    }

    return () => {
      // Clean up markers when incidents change
      newMarkers.forEach(marker => {
        window.google.maps.event.clearInstanceListeners(marker);
        marker.setMap(null);
      });
    };
  }, [map, incidents, onIncidentSelect]);

  return (
    <div className="relative h-full w-full min-h-[500px] flex flex-col">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="flex-1 relative overflow-hidden rounded-lg border border-border"
      />
      
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
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={() => {
                if (typeof window.google !== 'undefined' && map) {
                  map.setCenter({
                    lat: activeIncident.location.lat,
                    lng: activeIncident.location.lng
                  });
                  map.setZoom(14);
                }
              }}
            >
              Zoom In
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMapView;
