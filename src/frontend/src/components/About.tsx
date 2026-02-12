import { useGetWebsiteContent, useIsCallerAdmin, useGetDoctorCredentials } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EditableContent from './EditableContent';
import EditableImage from './EditableImage';
import DoctorCredentialsCard from './DoctorCredentialsCard';

export default function About() {
  const { data: content, isLoading: contentLoading, error: contentError } = useGetWebsiteContent();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: credentials, isLoading: credentialsLoading, error: credentialsError } = useGetDoctorCredentials();

  const aboutContent = content?.aboutContent ?? '';
  const isLoading = contentLoading || adminLoading || credentialsLoading;
  const hasError = contentError || credentialsError;

  if (isLoading) {
    return (
      <section id="about" className="py-20 md:py-24 bg-muted/30 relative overflow-hidden">
        <div className="container">
          <div className="text-center mb-16 md:mb-20">
            <Skeleton className="h-12 md:h-14 w-80 md:w-96 mx-auto mb-6 rounded-xl bg-foreground/10" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
            <Skeleton className="h-[400px] md:h-[500px] w-full rounded-2xl bg-foreground/10" />
            <div className="space-y-6">
              <Skeleton className="h-6 md:h-8 w-full rounded-lg bg-foreground/10" />
              <Skeleton className="h-6 md:h-8 w-full rounded-lg bg-foreground/10" />
              <Skeleton className="h-6 md:h-8 w-3/4 rounded-lg bg-foreground/10" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section id="about" className="py-20 md:py-24 bg-muted/30 relative overflow-hidden">
        <div className="container">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load about content. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  if (!aboutContent && !isAdmin) {
    return null;
  }

  return (
    <section id="about" className="py-20 md:py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Accent Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <div className="text-center mb-16 md:mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            About Dr. Malay Akechan
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start mb-16 md:mb-20">
          <div className="animate-fade-in group" style={{ animationDelay: '100ms' }}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <EditableImage
                imageId="doctor-headshot"
                alt="Dr. Malay Akechan"
                className="relative rounded-2xl shadow-elevation-4 w-full max-w-lg mx-auto group-hover:shadow-glow-primary transition-all duration-500 border-4 border-white/10"
                isAdmin={isAdmin ?? false}
                description="Doctor Profile Photo"
                supportsDarkMode={false}
              />
            </div>
          </div>
          
          <div className="animate-fade-in space-y-6" style={{ animationDelay: '200ms' }}>
            <div className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium max-w-none">
              <EditableContent
                content={aboutContent}
                field="aboutContent"
                isAdmin={isAdmin ?? false}
                multiline
              />
            </div>
          </div>
        </div>

        {/* Doctor Credentials Card with Enhanced Styling */}
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <DoctorCredentialsCard 
            credentials={credentials ?? null}
            isAdmin={isAdmin ?? false}
          />
        </div>
      </div>
    </section>
  );
}
