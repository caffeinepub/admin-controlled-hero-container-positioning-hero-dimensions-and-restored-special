import { useGetAllServices, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Services() {
  const { data: services, isLoading: servicesLoading, error: servicesError } = useGetAllServices();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const hasServices = services && services.length > 0;
  const isLoading = servicesLoading || adminLoading;

  const gradients = [
    'from-primary to-primary/70',
    'from-secondary to-secondary/70',
    'from-accent to-accent/70',
    'from-success to-success/70',
    'from-warning to-warning/70',
  ];

  if (isLoading) {
    return (
      <section id="services" className="py-20 md:py-24 bg-background relative overflow-hidden">
        <div className="container">
          <div className="text-center mb-16 md:mb-20">
            <Skeleton className="h-12 md:h-14 w-64 md:w-72 mx-auto mb-6 rounded-xl bg-foreground/10" />
            <Skeleton className="h-6 md:h-8 w-80 md:w-96 mx-auto rounded-xl bg-foreground/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-2 border-border bg-card/50 backdrop-blur-sm overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/70" />
                <CardHeader>
                  <Skeleton className="h-8 w-3/4 rounded-lg bg-foreground/10" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-6 w-full mb-3 rounded-lg bg-foreground/10" />
                  <Skeleton className="h-6 w-5/6 rounded-lg bg-foreground/10" />
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

  if (!hasServices && !isAdmin) {
    return null;
  }

  return (
    <section id="services" className="py-20 md:py-24 bg-background relative overflow-hidden">
      {/* Background Accent Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className="text-center mb-16 md:mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Services Offered
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
            Comprehensive medical services tailored to meet your healthcare needs
          </p>
        </div>

        {hasServices ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <Card 
                key={service.id} 
                className="hover-lift hover:shadow-glow-primary transition-all duration-500 cursor-pointer group animate-scale-in border-2 border-border hover:border-primary/50 bg-card/50 backdrop-blur-sm overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Top Border */}
                <div className={`h-2 bg-gradient-to-r ${gradients[index % gradients.length]} group-hover:h-3 transition-all duration-300`} />
                
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-4 text-xl">
                    <div className={`flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} text-white font-bold text-lg shadow-elevation-2 group-hover:scale-110 group-hover:shadow-glow-primary transition-all duration-500`}>
                      {index + 1}
                    </div>
                    <span className="leading-tight font-bold text-foreground group-hover:text-primary transition-colors">{service.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-base">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-6 shadow-glow-primary">
              <Activity className="h-10 w-10 text-white" />
            </div>
            <p className="text-muted-foreground text-lg font-medium">No services added yet. {isAdmin && 'Add services from the admin panel.'}</p>
          </div>
        )}
      </div>
    </section>
  );
}
