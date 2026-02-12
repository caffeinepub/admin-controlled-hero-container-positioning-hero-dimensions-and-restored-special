import { Heart, MapPin, Phone, Mail, AlertCircle } from 'lucide-react';
import { useGetFooterContent, useGetAllSocialMediaLinks, useIsCallerAdmin } from '../hooks/useQueries';
import { SiFacebook, SiX, SiInstagram, SiLinkedin, SiYoutube } from 'react-icons/si';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EditableFooterContent from './EditableFooterContent';

export default function Footer() {
  const { data: footerContent, isLoading: footerLoading, error: footerError } = useGetFooterContent();
  const { data: socialLinks, isLoading: socialLoading, error: socialError } = useGetAllSocialMediaLinks();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const currentYear = new Date().getFullYear();
  const isLoading = footerLoading || socialLoading || adminLoading;

  const getIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('facebook')) return SiFacebook;
    if (platformLower.includes('twitter') || platformLower.includes('x')) return SiX;
    if (platformLower.includes('instagram')) return SiInstagram;
    if (platformLower.includes('linkedin')) return SiLinkedin;
    if (platformLower.includes('youtube')) return SiYoutube;
    return SiFacebook;
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { name: 'Home', url: '#hero' },
    { name: 'About', url: '#about' },
    { name: 'Services', url: '#services' },
    { name: 'Clinics', url: '#clinics' },
    { name: 'Contact', url: '#social' },
  ];

  const address = footerContent?.contact?.address ?? '';
  const phone = footerContent?.contact?.phone ?? '';
  const email = footerContent?.contact?.email ?? '';
  const copyright = footerContent?.copyright ?? '';

  const hasError = footerError || socialError;

  return (
    <footer className="relative border-t-2 border-primary/20 bg-gradient-to-b from-muted/30 to-muted/50 overflow-hidden">
      {/* Background Accent Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10 py-16 md:py-20">
        {hasError && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Some footer content failed to load. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12">
          {/* About Column */}
          <div className="space-y-5 animate-fade-in">
            <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dr. Malay Akechan
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              Providing exceptional healthcare services with compassion and expertise. Your health and well-being are our top priorities.
            </p>
          </div>

          {/* Contact Column */}
          <div className="space-y-5 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <h3 className="text-xl font-bold text-foreground">Contact</h3>
            <div className="space-y-4 text-base text-muted-foreground">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-5 w-full rounded-lg bg-foreground/10" />
                  <Skeleton className="h-5 w-3/4 rounded-lg bg-foreground/10" />
                  <Skeleton className="h-5 w-2/3 rounded-lg bg-foreground/10" />
                </div>
              ) : (
                <>
                  {(address || isAdmin) && (
                    <div className="flex items-start gap-3 hover:text-foreground transition-colors group">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <EditableFooterContent
                          content={address}
                          field="address"
                          isAdmin={isAdmin ?? false}
                        />
                      </div>
                    </div>
                  )}
                  {(phone || isAdmin) && (
                    <div className="flex items-center gap-3 hover:text-foreground transition-colors group">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors flex-shrink-0">
                        <Phone className="h-4 w-4 text-secondary" />
                      </div>
                      <EditableFooterContent
                        content={phone}
                        field="phone"
                        isAdmin={isAdmin ?? false}
                      />
                    </div>
                  )}
                  {(email || isAdmin) && (
                    <div className="flex items-center gap-3 hover:text-foreground transition-colors group">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors flex-shrink-0">
                        <Mail className="h-4 w-4 text-accent" />
                      </div>
                      <EditableFooterContent
                        content={email}
                        field="email"
                        isAdmin={isAdmin ?? false}
                      />
                    </div>
                  )}
                  {!address && !phone && !email && !isAdmin && (
                    <p className="text-base text-muted-foreground">Contact information will appear here</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-5 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-bold text-foreground">Quick Links</h3>
            <nav className="flex flex-col space-y-3 text-base">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  onClick={(e) => {
                    if (link.url.startsWith('#')) {
                      e.preventDefault();
                      scrollToSection(link.url.substring(1));
                    }
                  }}
                  className="text-muted-foreground hover:text-primary transition-all hover:translate-x-2 inline-block"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Social Media Column */}
          <div className="space-y-5 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <h3 className="text-xl font-bold text-foreground">Follow Us</h3>
            {isLoading ? (
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-12 rounded-xl bg-foreground/10" />
                ))}
              </div>
            ) : (
              <div className="flex gap-3 flex-wrap">
                {socialLinks && socialLinks.length > 0 ? (
                  socialLinks.map((link, index) => {
                    const Icon = getIcon(link.platform);
                    const gradients = [
                      'from-primary to-primary/70',
                      'from-secondary to-secondary/70',
                      'from-accent to-accent/70',
                      'from-success to-success/70',
                      'from-warning to-warning/70',
                    ];
                    return (
                      <a
                        key={link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[index % gradients.length]} text-white transition-all shadow-elevation-2 hover:shadow-glow-primary hover:scale-110 duration-300`}
                        aria-label={link.platform}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })
                ) : (
                  <p className="text-base text-muted-foreground">
                    {isAdmin ? 'Add social media links from the admin panel' : 'Social media links will appear here'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Divider with Gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent my-10" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 text-base text-muted-foreground">
          <div className="text-center md:text-left">
            {isLoading ? (
              <Skeleton className="h-5 w-64 rounded-lg bg-foreground/10" />
            ) : (
              <>
                {copyright || isAdmin ? (
                  <EditableFooterContent
                    content={copyright}
                    field="copyright"
                    isAdmin={isAdmin ?? false}
                  />
                ) : (
                  <span>© {currentYear}. All rights reserved.</span>
                )}
              </>
            )}
          </div>
          <div className="text-center md:text-right flex items-center gap-2">
            Built with{' '}
            <Heart className="inline h-5 w-5 text-red-500 fill-red-500 animate-pulse" />
            {' '}using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:from-secondary hover:to-accent transition-all"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
