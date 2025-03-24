
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  AlertTriangle, 
  ArrowRight, 
  CloudLightning, 
  Flame, 
  MapPin, 
  Waves
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/6 w-96 h-96 bg-accent/30 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-emergency-blue/20 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>

        {/* Floating Icons */}
        <div className="hidden lg:block absolute top-1/5 right-1/4 text-emergency-red/30 animate-float" style={{ animationDelay: '1s' }}>
          <Flame size={48} />
        </div>
        <div className="hidden lg:block absolute bottom-1/4 left-1/5 text-emergency-blue/30 animate-float" style={{ animationDelay: '3s' }}>
          <Waves size={48} />
        </div>
        <div className="hidden lg:block absolute top-1/3 left-2/3 text-emergency-amber/30 animate-float" style={{ animationDelay: '5s' }}>
          <CloudLightning size={48} />
        </div>
      </div>

      {/* Content Container */}
      <div className={`container max-w-5xl mx-auto text-center transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/20 bg-primary/5">
          <AlertTriangle className="mr-1 h-3.5 w-3.5 text-primary" />
          <span>Crowdsourced Disaster Response Network</span>
        </Badge>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6">
          Real-time Emergency Updates from{' '}
          <span className="text-primary relative">
            People Like You
            <span className="absolute bottom-0 left-0 w-full h-[5px] bg-primary/20 rounded-full"></span>
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 text-balance">
          Report and track natural disasters and emergencies in your area or around the world.
          Share critical information that can help communities stay informed and safe.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="px-8 py-6 text-base rounded-full shadow-lg hover:shadow-xl transition-all">
            <Link to="/report">
              <MapPin className="mr-2 h-5 w-5" />
              Report an Incident
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-8 py-6 text-base rounded-full hover:bg-accent/50 transition-all">
            <Link to="/map">
              Explore Map
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Waves, label: 'Floods', color: 'text-emergency-blue' },
            { icon: Flame, label: 'Wildfires', color: 'text-emergency-red' },
            { icon: AlertTriangle, label: 'Earthquakes', color: 'text-emergency-amber' },
            { icon: CloudLightning, label: 'Storms', color: 'text-primary' },
          ].map((item, index) => (
            <div 
              key={index}
              className={`glass p-4 rounded-xl transition-all duration-500 transform ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
            >
              <div className={`${item.color} mb-3 mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-background/50`}>
                <item.icon className="h-6 w-6" />
              </div>
              <p className="font-medium">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent"></div>
    </div>
  );
};

export default Hero;
