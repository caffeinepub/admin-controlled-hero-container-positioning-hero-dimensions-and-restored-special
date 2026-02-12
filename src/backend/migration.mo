import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Storage "blob-storage/Storage";

module {
  // Old Types (identical to previous main.mo)
  type OldPosition = {
    x : Int;
    y : Int;
  };

  type OldAreaDimensions = {
    width : Nat;
    height : Nat;
  };

  type OldHeroSectionTheme = {
    themeType : OldThemeType;
    particleEffect : OldParticleEffect;
    motionEffect : OldMotionEffect;
    vectorEffect : OldVectorEffect;
    spacing : OldSpacing;
    glassmorphism : OldGlassmorphism;
    colorAccents : OldColorAccents;
    gradient : OldGradient;
    layoutOverride : OldHeroLayoutOverride;
    contentPosition : OldPosition;
    areaDimensions : OldAreaDimensions;
    effectsEnabled : Bool;
  };

  type OldThemeType = {
    mode : { #light; #dark };
    accent : { #blue; #teal; #magenta };
    gradientStyle : { #linear; #radial };
  };

  type OldParticleEffect = {
    effectType : OldParticleEffectType;
    intensity : OldEffectIntensity;
    colorVariation : OldColorVariation;
    speed : OldEffectSpeed;
    enabled : Bool;
  };

  type OldParticleEffectType = {
    #bubbles;
    #confetti;
    #sparkles;
    #stethoscopeParticles;
    #crossParticles;
  };

  type OldEffectIntensity = { #subtle; #moderate; #dynamic };
  type OldColorVariation = { #mono; #accent; #gradient };
  type OldEffectSpeed = { #slow; #medium; #fast };

  type OldMotionEffect = {
    effectType : OldMotionEffectType;
    speed : OldMotionSpeed;
    amplitude : OldMotionAmplitude;
    pattern : OldMotionPattern;
    enabled : Bool;
  };

  type OldMotionEffectType = {
    #floatingMotion;
    #waveMotion;
    #wave;
    #bounce;
    #spiral;
    #random;
  };

  type OldMotionSpeed = { #slow; #medium; #fast };
  type OldMotionAmplitude = { #low; #medium; #high };

  type OldMotionPattern = {
    patternType : { #wave; #bounce; #spiral; #random };
    complexity : Nat;
  };

  type OldVectorEffect = {
    effectType : OldVectorEffectType;
    complexity : OldVectorComplexity;
    colorScheme : OldColorAccentScheme;
    enabled : Bool;
  };

  type OldVectorEffectType = {
    #geometricPatterns;
    #animatedPaths;
    #gradientOverlays;
  };

  type OldVectorComplexity = { #simple; #moderate; #complex };
  type OldColorAccentScheme = { #primary; #secondary; #gradient };

  type OldSpacing = {
    verticalPadding : Nat;
    contentAlignment : { #left; #center; #right };
    elementSpacing : Nat;
  };

  type OldGlassmorphism = {
    transparency : Nat;
    blurIntensity : Nat;
    overlayEffect : { #subtle; #medium; #strong };
  };

  type OldColorAccents = {
    primary : OldColor;
    secondary : OldColor;
  };

  type OldColor = {
    red : Nat;
    green : Nat;
    blue : Nat;
  };

  type OldGradient = {
    direction : { #leftToRight; #topToBottom };
    intensity : Nat;
    colors : [OldColor];
  };

  type OldSocialMediaLink = {
    platform : Text;
    displayName : Text;
    url : Text;
    icon : ?Storage.ExternalBlob;
    iconSize : Nat;
    order : Nat;
    isVisible : Bool;
  };

  type OldClinic = {
    id : Text;
    name : Text;
    address : Text;
    contactDetails : Text;
    hours : Text;
    mapLink : Text;
    bookingUrl : ?Text;
    image : ?Storage.ExternalBlob;
  };

  type OldService = {
    id : Text;
    name : Text;
    description : Text;
  };

  type OldFooterContact = {
    address : Text;
    phone : Text;
    email : Text;
  };

  type OldFooterLink = {
    name : Text;
    url : Text;
  };

  type OldFooterContent = {
    contact : OldFooterContact;
    quickLinks : [OldFooterLink];
    copyright : Text;
    background : ?Storage.ExternalBlob;
  };

  type OldWebsiteImage = {
    id : Text;
    description : Text;
    image : Storage.ExternalBlob;
    darkModeImage : ?Storage.ExternalBlob;
  };

  type OldHeroSection = {
    headline : Text;
    subtext : Text;
    primaryButton : OldButton;
    secondaryButton : ?OldButton;
  };

  type OldButton = {
    text : Text;
    link : Text;
  };

  type OldUserProfile = {
    name : Text;
  };

  type OldDoctorCredentials = {
    name : Text;
    qualifications : Text;
    specializations : Text;
    yearsOfExperience : Text;
    achievements : Text;
    profileImage : ?Storage.ExternalBlob;
  };

  type OldHeroLayoutOverride = {
    contentContainerPreset : OldMaxWidthPreset;
    explicitMaxWidth : ?Nat;
    textSizePreset : OldTextSizePreset;
    verticalPlacement : OldVerticalPosition;
    horizontalAlignment : OldHorizontalAlignment;
    ctaRowLayout : OldCTARowLayout;
  };

  type OldMaxWidthPreset = { #medium; #large; #full };
  type OldTextSizePreset = { #medium; #large; #extraLarge };
  type OldVerticalPosition = { #top; #center; #bottom };
  type OldHorizontalAlignment = { #left; #center; #right };
  type OldCTARowLayout = { #row; #stacked };
  type OldAnimationPattern = { #wave; #bounce; #spiral; #random };

  type OldWebsiteContent = {
    overviewContent : Text;
    aboutContent : Text;
    theme : { #light; #dark };
    heroSection : OldHeroSection;
    doctorCredentials : OldDoctorCredentials;
  };

  type OldConfig = {
    canonicalUrl : Text;
    terms : Text;
  };

  type OldActor = {
    clinics : Map.Map<Text, OldClinic>;
    services : Map.Map<Text, OldService>;
    socialMediaLinks : Map.Map<Text, OldSocialMediaLink>;
    images : Map.Map<Text, OldWebsiteImage>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    websiteContent : OldWebsiteContent;
    config : OldConfig;
    footerContent : OldFooterContent;
    heroSectionTheme : OldHeroSectionTheme;
  };

  // New Types (as current main.mo type definitions)
  type NewParticleEffectType = {
    #bubbles;
    #confetti;
    #sparkles;
    #stethoscopeParticles;
    #crossParticles;
    #dots;
    #rings;
    #swirls;
    #lines;
  };

  type NewParticleEffect = {
    effectType : NewParticleEffectType;
    intensity : { #subtle; #moderate; #dynamic };
    colorVariation : { #mono; #accent; #gradient };
    speed : { #slow; #medium; #fast };
    enabled : Bool;
  };

  type NewHeroSectionTheme = {
    themeType : OldThemeType;
    particleEffect : NewParticleEffect;
    motionEffect : OldMotionEffect;
    vectorEffect : OldVectorEffect;
    spacing : OldSpacing;
    glassmorphism : OldGlassmorphism;
    colorAccents : OldColorAccents;
    gradient : OldGradient;
    layoutOverride : OldHeroLayoutOverride;
    contentPosition : OldPosition;
    areaDimensions : OldAreaDimensions;
    effectsEnabled : Bool;
  };

  type NewActor = {
    clinics : Map.Map<Text, OldClinic>;
    services : Map.Map<Text, OldService>;
    socialMediaLinks : Map.Map<Text, OldSocialMediaLink>;
    images : Map.Map<Text, OldWebsiteImage>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    websiteContent : OldWebsiteContent;
    config : OldConfig;
    footerContent : OldFooterContent;
    heroSectionTheme : NewHeroSectionTheme;
  };

  public func run(old : OldActor) : NewActor {
    let newParticleEffect : NewParticleEffect = {
      effectType = switch (old.heroSectionTheme.particleEffect.effectType) {
        case (#bubbles) { #bubbles };
        case (#confetti) { #confetti };
        case (#sparkles) { #sparkles };
        case (#stethoscopeParticles) { #stethoscopeParticles };
        case (#crossParticles) { #crossParticles };
      };
      intensity = old.heroSectionTheme.particleEffect.intensity;
      colorVariation = old.heroSectionTheme.particleEffect.colorVariation;
      speed = old.heroSectionTheme.particleEffect.speed;
      enabled = old.heroSectionTheme.particleEffect.enabled;
    };

    let newHeroSectionTheme : NewHeroSectionTheme = {
      old.heroSectionTheme with
      particleEffect = newParticleEffect
    };

    {
      old with heroSectionTheme = newHeroSectionTheme
    };
  };
};
