import { useIsCallerAdmin, useGetWebsiteContent, useGetHeroBackgroundImage, useGetHeroSectionTheme, useGetHomepageTextFormatting } from '../hooks/useQueries';
import { useHeroLayoutPreset } from '../hooks/useHeroLayoutPreset';
import { Skeleton } from '@/components/ui/skeleton';
import EditableImage from './EditableImage';
import EditableHeroContent from './EditableHeroContent';
import HeroMultiEffectsLayer from './hero/HeroMultiEffectsLayer';
import { Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { normalizeHeroTheme, getEffectiveAreaDimensions, getEffectiveContentPosition, isManualPositioningEnabled } from '../utils/heroThemeDefaults';
import type { TextFormattingBundle } from '../backend';

export default function Hero() {
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: websiteContent, isLoading: contentLoading } = useGetWebsiteContent();
  const { data: heroBackground, isLoading: backgroundLoading } = useGetHeroBackgroundImage();
  const { data: rawHeroTheme } = useGetHeroSectionTheme();
  const { data: textFormatting } = useGetHomepageTextFormatting();
  const { theme } = useTheme();

  const heroTheme = normalizeHeroTheme(rawHeroTheme ?? null);
  const heroSection = websiteContent?.heroSection;
  const isDarkMode = theme === 'dark';
  
  // Robust background handling with fallbacks
  const backgroundImageUrl = isDarkMode && heroBackground?.darkMode
    ? heroBackground.darkMode.getDirectURL()
    : heroBackground?.standard?.getDirectURL();

  const { config: layoutConfig } = useHeroLayoutPreset(backgroundImageUrl, isDarkMode);

  const headline = heroSection?.headline ?? '';
  const subtext = heroSection?.subtext ?? '';
  const primaryButtonText = heroSection?.primaryButton?.text ?? '';
  const primaryButtonLink = heroSection?.primaryButton?.link ?? '';
  const secondaryButtonText = heroSection?.secondaryButton?.text ?? '';
  const secondaryButtonLink = heroSection?.secondaryButton?.link ?? '';

  const hasContent = headline || subtext || primaryButtonText || secondaryButtonText;
  const isLoading = adminLoading || contentLoading;

  const verticalPadding = heroTheme?.spacing?.verticalPadding ? Number(heroTheme.spacing.verticalPadding) : 10;
  const elementSpacing = heroTheme?.spacing?.elementSpacing ? Number(heroTheme.spacing.elementSpacing) : 5;
  const transparency = heroTheme?.glassmorphism?.transparency ? Number(heroTheme.glassmorphism.transparency) : 50;
  const blurIntensity = heroTheme?.glassmorphism?.blurIntensity ? Number(heroTheme.glassmorphism.blurIntensity) : 10;
  const gradientIntensity = heroTheme?.gradient?.intensity ? Number(heroTheme.gradient.intensity) : 50;
  const overlayEffect = heroTheme?.glassmorphism?.overlayEffect ?? 'medium';

  // Layout override values from admin settings
  const layoutOverride = heroTheme?.layoutOverride;
  const contentContainerPreset = layoutOverride?.contentContainerPreset ?? 'large';
  const explicitMaxWidth = layoutOverride?.explicitMaxWidth ? Number(layoutOverride.explicitMaxWidth) : null;
  const textSizePreset = layoutOverride?.textSizePreset ?? 'large';
  const verticalPlacement = layoutOverride?.verticalPlacement ?? 'center';
  const horizontalAlignment = layoutOverride?.horizontalAlignment ?? 'center';
  const ctaRowLayout = layoutOverride?.ctaRowLayout ?? 'row';

  // Hero area dimensions with validation
  const areaDimensions = getEffectiveAreaDimensions(heroTheme);
  const minHeight = `${areaDimensions.height}px`;

  // Manual content positioning with validation
  const contentPosition = getEffectiveContentPosition(heroTheme);
  const manualPositioningEnabled = isManualPositioningEnabled(heroTheme);

  // Effects configuration
  const effectsEnabled = heroTheme?.effectsEnabled ?? false;

  // Compute overlay styles with safe defaults
  const overlayOpacityMap = {
    subtle: 0.2,
    medium: 0.4,
    strong: 0.6,
  };
  const overlayOpacity = overlayOpacityMap[overlayEffect];

  // Container width: prefer explicit, then preset
  let containerMaxWidth: string;
  if (explicitMaxWidth && explicitMaxWidth > 0) {
    containerMaxWidth = `${Math.min(explicitMaxWidth, 2000)}px`;
  } else {
    const containerWidthPresetMap = {
      medium: '48rem',
      large: '64rem',
      full: '100%',
    };
    containerMaxWidth = containerWidthPresetMap[contentContainerPreset];
  }

  // Text size mapping
  const textSizeMap = {
    medium: {
      headline: 'text-4xl md:text-5xl lg:text-6xl',
      subtext: 'text-lg md:text-xl',
    },
    large: {
      headline: 'text-5xl md:text-6xl lg:text-7xl',
      subtext: 'text-xl md:text-2xl',
    },
    extraLarge: {
      headline: 'text-6xl md:text-7xl lg:text-8xl',
      subtext: 'text-2xl md:text-3xl',
    },
  };
  const textSizes = textSizeMap[textSizePreset];

  // Alignment classes
  const alignmentClassMap = {
    left: 'items-start text-left',
    center: 'items-center text-center',
    right: 'items-end text-right',
  };
  const finalAlignment = alignmentClassMap[horizontalAlignment];

  // Vertical placement
  const verticalPlacementMap = {
    top: 'justify-start',
    center: 'justify-center',
    bottom: 'justify-end',
  };
  const verticalClass = verticalPlacementMap[verticalPlacement];

  // CTA button layout
  const ctaLayoutClass = ctaRowLayout === 'stacked' ? 'flex-col' : 'flex-row flex-wrap';
  const ctaJustifyClass = horizontalAlignment === 'center' ? 'justify-center' : 
                          horizontalAlignment === 'right' ? 'justify-end' : 
                          'justify-start';

  // Fallback background when no image exists
  const hasFallbackBackground = !backgroundImageUrl;

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

  const headlineStyle = getFormattingStyle(textFormatting?.heroHeading);
  const bodyStyle = getFormattingStyle(textFormatting?.heroBody);

  return (
    <section 
      className={`relative overflow-hidden flex items-center ${verticalClass}`}
      style={{ minHeight }}
    >
      {/* Fallback gradient background when no image */}
      {hasFallbackBackground && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/30 via-secondary/20 to-accent/30" />
      )}
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 z-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20"
        style={{ opacity: gradientIntensity / 100 }}
      />
      
      {/* Background image layer */}
      <div className="absolute inset-0 z-0">
        {isAdmin ? (
          <EditableImage
            imageId="hero-background"
            alt="Hero background"
            className="w-full h-full object-cover"
            isAdmin={isAdmin ?? false}
            description="Hero Section Background"
            supportsDarkMode={true}
          />
        ) : backgroundImageUrl ? (
          <div 
            className="w-full h-full bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          />
        ) : null}
      </div>

      {/* Multi-Effects Layer with smooth transitions */}
      {heroTheme && (
        <HeroMultiEffectsLayer
          particleEffect={heroTheme.particleEffect}
          motionEffect={heroTheme.motionEffect}
          vectorEffect={heroTheme.vectorEffect}
          enabled={effectsEnabled}
        />
      )}

      {/* Glassmorphism overlay with validated blur */}
      <div 
        className="absolute inset-0 z-5 bg-gradient-to-b from-background via-background to-background transition-all duration-500"
        style={{
          backdropFilter: `blur(${Math.min(blurIntensity, 50)}px)`,
          WebkitBackdropFilter: `blur(${Math.min(blurIntensity, 50)}px)`,
          opacity: overlayOpacity,
        }}
      />
      
      <div 
        className="container relative z-20 w-full"
        style={{ 
          paddingTop: `${verticalPadding * 0.25}rem`,
          paddingBottom: `${verticalPadding * 0.25}rem`,
        }}
      >
        <div 
          className="mx-auto transition-transform duration-500" 
          style={{ 
            maxWidth: containerMaxWidth,
            transform: manualPositioningEnabled 
              ? `translate(${contentPosition.x}px, ${contentPosition.y}px)` 
              : undefined,
          }}
        >
          <div className="relative backdrop-blur-xl bg-background/30 dark:bg-background/20 rounded-3xl p-8 md:p-12 lg:p-16 border border-white/20 dark:border-white/10 shadow-elevation-4 transition-all duration-500 hover:shadow-elevation-5">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            
            <div className={`relative z-10 flex flex-col ${finalAlignment}`}>
              {isLoading ? (
                <div className="space-y-8 w-full">
                  <Skeleton className="h-20 md:h-24 w-3/4 mx-auto bg-foreground/10 rounded-xl" />
                  <Skeleton className="h-8 md:h-10 w-2/3 mx-auto bg-foreground/10 rounded-xl" />
                  <div className="flex gap-6 justify-center flex-wrap">
                    <Skeleton className="h-12 md:h-14 w-36 md:w-40 bg-foreground/10 rounded-xl" />
                    <Skeleton className="h-12 md:h-14 w-36 md:w-40 bg-foreground/10 rounded-xl" />
                  </div>
                </div>
              ) : !hasContent && !isAdmin ? (
                <div className="py-20 animate-fade-in w-full text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary mb-8 shadow-glow-primary">
                    <Sparkles className="h-10 w-10 text-white animate-pulse" />
                  </div>
                  <p className="text-muted-foreground text-xl font-medium">Hero section content will appear here</p>
                </div>
              ) : (
                <>
                  {(headline || isAdmin) && (
                    <div 
                      className="animate-fade-in transition-all duration-500 hover:scale-[1.02] w-full" 
                      style={{ 
                        animationDelay: '100ms',
                        marginBottom: `${elementSpacing * 0.25}rem`,
                      }}
                    >
                      <EditableHeroContent
                        field="headline"
                        content={headline}
                        isAdmin={isAdmin ?? false}
                        className={`${textSizes.headline} font-extrabold tracking-tight leading-tight mb-0 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent drop-shadow-lg`}
                        style={headlineStyle}
                      />
                    </div>
                  )}

                  {(subtext || isAdmin) && (
                    <div 
                      className="animate-fade-in transition-all duration-500 hover:scale-[1.01] w-full" 
                      style={{ 
                        animationDelay: '200ms',
                        marginBottom: `${elementSpacing * 0.5}rem`,
                      }}
                    >
                      <EditableHeroContent
                        field="subtext"
                        content={subtext}
                        isAdmin={isAdmin ?? false}
                        className={`${textSizes.subtext} text-foreground/90 dark:text-foreground/80 leading-relaxed ${horizontalAlignment === 'center' ? 'max-w-3xl mx-auto' : 'max-w-3xl'} font-medium drop-shadow-md`}
                        style={bodyStyle}
                      />
                    </div>
                  )}

                  {((primaryButtonText || secondaryButtonText) || isAdmin) && (
                    <div 
                      className={`flex ${ctaLayoutClass} ${ctaJustifyClass} gap-6 animate-fade-in`} 
                      style={{ animationDelay: '300ms' }}
                    >
                      {(primaryButtonText || isAdmin) && (
                        <EditableHeroContent
                          field="primaryButton"
                          content={primaryButtonText}
                          link={primaryButtonLink}
                          isAdmin={isAdmin ?? false}
                          isButton={true}
                          buttonVariant="primary"
                        />
                      )}
                      {(secondaryButtonText || isAdmin) && (
                        <EditableHeroContent
                          field="secondaryButton"
                          content={secondaryButtonText}
                          link={secondaryButtonLink}
                          isAdmin={isAdmin ?? false}
                          isButton={true}
                          buttonVariant="secondary"
                        />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent z-20 backdrop-blur-sm" />
    </section>
  );
}
