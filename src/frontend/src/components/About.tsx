import { useGetWebsiteContent, useGetDoctorCredentials, useIsCallerAdmin, useGetHomepageTextFormatting } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import EditableContent from './EditableContent';
import DoctorCredentialsCard from './DoctorCredentialsCard';
import type { TextFormattingBundle } from '../backend';

export default function About() {
  const { data: content, isLoading: contentLoading, error: contentError } = useGetWebsiteContent();
  const { data: credentials, isLoading: credentialsLoading, error: credentialsError } = useGetDoctorCredentials();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: textFormatting } = useGetHomepageTextFormatting();

  const aboutContent = content?.aboutContent ?? '';
  const isLoading = contentLoading || credentialsLoading || adminLoading;
  const hasError = contentError || credentialsError;

  // Text formatting styles
  const getFormattingStyle = (bundle: TextFormattingBundle | undefined) => {
    if (!bundle) return {};
    return {
      fontSize: `${Number(bundle.fontSize)}px`,
      fontFamily: bundle.fontFamily,
      fontWeight: bundle.fontWeight,
      letterSpacing: `${Number(bundle.letterSpacing) / 100}em`,
      textTransform: bundle.textTransform as any,
    };
  };

  const headingStyle = getFormattingStyle(textFormatting?.overviewHeading);
  const bodyStyle = getFormattingStyle(textFormatting?.overviewBody);

  if (isLoading) {
    return (
      <section id="about" className="py-20 md:py-24 bg-muted/30 relative overflow-hidden">
        <div className="container">
          <div className="text-center mb-16 md:mb-20">
            <Skeleton className="h-12 md:h-14 w-64 md:w-72 mx-auto mb-6 rounded-xl bg-foreground/10" />
            <Skeleton className="h-6 md:h-8 w-80 md:w-96 mx-auto rounded-xl bg-foreground/10" />
          </div>
          <div className="max-w-5xl mx-auto">
            <Skeleton className="h-96 w-full rounded-2xl bg-foreground/10" />
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
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
      
      <div className="container relative z-10">
        <div className="text-center mb-16 md:mb-20 animate-fade-in">
          <h2 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
            style={headingStyle}
          >
            About
          </h2>
          <div 
            className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed"
            style={bodyStyle}
          >
            <EditableContent
              content={aboutContent}
              field="aboutContent"
              isAdmin={isAdmin ?? false}
              multiline
            />
          </div>
        </div>

        <div className="max-w-5xl mx-auto animate-scale-in" style={{ animationDelay: '200ms' }}>
          <DoctorCredentialsCard credentials={credentials ?? null} isAdmin={isAdmin ?? false} />
        </div>
      </div>
    </section>
  );
}
