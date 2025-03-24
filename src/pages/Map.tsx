
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import GoogleMapView from '@/components/GoogleMapView';
import { Incident } from '@/lib/types';
import { useIncidentStore } from '@/lib/store';

const Map = () => {
  const { incidents } = useIncidentStore();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-3">Map View</h1>
            <p className="text-muted-foreground max-w-2xl">
              Visualize emergency reports geographically and filter by proximity to your location.
            </p>
          </div>
          
          <div className="h-[calc(100vh-250px)] min-h-[500px]">
            <GoogleMapView incidents={incidents} />
          </div>
        </div>
      </main>
      
      {/* Footer (simplified version) */}
      <footer className="border-t border-border py-6 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Calamity Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Map;
