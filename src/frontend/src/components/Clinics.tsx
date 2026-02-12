import { useGetAllClinics, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock, ExternalLink, AlertCircle, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Clinics() {
  const { data: clinics, isLoading: clinicsLoading, error: clinicsError } = useGetAllClinics();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const hasClinics = clinics && clinics.length > 0;
  const isLoading = clinicsLoading || adminLoading;

  if (isLoading) {
    return (
      <section id="clinics" className="py-20 md:py-24 bg-muted/30 relative overflow-hidden">
        <div className="container">
          <div className="text-center mb-16 md:mb-20">
            <Skeleton className="h-12 md:h-14 w-64 md:w-72 mx-auto mb-6 rounded-xl bg-foreground/10" />
            <Skeleton className="h-6 md:h-8 w-80 md:w-96 mx-auto rounded-xl bg-foreground/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-full border-2 border-border bg-card/50 backdrop-blur-sm overflow-hidden">
                <Skeleton className="h-56 w-full bg-foreground/10" />
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 rounded-lg bg-foreground/10" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-6 w-full rounded-lg bg-foreground/10" />
                  <Skeleton className="h-6 w-5/6 rounded-lg bg-foreground/10" />
                  <Skeleton className="h-6 w-4/5 rounded-lg bg-foreground/10" />
                  <Skeleton className="h-10 w-full rounded-xl bg-foreground/10" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (clinicsError) {
    return (
      <section id="clinics" className="py-20 md:py-24 bg-muted/30 relative overflow-hidden">
        <div className="container">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load clinics. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  if (!hasClinics && !isAdmin) {
    return null;
  }

  return (
    <section id="clinics" className="py-20 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Accent Elements */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Our Clinics
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-medium">
            Visit us at any of our convenient locations
          </p>
        </div>

        {hasClinics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {clinics.map((clinic, index) => (
              <Card 
                key={clinic.id} 
                className="group h-full flex flex-col hover-lift hover:shadow-glow-primary transition-all duration-500 animate-scale-in border-2 border-border hover:border-primary/50 bg-card/50 backdrop-blur-sm overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Clinic Image with Overlay Effect */}
                {clinic.image && (
                  <div className="relative w-full h-56 overflow-hidden bg-muted">
                    <img 
                      src={clinic.image.getDirectURL()} 
                      alt={clinic.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}
                
                {/* Card Content */}
                <div className="flex flex-col flex-1">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-bold flex items-start gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex-shrink-0 shadow-elevation-2 group-hover:shadow-glow-primary transition-all duration-500">
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <span className="leading-tight group-hover:text-primary transition-colors">{clinic.name}</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col space-y-5 pt-0">
                    <div className="space-y-4 flex-1 text-base">
                      {/* Address */}
                      <div className="flex gap-3 leading-relaxed group/item">
                        <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                        <p className="text-foreground/80 group-hover/item:text-foreground transition-colors">{clinic.address}</p>
                      </div>
                      
                      {/* Contact Details */}
                      <div className="flex gap-3 leading-relaxed group/item">
                        <Phone className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                        <p className="text-foreground/80 group-hover/item:text-foreground transition-colors">{clinic.contactDetails}</p>
                      </div>
                      
                      {/* Hours */}
                      <div className="flex gap-3 leading-relaxed group/item">
                        <Clock className="h-5 w-5 text-accent mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                        <p className="text-foreground/80 group-hover/item:text-foreground transition-colors">{clinic.hours}</p>
                      </div>
                    </div>
                    
                    {/* Action Buttons Container */}
                    <div className="space-y-3 mt-3">
                      {/* Book Now Button - Only shown when bookingUrl exists */}
                      {clinic.bookingUrl && clinic.bookingUrl.trim() && (
                        <a
                          href={clinic.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-3 w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-secondary to-secondary/80 rounded-xl transition-all duration-300 hover:shadow-glow-secondary hover:scale-105"
                        >
                          <Calendar className="h-5 w-5" />
                          <span>Book Now</span>
                        </a>
                      )}
                      
                      {/* Map Link Button */}
                      {clinic.mapLink && (
                        <a
                          href={clinic.mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-3 w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-primary to-primary/80 rounded-xl transition-all duration-300 hover:shadow-glow-primary hover:scale-105"
                        >
                          <ExternalLink className="h-5 w-5" />
                          <span>View on Map</span>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-6 shadow-glow-primary">
              <MapPin className="h-10 w-10 text-white" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">
              No clinics added yet. {isAdmin && 'Add clinics from the admin panel.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
