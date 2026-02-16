import { useGetFooterContent, useGetSortedSocialMediaLinks, useIsCallerAdmin } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EditableFooterContent from './EditableFooterContent';
import { SiFacebook, SiX, SiInstagram, SiLinkedin, SiYoutube } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function Footer() {
  const { data: footerContent, isLoading: contentLoading, error: contentError } = useGetFooterContent();
  const { data: socialLinks, isLoading: linksLoading, error: linksError } = useGetSortedSocialMediaLinks();
  const { data: isAdmin } = useIsCallerAdmin();

  const isLoading = contentLoading || linksLoading;
  const hasError = contentError || linksError;

  const contact = footerContent?.contact;
  const quickLinks = footerContent?.quickLinks ?? [];
  const copyright = footerContent?.copyright ?? '';

  const socialIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    facebook: SiFacebook,
    x: SiX,
    twitter: SiX,
    instagram: SiInstagram,
    linkedin: SiLinkedin,
    youtube: SiYoutube,
  };

  const handleQuickLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault();
    
    // Check if it's a hash-based route (blogs)
    if (url.startsWith('#/')) {
      window.location.hash = url.substring(1);
    } else if (url.startsWith('#')) {
      // Section anchor - smooth scroll
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // External link
      window.location.href = url;
    }
  };

  if (isLoading) {
    return (
      <footer className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/5 border-t border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(var(--secondary-rgb),0.05),transparent_50%)]" />
        
        <div className="container relative z-10 py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <Skeleton className="h-6 w-32 bg-foreground/10" />
                <Skeleton className="h-4 w-full bg-foreground/10" />
                <Skeleton className="h-4 w-3/4 bg-foreground/10" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  if (hasError) {
    return (
      <footer className="bg-muted/30 border-t py-8">
        <div className="container">
          <Alert variant="destructive">
            <AlertDescription>Failed to load footer content.</AlertDescription>
          </Alert>
        </div>
      </footer>
    );
  }

  const visibleSocialLinks = socialLinks?.filter(link => link.isVisible) ?? [];
  const appIdentifier = encodeURIComponent(window.location.hostname || 'drmalay-app');

  return (
    <footer className="relative bg-gradient-to-br from-background via-primary/5 to-secondary/5 border-t border-border/50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb),0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(var(--secondary-rgb),0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,rgba(var(--primary-rgb),0.03)_50%,transparent_100%)] animate-shimmer" />
      
      <div className="container relative z-10 py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 animate-fade-in">
          {/* Contact Information */}
          <div className="space-y-6 group">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              Contact Us
            </h3>
            <div className="space-y-3 text-muted-foreground">
              <EditableFooterContent
                field="address"
                content={contact?.address ?? ''}
                isAdmin={isAdmin ?? false}
                className="hover:text-foreground transition-colors leading-relaxed"
              />
              <EditableFooterContent
                field="phone"
                content={contact?.phone ?? ''}
                isAdmin={isAdmin ?? false}
                className="hover:text-foreground transition-colors"
              />
              <EditableFooterContent
                field="email"
                content={contact?.email ?? ''}
                isAdmin={isAdmin ?? false}
                className="hover:text-foreground transition-colors"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 group">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index} className="transform hover:translate-x-2 transition-transform">
                  <a
                    href={link.url}
                    onClick={(e) => handleQuickLinkClick(e, link.url)}
                    className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group/link"
                  >
                    <span className="w-0 h-0.5 bg-primary group-hover/link:w-4 transition-all" />
                    {link.name}
                  </a>
                </li>
              ))}
              {/* Add Blogs link */}
              <li className="transform hover:translate-x-2 transition-transform">
                <a
                  href="#/blogs"
                  onClick={(e) => handleQuickLinkClick(e, '#/blogs')}
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group/link"
                >
                  <span className="w-0 h-0.5 bg-primary group-hover/link:w-4 transition-all" />
                  Blogs
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-6 group">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              Follow Us
            </h3>
            <div className="flex flex-wrap gap-4">
              {visibleSocialLinks.map((link) => {
                const IconComponent = socialIconMap[link.platform.toLowerCase()];
                const iconSize = Number(link.iconSize) || 24;
                
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/social relative"
                    aria-label={link.displayName}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-lg opacity-0 group-hover/social:opacity-50 transition-opacity" />
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 hover:border-primary/50 hover:scale-110 hover:rotate-6 transition-all duration-300 backdrop-blur-sm">
                      {link.icon ? (
                        <img
                          src={link.icon.getDirectURL()}
                          alt={link.displayName}
                          className="w-6 h-6 object-contain"
                        />
                      ) : IconComponent ? (
                        <IconComponent className="text-foreground group-hover/social:text-primary transition-colors" />
                      ) : (
                        <span className="text-xs font-bold text-foreground group-hover/social:text-primary transition-colors">
                          {link.platform.substring(0, 2).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* About */}
          <div className="space-y-6 group">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              About
            </h3>
            <p className="text-muted-foreground leading-relaxed hover:text-foreground transition-colors">
              Providing quality healthcare services with compassion and expertise. Your health is our priority.
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <EditableFooterContent
              field="copyright"
              content={copyright}
              isAdmin={isAdmin ?? false}
              className="text-muted-foreground text-center md:text-left hover:text-foreground transition-colors"
            />
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group/love">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-500 group-hover/love:scale-125 group-hover/love:animate-pulse transition-transform" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:from-secondary hover:to-accent transition-all"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
