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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToBlogs = () => {
    window.location.hash = '#/blogs';
  };

  const handleQuickLinkClick = (url: string) => {
    if (url.startsWith('#')) {
      const sectionId = url.substring(1);
      const section = navigationSections.find(s => s.id === sectionId);
      if (section) {
        if (section.type === 'route') {
          navigateToBlogs();
        } else {
          scrollToSection(sectionId);
        }
      }
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Sort sections by order field
  const sortedSections = [...customSections].sort((a, b) => Number(a.order) - Number(b.order));

  if (isLoading) {
    return (
      <footer className="relative bg-gradient-to-br from-background via-muted/30 to-background border-t overflow-hidden">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
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

  return (
    <footer className="relative bg-gradient-to-br from-background via-muted/30 to-background border-t overflow-hidden">
      {/* Background Effects Layer */}
      {heroTheme && !themeLoading && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <HeroMultiEffectsLayer
            particleEffect={heroTheme.particleEffect}
            motionEffect={heroTheme.motionEffect}
            vectorEffect={heroTheme.vectorEffect}
            enabled={heroTheme.effectsEnabled}
          />
        </div>
      )}

      <div className="relative z-10 container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              {contact?.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <EditableFooterContent
                    content={contact.address}
                    field="address"
                    isAdmin={!!isAdmin}
                  />
                </div>
              )}
              {contact?.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <EditableFooterContent
                    content={contact.phone}
                    field="phone"
                    isAdmin={!!isAdmin}
                  />
                </div>
              )}
              {contact?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <EditableFooterContent
                    content={contact.email}
                    field="email"
                    isAdmin={!!isAdmin}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setEditingQuickLinks(!editingQuickLinks)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
            </div>
            <ul className="space-y-2 text-sm">
              {footerContent?.quickLinks && footerContent.quickLinks.length > 0 ? (
                footerContent.quickLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleQuickLinkClick(link.url)}
                      className="text-muted-foreground hover:text-primary transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground italic">No quick links available</li>
              )}
            </ul>
          </div>

          {/* Custom Sections */}
          {sortedSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
              <div className="text-sm text-muted-foreground whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}

          {/* Social Media Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Follow Us</h3>
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setEditingSocialMedia(!editingSocialMedia)}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
            </div>
            {visibleSocialLinks.length > 0 ? (
              <div className="flex gap-4">
                {visibleSocialLinks.map((link) => {
                  const IconComponent = socialIconMap[link.platform.toLowerCase()];
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={link.displayName}
                    >
                      {IconComponent ? (
                        <IconComponent className="h-5 w-5" />
                      ) : (
                        <span className="text-sm">{link.displayName}</span>
                      )}
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No social media links available</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <EditableFooterContent
                content={copyright || `© ${new Date().getFullYear()} Dr. Malay Akechan. All rights reserved.`}
                field="copyright"
                isAdmin={!!isAdmin}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-primary transition-colors"
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
