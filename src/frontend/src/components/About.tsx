import { useGetWebsiteContent, useIsCallerAdmin, useGetDoctorCredentials } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import EditableContent from './EditableContent';
import DoctorCredentialsCard from './DoctorCredentialsCard';

export default function About() {
  const { data: content, isLoading: contentLoading } = useGetWebsiteContent();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: credentials } = useGetDoctorCredentials();

  const aboutContent = content?.aboutContent ?? '';
  const isLoading = contentLoading || adminLoading;

  if (isLoading) {
    return (
      <section id="about" className="py-20 md:py-24 bg-muted/30 relative overflow-hidden">
        <div className="container">
          <div className="text-center mb-16 md:mb-20">
            <Skeleton className="h-12 md:h-14 w-48 md:w-56 mx-auto mb-6 rounded-xl bg-foreground/10" />
            <Skeleton className="h-6 md:h-8 w-80 md:w-96 mx-auto rounded-xl bg-foreground/10" />
          </div>
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-64 w-full rounded-2xl bg-foreground/10" />
          </div>
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
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      
      <div className="container relative z-10">
        <div className="text-center mb-16 md:mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            About
          </h2>
          <div className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            <EditableContent
              content={aboutContent}
              field="aboutContent"
              isAdmin={isAdmin ?? false}
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
          <DoctorCredentialsCard credentials={credentials} isAdmin={isAdmin ?? false} />
        </div>
      </div>
    </section>
  );
}
