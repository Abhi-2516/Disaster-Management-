
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  CheckCircle, 
  Clipboard, 
  Info, 
  MapPin, 
  Upload 
} from 'lucide-react';
import { IncidentType, Severity } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { useIncidentStore } from '@/lib/store';

const Report = () => {
  const navigate = useNavigate();
  const { addIncident } = useIncidentStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '' as IncidentType,
    severity: '' as Severity,
    location: {
      lat: 0,
      lng: 0,
      address: '',
    },
    imageFile: null as File | null,
    imagePreview: '',
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageFile: file,
          imagePreview: reader.result as string,
        });
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Mock getting current location
  const getCurrentLocation = () => {
    toast.promise(
      new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setFormData({
              ...formData,
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                address: 'Your current location',
              }
            });
            resolve();
          },
          (error) => {
            console.error("Error getting location:", error);
            // Fallback to default location
            setFormData({
              ...formData,
              location: {
                lat: 37.7749,
                lng: -122.4194,
                address: '123 Market St, San Francisco, CA',
              }
            });
            resolve();
          },
          { timeout: 10000 }
        );
      }),
      {
        loading: 'Getting your location...',
        success: 'Location found!',
        error: 'Failed to get location. Please try again.',
      }
    );
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title || !formData.description || !formData.type || !formData.severity) {
      toast.error('Please fill all required fields');
      return;
    }
    
    if (formData.location.lat === 0 && formData.location.lng === 0) {
      toast.error('Please set your location');
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new incident from form data
    const newIncident = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      severity: formData.severity,
      location: formData.location,
      imageUrl: formData.imagePreview || undefined,
    };
    
    // Add to store
    addIncident(newIncident);
    
    toast.success('Your report has been submitted!');
    
    // Navigate to home page after short delay
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  // Next step
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  // Previous step
  const goToPreviousStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Validate current step
  const validateCurrentStep = () => {
    if (step === 1) {
      if (!formData.title || !formData.description) {
        toast.error('Please fill in all required fields');
        return false;
      }
    } else if (step === 2) {
      if (!formData.type || !formData.severity) {
        toast.error('Please select incident type and severity');
        return false;
      }
    } else if (step === 3) {
      if (formData.location.lat === 0 && formData.location.lng === 0) {
        toast.error('Please set your location');
        return false;
      }
    }
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 pt-24 pb-16 px-4">
        <div className="container max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className={`flex items-center justify-center w-10 h-10 rounded-full mb-2 transition-all ${
                      i < step 
                        ? 'bg-primary text-white' 
                        : i === step 
                          ? 'bg-primary/20 border-2 border-primary text-primary' 
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i < step ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <span>{i}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {i === 1 ? 'Details' : i === 2 ? 'Type' : i === 3 ? 'Location' : 'Review'}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="relative mt-2">
              <div className="absolute top-0 left-5 right-5 h-1 bg-muted" />
              <div 
                className="absolute top-0 left-5 h-1 bg-primary transition-all" 
                style={{ width: `${((step - 1) / 3) * 100}%` }} 
              />
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="animate-fade-in">
            {/* Step 1: Incident Details */}
            {step === 1 && (
              <Card className="glass border-transparent">
                <CardHeader>
                  <CardTitle>Incident Details</CardTitle>
                  <CardDescription>
                    Provide basic information about the incident
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Title <span className="text-emergency-red">*</span>
                    </label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Brief title of the incident"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description <span className="text-emergency-red">*</span>
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe what happened, conditions, and any other relevant details"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end">
                  <Button type="button" onClick={goToNextStep}>
                    Next Step
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Step 2: Incident Type */}
            {step === 2 && (
              <Card className="glass border-transparent">
                <CardHeader>
                  <CardTitle>Incident Classification</CardTitle>
                  <CardDescription>
                    Categorize the incident to help others find it
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="type" className="text-sm font-medium">
                      Incident Type <span className="text-emergency-red">*</span>
                    </label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
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
                  
                  <div className="space-y-2">
                    <label htmlFor="severity" className="text-sm font-medium">
                      Severity Level <span className="text-emergency-red">*</span>
                    </label>
                    <Select
                      value={formData.severity}
                      onValueChange={(value) => handleSelectChange('severity', value)}
                    >
                      <SelectTrigger id="severity">
                        <SelectValue placeholder="Select severity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Minor incident, limited impact</SelectItem>
                        <SelectItem value="medium">Medium - Significant impact, may affect multiple people</SelectItem>
                        <SelectItem value="high">High - Major emergency, immediate danger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="image" className="text-sm font-medium">
                      Upload Image (Optional)
                    </label>
                    <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                      {formData.imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg">
                            <img 
                              src={formData.imagePreview} 
                              alt="Preview" 
                              className="w-full h-auto"
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="absolute top-2 right-2 glass h-7 w-7 p-0"
                              onClick={() => setFormData({
                                ...formData,
                                imageFile: null,
                                imagePreview: '',
                              })}
                            >
                              ✕
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Click the ✕ to remove this image
                          </p>
                        </div>
                      ) : (
                        <>
                          <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground mb-4">
                            Drag and drop an image, or click to browse
                          </p>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById('image')?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    Previous Step
                  </Button>
                  <Button type="button" onClick={goToNextStep}>
                    Next Step
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Step 3: Location */}
            {step === 3 && (
              <Card className="glass border-transparent">
                <CardHeader>
                  <CardTitle>Incident Location</CardTitle>
                  <CardDescription>
                    Tell us where this incident is happening
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="flex justify-between mb-6">
                    <Button 
                      type="button" 
                      onClick={getCurrentLocation}
                      className="w-full"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      Use My Current Location
                    </Button>
                  </div>
                  
                  {formData.location.address && (
                    <div className="glass p-4 rounded-lg border-l-4 border-l-primary animate-slide-in-right">
                      <div className="flex items-start">
                        <MapPin className="text-primary mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
                        <div>
                          <p className="font-medium mb-1">Location detected</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {formData.location.address}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            Coordinates: {formData.location.lat}, {formData.location.lng}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">
                      Address (Optional)
                    </label>
                    <Textarea
                      id="address"
                      name="location.address"
                      placeholder="Enter the address or location description"
                      value={formData.location.address}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, address: e.target.value }
                      })}
                      rows={3}
                    />
                  </div>
                  
                  <div className="p-4 rounded-lg bg-secondary/50 border border-muted">
                    <div className="flex items-start">
                      <Info className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                      <p className="text-sm text-muted-foreground">
                        In a real application, a map would be displayed here where you could
                        drag a pin to mark the exact location of the incident.
                      </p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    Previous Step
                  </Button>
                  <Button type="button" onClick={goToNextStep}>
                    Review Report
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {/* Step 4: Review and Submit */}
            {step === 4 && (
              <Card className="glass border-transparent">
                <CardHeader>
                  <CardTitle>Review Your Report</CardTitle>
                  <CardDescription>
                    Please verify the information before submitting
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <h3 className="font-medium">Incident Details</h3>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-primary"
                        onClick={() => setStep(1)}
                      >
                        Edit
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Title</h4>
                      <p className="text-sm text-muted-foreground">{formData.title}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Description</h4>
                      <p className="text-sm text-muted-foreground">{formData.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <h3 className="font-medium">Classification</h3>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-primary"
                        onClick={() => setStep(2)}
                      >
                        Edit
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Type</h4>
                        <p className="text-sm text-muted-foreground capitalize">{formData.type}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Severity</h4>
                        <p className="text-sm text-muted-foreground capitalize">{formData.severity}</p>
                      </div>
                    </div>
                    
                    {formData.imagePreview && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Image</h4>
                        <div className="rounded-lg overflow-hidden max-w-xs">
                          <img 
                            src={formData.imagePreview} 
                            alt="Incident" 
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <h3 className="font-medium">Location</h3>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-primary"
                        onClick={() => setStep(3)}
                      >
                        Edit
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Address</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.location.address || 'Not provided'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Coordinates</h4>
                      <p className="text-sm text-muted-foreground">
                        {formData.location.lat}, {formData.location.lng}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-accent border border-border">
                    <div className="flex items-start">
                      <Info className="mt-0.5 mr-3 h-5 w-5 flex-shrink-0 text-primary" />
                      <p className="text-sm">
                        By submitting this report, you confirm that the information provided is accurate 
                        to the best of your knowledge. False reporting is a serious offense.
                      </p>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={goToPreviousStep}>
                    Previous Step
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="min-w-32"
                  >
                    {isSubmitting ? (
                      <>Submitting...</>
                    ) : (
                      <>
                        <Clipboard className="mr-2 h-4 w-4" />
                        Submit Report
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
