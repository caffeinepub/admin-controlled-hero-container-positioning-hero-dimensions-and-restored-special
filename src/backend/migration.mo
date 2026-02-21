import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type Position = { x : Int; y : Int };
  type AreaDimensions = { width : Nat; height : Nat };
  type ThemeType = { mode : { #light; #dark }; accent : { #blue; #teal; #magenta }; gradientStyle : { #linear; #radial } };
  type ParticleEffect = { effectType : { #bubbles; #confetti; #sparkles; #stethoscopeParticles; #crossParticles; #dots; #rings; #swirls; #lines }; intensity : { #subtle; #moderate; #dynamic }; colorVariation : { #mono; #accent; #gradient }; speed : { #slow; #medium; #fast }; enabled : Bool; };
  type MotionEffect = { effectType : { #floatingMotion; #waveMotion; #wave; #bounce; #spiral; #random }; speed : { #slow; #medium; #fast }; amplitude : { #low; #medium; #high }; pattern : { patternType : { #wave; #bounce; #spiral; #random }; complexity : Nat }; enabled : Bool; };
  type VectorEffect = { effectType : { #geometricPatterns; #animatedPaths; #gradientOverlays }; complexity : { #simple; #moderate; #complex }; colorScheme : { #primary; #secondary; #gradient }; enabled : Bool; };
  type Spacing = { verticalPadding : Nat; contentAlignment : { #left; #center; #right }; elementSpacing : Nat };
  type Glassmorphism = { transparency : Nat; blurIntensity : Nat; overlayEffect : { #subtle; #medium; #strong } };
  type ColorAccents = { primary : Color; secondary : Color };
  type Color = { red : Nat; green : Nat; blue : Nat };
  type Gradient = { direction : { #leftToRight; #topToBottom }; intensity : Nat; colors : [Color] };
  type SocialMediaLink = { platform : Text; displayName : Text; url : Text; icon : ?Storage.ExternalBlob; iconSize : Nat; order : Nat; isVisible : Bool };

  type Clinic = { id : Text; name : Text; address : Text; contactDetails : Text; hours : Text; mapLink : Text; bookingUrl : ?Text; image : ?Storage.ExternalBlob };
  type Service = { id : Text; name : Text; description : Text };

  type FooterContact = { address : Text; phone : Text; email : Text };
  type FooterLink = { name : Text; url : Text };

  // Types for Old and New FooterContent
  type OldFooterContent = {
    contact : FooterContact;
    quickLinks : [FooterLink];
    copyright : Text;
    background : ?Storage.ExternalBlob;
  };

  type WebsiteImage = {
    id : Text;
    description : Text;
    image : Storage.ExternalBlob;
    darkModeImage : ?Storage.ExternalBlob;
  };

  type HeroSection = {
    headline : Text;
    subtext : Text;
    primaryButton : Button;
    secondaryButton : ?Button;
  };

  type Button = { text : Text; link : Text };
  type UserProfile = { name : Text };
  type DoctorCredentials = {
    name : Text;
    qualifications : Text;
    specializations : Text;
    yearsOfExperience : Text;
    achievements : Text;
    profileImage : ?Storage.ExternalBlob;
  };
  type Review = { id : Text; patientName : Text; rating : Nat; reviewText : Text; patientImage : ?Storage.ExternalBlob };
  type HeroLayoutOverride = { contentContainerPreset : { #medium; #large; #full }; explicitMaxWidth : ?Nat; textSizePreset : { #medium; #large; #extraLarge }; verticalPlacement : { #top; #center; #bottom }; horizontalAlignment : { #left; #center; #right }; ctaRowLayout : { #row; #stacked } };
  type AnimationPattern = { #wave; #bounce; #spiral; #random };
  type WebsiteContent = {
    overviewContent : Text;
    aboutContent : Text;
    theme : { #light; #dark };
    heroSection : HeroSection;
    doctorCredentials : DoctorCredentials;
  };

  type ReviewsPanelSettings = {
    carouselEnabled : Bool;
    autoScrollSpeed : Nat;
    transitionType : { #slide; #fade; #card; #glassmorphic; #blur; #none };
    displayMode : { #single; #multi; #centered; #masonry };
    maxReviews : Nat;
    contentLayout : {
      layoutType : { #singleColumn; #multiColumn; #cardStyle; #overlay };
      style : { #minimalist; #card; #glassmorphic; #gradient; #frosted };
      spacingUnit : Nat;
      paddingUnit : Nat;
    };
    overlayEffect : {
      transparency : Nat;
      blurIntensity : Nat;
      overlayEffect : { #subtle; #medium; #strong };
    };
    primaryColor : { red : Nat; green : Nat; blue : Nat };
    secondaryColor : { red : Nat; green : Nat; blue : Nat };
    gradientSettings : {
      direction : { #leftToRight; #topToBottom; #diagonal };
      intensity : Nat;
      colors : [{
        red : Nat;
        green : Nat;
        blue : Nat;
      }];
    };
    darkModeSupport : Bool;
    revealAnimation : {
      animationType : { #slideIn; #pop; #fade; #expand; #none };
      delayUnit : Nat;
      speedUnit : Nat;
      easing : { #easeInOut; #linear; #bounce };
    };
  };

  type Config = { canonicalUrl : Text; terms : Text };

  // Blog Data Types
  type RichContentElement = {
    #text : { content : Text };
    #image : { blob : Storage.ExternalBlob; description : Text };
    #video : { blob : Storage.ExternalBlob; description : Text };
  };
  type BlogPost = {
    id : Text;
    title : Text;
    author : Text;
    content : [RichContentElement];
    createdAt : Nat;
    updatedAt : Nat;
  };

  // Types for new FooterContent with FooterSection support
  type FooterSection = { title : Text; content : Text; order : Nat; divider : Bool };
  type NewFooterContent = {
    contact : FooterContact;
    quickLinks : [FooterLink];
    sections : [FooterSection];
    copyright : Text;
    background : ?Storage.ExternalBlob;
  };

  // Old actor state (no FooterSection support)
  type OldActor = {
    clinics : Map.Map<Text, Clinic>;
    services : Map.Map<Text, Service>;
    socialMediaLinks : Map.Map<Text, SocialMediaLink>;
    images : Map.Map<Text, WebsiteImage>;
    userProfiles : Map.Map<Principal, UserProfile>;
    reviews : Map.Map<Text, Review>;
    blogPosts : Map.Map<Text, BlogPost>;
    reviewsPanelSettings : ReviewsPanelSettings;
    websiteContent : WebsiteContent;
    config : Config;
    footerContent : OldFooterContent;
    heroSectionTheme : {
      themeType : ThemeType;
      particleEffect : ParticleEffect;
      motionEffect : MotionEffect;
      vectorEffect : VectorEffect;
      spacing : Spacing;
      glassmorphism : Glassmorphism;
      colorAccents : ColorAccents;
      gradient : Gradient;
      layoutOverride : HeroLayoutOverride;
      contentPosition : Position;
      areaDimensions : AreaDimensions;
      effectsEnabled : Bool;
    };
  };

  // New actor state (with FooterSection support)
  type NewActor = {
    clinics : Map.Map<Text, Clinic>;
    services : Map.Map<Text, Service>;
    socialMediaLinks : Map.Map<Text, SocialMediaLink>;
    images : Map.Map<Text, WebsiteImage>;
    userProfiles : Map.Map<Principal, UserProfile>;
    reviews : Map.Map<Text, Review>;
    blogPosts : Map.Map<Text, BlogPost>;
    reviewsPanelSettings : ReviewsPanelSettings;
    websiteContent : WebsiteContent;
    config : Config;
    footerContent : NewFooterContent;
    heroSectionTheme : {
      themeType : ThemeType;
      particleEffect : ParticleEffect;
      motionEffect : MotionEffect;
      vectorEffect : VectorEffect;
      spacing : Spacing;
      glassmorphism : Glassmorphism;
      colorAccents : ColorAccents;
      gradient : Gradient;
      layoutOverride : HeroLayoutOverride;
      contentPosition : Position;
      areaDimensions : AreaDimensions;
      effectsEnabled : Bool;
    };
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    {
      old with
      footerContent = {
        old.footerContent with
        sections = [];
      };
    };
  };
};
