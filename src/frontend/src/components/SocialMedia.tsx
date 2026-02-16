import { useGetSortedSocialMediaLinks } from '../hooks/useQueries';
import { useIsCallerAdmin } from '../hooks/useQueries';
import { SiFacebook, SiX, SiInstagram, SiLinkedin, SiYoutube, SiGithub } from 'react-icons/si';
import { Share2, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SocialMedia() {
  const { data: links, isLoading: linksLoading, error: linksError } = useGetSortedSocialMediaLinks();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const visibleLinks = links?.filter(link => link.isVisible) ?? [];
  const isLoading = linksLoading || adminLoading;

  if (!isAdmin && visibleLinks.length === 0) {
    return null;
  }

  const getIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('facebook')) return SiFacebook;
    if (platformLower.includes('twitter') || platformLower.includes('x')) return SiX;
    if (platformLower.includes('instagram')) return SiInstagram;
    if (platformLower.includes('linkedin')) return SiLinkedin;
    if (platformLower.includes('youtube')) return SiYoutube;
    if (platformLower.includes('github')) return SiGithub;
    return Share2;
  };

  const gradients = [
    'from-primary to-primary/70',
    'from-secondary to-secondary/70',
    'from-accent to-accent/70',
    'from-success to-success/70',
    'from-warning to-warning/70',
  ];

  return (
    <section id="social" className="py-20 md:py-24 bg-background relative overflow-hidden">
      {/* Background Accent Elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20 space-y-4 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Connect With Us
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto font-medium">
            Stay updated with the latest health tips and news
          </p>
        </div>

        {linksError && (
          <Alert variant="destructive" className="max-w-2xl mx-auto mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load social media links. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center gap-6 md:gap-8 flex-wrap">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-20 md:h-24 md:w-24 rounded-2xl bg-foreground/10" />
            ))}
          </div>
        ) : visibleLinks.length > 0 ? (
          <div className="flex justify-center items-center gap-6 md:gap-8 flex-wrap max-w-4xl mx-auto">
            {visibleLinks.map((link, index) => {
              const Icon = getIcon(link.platform);
              const iconSize = Number(link.iconSize) || 28;
              
              return (
                <div
                  key={link.platform}
                  className="group relative animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br ${gradients[index % gradients.length]} text-white shadow-elevation-3 hover:shadow-glow-primary hover:scale-110 transition-all duration-500`}
                    aria-label={link.displayName || link.platform}
                    title={link.displayName || link.platform}
                  >
                    <Icon 
                      className="transition-all duration-500 group-hover:scale-110"
                    />
                  </a>
                  
                  {/* Platform name tooltip with enhanced styling */}
                  <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap px-4 py-2 rounded-xl bg-card shadow-elevation-2 border border-border">
                    {link.displayName || link.platform}
                  </span>
                </div>
              );
            })}
          </div>
        ) : isAdmin ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-primary mb-6 shadow-glow-primary">
              <Share2 className="h-10 w-10 text-white" />
            </div>
            <p className="text-muted-foreground text-lg font-medium mb-3">No social media links added yet</p>
            <p className="text-base text-muted-foreground">
              Go to the Admin Panel → Social Media tab to add your social media links
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
