
import { 
  AlertTriangle, 
  Clock, 
  Flame, 
  MapPin, 
  ShieldAlert, 
  ThumbsUp, 
  Waves 
} from 'lucide-react';
import { Incident } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface IncidentCardProps {
  incident: Incident;
  compact?: boolean;
}

const IncidentCard = ({ incident, compact = false }: IncidentCardProps) => {
  // Map incident type to icon
  const getTypeIcon = () => {
    switch (incident.type) {
      case 'fire':
        return <Flame className="h-4 w-4" />;
      case 'flood':
        return <Waves className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  // Get severity color
  const getSeverityColor = () => {
    switch (incident.severity) {
      case 'high':
        return 'text-emergency-red border-emergency-red/20 bg-emergency-red/10';
      case 'medium':
        return 'text-emergency-amber border-emergency-amber/20 bg-emergency-amber/10';
      case 'low':
        return 'text-emergency-blue border-emergency-blue/20 bg-emergency-blue/10';
      default:
        return '';
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
      compact ? 'h-[260px]' : ''
    } glass border-transparent hover:border-primary/20`}>
      {incident.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img 
            src={incident.imageUrl} 
            alt={incident.title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
          {incident.verified && (
            <Badge 
              variant="secondary" 
              className="absolute top-2 right-2 glass border-0 flex items-center gap-1"
            >
              <ShieldAlert className="h-3 w-3 text-primary" />
              Verified
            </Badge>
          )}
        </div>
      )}
      
      <CardContent className={compact ? 'pt-4 pb-2' : 'pt-6 pb-4'}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`font-semibold text-balance ${compact ? 'text-base' : 'text-lg'}`}>
            {incident.title}
          </h3>
          
          <Badge variant="outline" className={`shrink-0 ${getSeverityColor()}`}>
            {incident.severity}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          <span>
            {formatDistanceToNow(incident.timestamp, { addSuffix: true })}
          </span>
        </div>
        
        {!compact && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {incident.description}
          </p>
        )}
        
        <div className="flex items-center text-sm">
          <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
          <span className="truncate">
            {incident.location.address || `${incident.location.lat.toFixed(2)}, ${incident.location.lng.toFixed(2)}`}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className={`flex justify-between border-t ${compact ? 'pt-2 pb-3' : 'pt-3 pb-4'}`}>
        <Badge variant="outline" className="flex items-center gap-1.5">
          {getTypeIcon()}
          {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)}
        </Badge>
        
        <Button variant="ghost" size="sm" className="text-xs gap-1.5 h-8">
          <ThumbsUp className="h-3.5 w-3.5" />
          Helpful
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IncidentCard;
