
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'py-2 glass shadow-sm border-b border-border/50' 
        : 'py-4 bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-primary font-semibold text-xl transition-transform hover:scale-[1.02]"
          >
            <AlertTriangle className="h-5 w-5" />
            <span>Disaster Connect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/map" className="text-foreground/80 hover:text-primary transition-colors">
              Map View
            </Link>
            <Link to="/feed" className="text-foreground/80 hover:text-primary transition-colors">
              Incident Feed
            </Link>
            <Button asChild variant="default" className="animate-pulse-soft">
              <Link to="/report">
                <MapPin className="h-4 w-4 mr-2" />
                Report Incident
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass shadow-md mt-2 rounded-b-lg animate-fade-in">
          <div className="px-4 pt-2 pb-4 space-y-4">
            <Link 
              to="/" 
              className="block text-foreground/80 hover:text-primary py-2 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/map" 
              className="block text-foreground/80 hover:text-primary py-2 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Map View
            </Link>
            <Link 
              to="/feed" 
              className="block text-foreground/80 hover:text-primary py-2 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Incident Feed
            </Link>
            <Button asChild variant="default" className="w-full justify-center">
              <Link 
                to="/report" 
                onClick={() => setMobileMenuOpen(false)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Report Incident
              </Link>
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
