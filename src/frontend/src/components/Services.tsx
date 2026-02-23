import { useGetAllServices, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Services() {
  const { data: services, isLoading: servicesLoading, error: servicesError } = useGetAllServices();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const isLoading = servicesLoading || adminLoading;

  if (isLoading) {
    return (
      <section id="services" className="py-20 md:py-24 bg-background relative overflow-hidden">
        <div className="container">
          <div className="text-center mb-16 md:mb-20">
            <Skeleton className="h-12 md:h-14 w-56 md:w-64 mx-auto mb-6 rounded-xl bg-foreground/10" />
            <Skeleton className="h-6 md:h-8 w-80 md:w-96 mx-auto rounded-xl bg-foreground/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border border-border/50 bg-card/80 backdrop-blur-md">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 rounded-lg bg-foreground/10" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full rounded-lg bg-foreground/10" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (servicesError) {
    return (
      <section id="services" className="py-20 md:py-24 bg-background relative overflow-hidden">
        <div className="container">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load services. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  if (!services || services.length === 0) {
    if (!isAdmin) return null;
  }

  return (
    <section id="services" className="py-20 md:py-24 bg-background relative overflow-hidden">
      {/* Background Accent Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.75s' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.75s' }} />
      
      <div className="container relative z-10">
        <div className="text-center mb-16 md:mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Services
          </h2>
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Comprehensive medical care tailored to your needs
          </p>
        </div>

        {services && services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                className="group border border-border/50 bg-card/80 backdrop-blur-md hover:shadow-elevation-3 transition-all duration-500 hover:scale-105 hover:border-primary/30 animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="relative">
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {service.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {isAdmin ? 'No services added yet. Use the Admin Panel to add services.' : 'Services information coming soon.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
