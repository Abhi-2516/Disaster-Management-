
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface RangeSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showGlobal?: boolean;
  className?: string;
}

const RangeSelector = ({
  value,
  onChange,
  min = 5,
  max = 500,
  step = 5,
  showGlobal = true,
  className = '',
}: RangeSelectorProps) => {
  const [isGlobal, setIsGlobal] = useState(false);

  const handleToggleGlobal = () => {
    setIsGlobal(!isGlobal);
    // If switching to global, we pass a special value (e.g., -1)
    // If switching to range-based, we use the current slider value
    onChange(isGlobal ? value : -1);
  };

  const handleSliderChange = (newValue: number[]) => {
    if (isGlobal) {
      setIsGlobal(false);
    }
    onChange(newValue[0]);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Distance Range</h3>
        </div>
        
        <Badge 
          variant={isGlobal ? "secondary" : "default"}
          className="text-xs py-1 h-6 transition-all"
        >
          {isGlobal ? 'Global' : `${value} km`}
        </Badge>
      </div>
      
      <div className="px-1">
        <Slider
          disabled={isGlobal}
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={handleSliderChange}
          className={isGlobal ? "opacity-50" : ""}
        />
      </div>
      
      {showGlobal && (
        <button
          type="button"
          onClick={handleToggleGlobal}
          className="text-xs text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1"
        >
          {isGlobal ? 'Switch to range-based' : 'Show incidents globally'}
        </button>
      )}
    </div>
  );
};

export default RangeSelector;
