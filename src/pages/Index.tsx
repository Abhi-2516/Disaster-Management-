import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import IncidentCard from '@/components/IncidentCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useIncidentStore } from '@/lib/store';

const Index = () => {
  const { incidents } = useIncidentStore();
  const recentIncidents = incidents.slice(0, 3); // Get the 3 most recent incidents

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        {/* Recent Incidents Section */}
        <section className="py-20 px-4 sm:px-6 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-3">Recent Incidents</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Stay informed about the latest reported emergencies and disasters from around the world.
                </p>
              </div>
              
              <Button asChild variant="outline" className="mt-4 md:mt-0">
                <Link to="/feed">
                  View All Incidents
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentIncidents.map((incident, index) => (
                <div 
                  key={incident.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <IncidentCard incident={incident} />
                </div>
              ))}
              
              {recentIncidents.length === 0 && (
                <div className="col-span-3 text-center py-12">
                  <p className="text-muted-foreground mb-4">No incidents have been reported yet.</p>
                  <Button asChild>
                    <Link to="/report">Report an Incident</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 bg-accent/40 relative">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-3 text-center">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-center mb-16">
              DisasterConnect enables real-time emergency reporting and tracking through a simple process.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Report Incidents',
                  description: 'See an emergency or disaster? Report it with details, location, and photos.',
                  number: '01',
                },
                {
                  title: 'Share Information',
                  description: 'Your reports help others stay informed and make better decisions during emergencies.',
                  number: '02',
                },
                {
                  title: 'Stay Updated',
                  description: 'Receive alerts about incidents in your area or track emergencies worldwide.',
                  number: '03',
                },
              ].map((step, index) => (
                <div 
                  key={index}
                  className="glass rounded-lg p-6 relative overflow-hidden"
                >
                  <span className="absolute top-0 right-0 text-8xl font-bold text-primary/10 transform translate-x-4 -translate-y-4 pointer-events-none">
                    {step.number}
                  </span>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="container mx-auto max-w-4xl glass rounded-xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Help Keep Your Community Safe
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Your reports can make a difference. Join thousands of others in creating a 
              real-time emergency response network that saves lives and helps communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/report">Report an Incident</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/map">Explore the Map</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link to="/" className="flex items-center text-primary font-semibold text-xl">
                DisasterConnect
              </Link>
              <p className="text-sm text-muted-foreground mt-2">
                Crowdsourced Disaster response network
              </p>
            </div>
            
            <div className="flex gap-8">
              <div>
                <h3 className="font-medium mb-3">Pages</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/" className="hover:text-primary">Home</Link></li>
                  <li><Link to="/map" className="hover:text-primary">Map</Link></li>
                  <li><Link to="/feed" className="hover:text-primary">Incident Feed</Link></li>
                  <li><Link to="/report" className="hover:text-primary">Report</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Resources</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary">About</a></li>
                  <li><a href="#" className="hover:text-primary">Help Center</a></li>
                  <li><a href="#" className="hover:text-primary">Privacy</a></li>
                  <li><a href="#" className="hover:text-primary">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-10 pt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Disaster Connect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
