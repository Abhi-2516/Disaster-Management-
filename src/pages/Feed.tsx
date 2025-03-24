
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import IncidentFeed from '@/components/IncidentFeed';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Plus } from 'lucide-react';
import { useIncidentStore } from '@/lib/store';

const Feed = () => {
  const { incidents } = useIncidentStore();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);
  
  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log('User denied geolocation or an error occurred');
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-3">Emergency Feed</h1>
              <p className="text-muted-foreground max-w-2xl">
                Stay updated with the latest emergencies and disasters reported by the community.
              </p>
            </div>
            
            <Button asChild className="mt-4 md:mt-0" size="lg">
              <Link to="/report">
                <Plus className="mr-2 h-4 w-4" />
                Report Incident
              </Link>
            </Button>
          </div>
          
          {incidents.length > 0 ? (
            <IncidentFeed userLocation={userLocation} />
          ) : (
            <div className="text-center py-20">
              <AlertTriangle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-3">No incidents reported yet</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Be the first to report an emergency or disaster in your area to help keep your community informed.
              </p>
              <Button asChild size="lg">
                <Link to="/report">Report an Incident</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <footer className="border-t border-border py-6 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Disaster Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Feed;
