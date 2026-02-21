import { useGetFooterContent, useGetSortedSocialMediaLinks, useIsCallerAdmin, useGetHeroSectionTheme } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EditableFooterContent from './EditableFooterContent';
import { navigationSections } from './Header';
import { SiFacebook, SiX, SiInstagram, SiLinkedin, SiYoutube } from 'react-icons/si';
import { Heart, MapPin, Phone, Mail, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import HeroMultiEffectsLayer from './hero/HeroMultiEffectsLayer';

export default function Footer() {
  const { data: footerContent, isLoading: contentLoading, error: contentError } = useGetFooterContent();
  const { data: socialLinks, isLoading: linksLoading, error: linksError } = useGetSortedSocialMediaLinks();
  const { data: isAdmin } = useIsCallerAdmin();
  const { data: heroTheme, isLoading: themeLoading } = useGetHeroSectionTheme();
  const [editingQuickLinks, setEditingQuickLinks] = useState(false);
  const [editingSocialMedia, setEditingSocialMedia] = useState(false);

  const isLoading = contentLoading || linksLoading;
  const hasError = contentError || linksError;

  const contact = footerContent?.contact;
  const copyright = footerContent?.copyright ?? '';
  const customSections = footerContent?.sections ?? [];

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
      <footer className="relative bg-background border-t border-border/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--secondary)/0.08),transparent_50%)]" />
        
        <div className="container relative z-10 py-16">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4 animate-pulse">
                <Skeleton className="h-6 w-32 bg-muted" />
                <Skeleton className="h-4 w-full bg-muted" />
                <Skeleton className="h-4 w-3/4 bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </footer>
    );
  }

  if (hasError) {
    return (
      <footer className="bg-background border-t py-8">
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

  // Sort custom sections by order
  const sortedCustomSections = [...customSections].sort((a, b) => Number(a.order) - Number(b.order));

  // Build all sections array (Contact, Quick Links, Social Media, then custom sections)
  const allSections = [
    {
      id: 'contact',
      title: 'Contact Us',
      order: 0,
      component: (
        <div className="space-y-4 text-muted-foreground">
          {/* Address */}
          <div className="flex items-start gap-3 group/item">
            <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
            {isAdmin ? (
              <EditableFooterContent
                field="address"
                content={contact?.address ?? ''}
                isAdmin={isAdmin}
                className="hover:text-foreground transition-colors duration-300 leading-relaxed flex-1"
              />
            ) : contact?.address ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors duration-300 leading-relaxed flex-1"
              >
                {contact.address}
              </a>
            ) : null}
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 group/item">
            <Phone className="h-5 w-5 text-primary flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
            {isAdmin ? (
              <EditableFooterContent
                field="phone"
                content={contact?.phone ?? ''}
                isAdmin={isAdmin}
                className="hover:text-foreground transition-colors duration-300 flex-1"
              />
            ) : contact?.phone ? (
              <a
                href={`tel:${contact.phone}`}
                className="hover:text-foreground transition-colors duration-300 flex-1"
              >
                {contact.phone}
              </a>
            ) : null}
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 group/item">
            <Mail className="h-5 w-5 text-primary flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300" />
            {isAdmin ? (
              <EditableFooterContent
                field="email"
                content={contact?.email ?? ''}
                isAdmin={isAdmin}
                className="hover:text-foreground transition-colors duration-300 flex-1"
              />
            ) : contact?.email ? (
              <a
                href={`mailto:${contact.email}`}
                className="hover:text-foreground transition-colors duration-300 flex-1"
              >
                {contact.email}
              </a>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      id: 'quick-links',
      title: 'Quick Links',
      order: 1,
      component: (
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8 p-0 absolute -top-2 right-0"
                onClick={() => setEditingQuickLinks(!editingQuickLinks)}
                title="Edit quick links in Admin Panel > Content & Images"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
          <ul className="space-y-3">
            {navigationSections.map((section) => {
              const url = section.type === 'route' ? `#/${section.id}` : `#${section.id}`;
              return (
                <li key={section.id} className="transform hover:translate-x-2 transition-transform duration-300">
                  <a
                    href={url}
                    onClick={(e) => handleQuickLinkClick(e, url)}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 inline-flex items-center gap-2 group/link"
                  >
                    <span className="w-0 h-0.5 bg-primary group-hover/link:w-4 transition-all duration-300" />
                    {section.label}
                  </a>
                </li>
              );
            })}
          </ul>
          {isAdmin && editingQuickLinks && (
            <div className="absolute top-full left-0 mt-2 p-4 bg-card border border-border rounded-lg shadow-lg z-10 w-full max-w-sm glass-effect">
              <p className="text-sm text-muted-foreground">
                Quick links are automatically synced with the header navigation. To customize, edit the navigation sections in the Header component.
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'social-media',
      title: 'Follow Us',
      order: 2,
      component: (
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8 p-0 absolute -top-2 right-0"
                onClick={() => setEditingSocialMedia(!editingSocialMedia)}
                title="Edit social media links in Admin Panel > Social Media"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-4">
            {visibleSocialLinks.map((link) => {
              const IconComponent = socialIconMap[link.platform.toLowerCase()];
              
              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/social relative"
                  aria-label={link.displayName}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-full blur-lg opacity-0 group-hover/social:opacity-50 transition-opacity duration-300" />
                  <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20 hover:border-primary/50 hover:scale-110 hover:rotate-6 transition-all duration-300 backdrop-blur-sm elevation-2 hover:elevation-glow-primary">
                    {link.icon ? (
                      <img
                        src={link.icon.getDirectURL()}
                        alt={link.displayName}
                        className="w-6 h-6 object-contain"
                      />
                    ) : IconComponent ? (
                      <IconComponent className="text-foreground group-hover/social:text-primary transition-colors duration-300" />
                    ) : (
                      <span className="text-xs font-bold text-foreground group-hover/social:text-primary transition-colors duration-300">
                        {link.platform.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                </a>
              );
            })}
          </div>
          {isAdmin && editingSocialMedia && (
            <div className="absolute top-full left-0 mt-2 p-4 bg-card border border-border rounded-lg shadow-lg z-10 w-full max-w-sm glass-effect">
              <p className="text-sm text-muted-foreground">
                Manage social media links in the Admin Panel under the "Social Media" tab.
              </p>
            </div>
          )}
        </div>
      ),
    },
    // Add custom sections
    ...sortedCustomSections.map((section) => ({
      id: `custom-${section.order}`,
      title: section.title,
      order: 3 + Number(section.order),
      component: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed hover:text-foreground transition-colors duration-300 whitespace-pre-wrap">
            {section.content}
          </p>
        </div>
      ),
    })),
  ];

  // Calculate grid columns based on number of sections
  const gridCols = allSections.length <= 2 ? 'md:grid-cols-2' : allSections.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-4';

  return (
    <footer className="relative bg-background border-t border-border/50 overflow-hidden">
      {/* Animated Background Effects Layer - Matching Hero Section */}
      {heroTheme && !themeLoading && (
        <div className="absolute inset-0 pointer-events-none">
          <HeroMultiEffectsLayer
            particleEffect={heroTheme.particleEffect}
            motionEffect={heroTheme.motionEffect}
            vectorEffect={heroTheme.vectorEffect}
            enabled={heroTheme.effectsEnabled}
          />
        </div>
      )}
      
      {/* Static Background Gradients (fallback when effects are disabled) */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--secondary)/0.08),transparent_50%)]" />
      
      <div className="container relative z-10 py-16">
        {/* Main Footer Grid */}
        <div className={`grid gap-12 ${gridCols} animate-fade-in`}>
          {allSections.map((section) => (
            <div key={section.id} className="space-y-6 group">
              <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                {section.title}
              </h3>
              {section.component}
            </div>
          ))}
        </div>

        {/* Footer Bottom Section */}
        <div className="mt-16 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <EditableFooterContent
              field="copyright"
              content={copyright}
              isAdmin={isAdmin ?? false}
              className="text-muted-foreground text-center md:text-left hover:text-foreground transition-colors duration-300"
            />
            
            {/* Attribution */}
            <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 group/love">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-500 group-hover/love:scale-125 group-hover/love:animate-pulse transition-transform duration-300" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:from-secondary hover:to-accent transition-all duration-300"
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
