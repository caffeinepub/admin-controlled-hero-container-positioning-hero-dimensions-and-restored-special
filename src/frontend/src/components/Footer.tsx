import { useGetFooterContent, useGetConfig, useIsCallerAdmin } from '../hooks/useQueries';
import { navigationSections } from './Header';
import { SiFacebook, SiX, SiLinkedin, SiInstagram } from 'react-icons/si';
import { Heart } from 'lucide-react';
import EditableFooterContent from './EditableFooterContent';
import { Skeleton } from '@/components/ui/skeleton';

export default function Footer() {
  const { data: footerContent, isLoading: footerLoading } = useGetFooterContent();
  const { data: config } = useGetConfig();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const isLoading = footerLoading || adminLoading;

  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'unknown-app';
  const caffeineUrl = `https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`;

  const socialIcons: Record<string, any> = {
    Facebook: SiFacebook,
    X: SiX,
    LinkedIn: SiLinkedin,
    Instagram: SiInstagram,
  };

  if (isLoading) {
    return (
      <footer className="relative bg-gradient-to-br from-muted/50 via-background to-muted/30 border-t border-border/50 backdrop-blur-xl overflow-hidden">
        <div className="container py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="h-6 w-32 mb-6 rounded-lg bg-foreground/10" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full rounded bg-foreground/10" />
                  <Skeleton className="h-4 w-3/4 rounded bg-foreground/10" />
                  <Skeleton className="h-4 w-5/6 rounded bg-foreground/10" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  const contact = footerContent?.contact;
  const quickLinks = footerContent?.quickLinks ?? [];
  const sections = footerContent?.sections ?? [];
  const copyright = footerContent?.copyright ?? '';

  const sortedSections = [...sections].sort((a, b) => Number(a.order) - Number(b.order));

  return (
    <footer className="relative bg-gradient-to-br from-muted/50 via-background to-muted/30 border-t border-border/50 backdrop-blur-xl overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="container relative z-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
          {/* Contact Information */}
          <div className="animate-fade-in">
            <h3 className="text-lg font-bold mb-6 text-foreground">
              Contact
            </h3>
            <div className="space-y-3 text-muted-foreground">
              <EditableFooterContent
                field="address"
                content={contact?.address ?? ''}
                isAdmin={isAdmin ?? false}
              />
              <EditableFooterContent
                field="phone"
                content={contact?.phone ?? ''}
                isAdmin={isAdmin ?? false}
              />
              <EditableFooterContent
                field="email"
                content={contact?.email ?? ''}
                isAdmin={isAdmin ?? false}
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="text-lg font-bold mb-6 text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {navigationSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={section.type === 'route' ? '#/blogs' : `#${section.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Custom Sections - Display first 2 sections only */}
          {sortedSections.slice(0, 2).map((section, index) => (
            <div 
              key={index} 
              className="animate-fade-in"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <h3 className="text-lg font-bold mb-6 text-foreground">
                {section.title || 'Section'}
              </h3>
              <div className="text-muted-foreground leading-relaxed">
                {section.content || (isAdmin ? 'Click edit in admin panel to add content' : '')}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-muted-foreground text-sm text-center md:text-left">
              <EditableFooterContent
                field="copyright"
                content={copyright || `© ${currentYear} Dr. Malay Akechan. All rights reserved.`}
                isAdmin={isAdmin ?? false}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-destructive fill-destructive animate-pulse" />
              <span>using</span>
              <a
                href={caffeineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:text-primary/80 transition-colors duration-300 hover:underline"
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
