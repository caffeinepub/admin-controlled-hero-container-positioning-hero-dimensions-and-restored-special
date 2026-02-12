import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Authorization State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type ThemePreference = { #light; #dark };
  public type Section = { #overviewContent; #aboutContent };

  public type Position = {
    x : Int;
    y : Int;
  };

  public type AreaDimensions = {
    width : Nat;
    height : Nat;
  };

  public type HeroSectionTheme = {
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

  public type ThemeType = {
    mode : { #light; #dark };
    accent : { #blue; #teal; #magenta };
    gradientStyle : { #linear; #radial };
  };

  public type ParticleEffect = {
    effectType : ParticleEffectType;
    intensity : EffectIntensity;
    colorVariation : ColorVariation;
    speed : EffectSpeed;
    enabled : Bool;
  };

  public type ParticleEffectType = {
    #bubbles;
    #confetti;
    #sparkles;
    #stethoscopeParticles;
    #crossParticles;
    #dots; // New effect type
    #rings; // New effect type
    #swirls; // New effect type
    #lines; // New effect type
  };

  public type EffectIntensity = { #subtle; #moderate; #dynamic };
  public type ColorVariation = { #mono; #accent; #gradient };
  public type EffectSpeed = { #slow; #medium; #fast };

  public type MotionEffect = {
    effectType : MotionEffectType;
    speed : MotionSpeed;
    amplitude : MotionAmplitude;
    pattern : MotionPattern;
    enabled : Bool;
  };

  public type MotionEffectType = {
    #floatingMotion;
    #waveMotion;
    #wave;
    #bounce;
    #spiral;
    #random;
  };

  public type MotionSpeed = { #slow; #medium; #fast };
  public type MotionAmplitude = { #low; #medium; #high };

  public type MotionPattern = {
    patternType : { #wave; #bounce; #spiral; #random };
    complexity : Nat;
  };

  public type VectorEffect = {
    effectType : VectorEffectType;
    complexity : VectorComplexity;
    colorScheme : ColorAccentScheme;
    enabled : Bool;
  };

  public type VectorEffectType = {
    #geometricPatterns;
    #animatedPaths;
    #gradientOverlays;
  };

  public type VectorComplexity = { #simple; #moderate; #complex };
  public type ColorAccentScheme = { #primary; #secondary; #gradient };

  public type Spacing = {
    verticalPadding : Nat;
    contentAlignment : { #left; #center; #right };
    elementSpacing : Nat;
  };

  public type Glassmorphism = {
    transparency : Nat;
    blurIntensity : Nat;
    overlayEffect : { #subtle; #medium; #strong };
  };

  public type ColorAccents = {
    primary : Color;
    secondary : Color;
  };

  public type Color = {
    red : Nat;
    green : Nat;
    blue : Nat;
  };

  public type Gradient = {
    direction : { #leftToRight; #topToBottom };
    intensity : Nat;
    colors : [Color];
  };

  public type SocialMediaLink = {
    platform : Text;
    displayName : Text;
    url : Text;
    icon : ?Storage.ExternalBlob;
    iconSize : Nat;
    order : Nat;
    isVisible : Bool;
  };

  public type Clinic = {
    id : Text;
    name : Text;
    address : Text;
    contactDetails : Text;
    hours : Text;
    mapLink : Text;
    bookingUrl : ?Text;
    image : ?Storage.ExternalBlob;
  };

  public type Service = {
    id : Text;
    name : Text;
    description : Text;
  };

  public type FooterContact = {
    address : Text;
    phone : Text;
    email : Text;
  };

  public type FooterLink = {
    name : Text;
    url : Text;
  };

  public type FooterContent = {
    contact : FooterContact;
    quickLinks : [FooterLink];
    copyright : Text;
    background : ?Storage.ExternalBlob;
  };

  public type WebsiteImage = {
    id : Text;
    description : Text;
    image : Storage.ExternalBlob;
    darkModeImage : ?Storage.ExternalBlob;
  };

  public type HeroSection = {
    headline : Text;
    subtext : Text;
    primaryButton : Button;
    secondaryButton : ?Button;
  };

  public type Button = {
    text : Text;
    link : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  public type DoctorCredentials = {
    name : Text;
    qualifications : Text;
    specializations : Text;
    yearsOfExperience : Text;
    achievements : Text;
    profileImage : ?Storage.ExternalBlob;
  };

  public type HeroLayoutOverride = {
    contentContainerPreset : MaxWidthPreset;
    explicitMaxWidth : ?Nat;
    textSizePreset : TextSizePreset;
    verticalPlacement : VerticalPosition;
    horizontalAlignment : HorizontalAlignment;
    ctaRowLayout : CTARowLayout;
  };

  public type MaxWidthPreset = { #medium; #large; #full };
  public type TextSizePreset = { #medium; #large; #extraLarge };
  public type VerticalPosition = { #top; #center; #bottom };
  public type HorizontalAlignment = { #left; #center; #right };
  public type CTARowLayout = { #row; #stacked };
  public type AnimationPattern = { #wave; #bounce; #spiral; #random };

  module Clinic {
    public func compare(c1 : Clinic, c2 : Clinic) : Order.Order {
      Text.compare(c1.name, c2.name);
    };
  };

  module Service {
    public func compare(s1 : Service, s2 : Service) : Order.Order {
      Text.compare(s1.name, s2.name);
    };
  };

  module SocialMediaLink {
    public func compare(link1 : SocialMediaLink, link2 : SocialMediaLink) : Order.Order {
      if (link1.order == link2.order) {
        Text.compare(link1.platform, link2.platform);
      } else {
        switch (Nat.compare(link1.order, link2.order)) {
          case (#less) { #less };
          case (#equal) { #equal };
          case (#greater) { #greater };
        };
      };
    };
  };

  public type WebsiteContent = {
    overviewContent : Text;
    aboutContent : Text;
    theme : ThemePreference;
    heroSection : HeroSection;
    doctorCredentials : DoctorCredentials;
  };

  public type Config = {
    canonicalUrl : Text;
    terms : Text;
  };

  // Persistent Data
  let clinics = Map.empty<Text, Clinic>();
  let services = Map.empty<Text, Service>();
  let socialMediaLinks = Map.empty<Text, SocialMediaLink>();
  let images = Map.empty<Text, WebsiteImage>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initial Content
  var websiteContent : WebsiteContent = {
    overviewContent = "";
    aboutContent = "";
    theme = #light;
    heroSection = {
      headline = "";
      subtext = "";
      primaryButton = {
        text = "";
        link = "";
      };
      secondaryButton = null;
    };
    doctorCredentials = {
      name = "";
      qualifications = "";
      specializations = "";
      yearsOfExperience = "";
      achievements = "";
      profileImage = null;
    };
  };

  let config : Config = {
    canonicalUrl = "https://drmalay.in";
    terms = "To set terms contact developer. Primary domain is always drmalay.in";
  };

  var footerContent : FooterContent = {
    contact = {
      address = "";
      phone = "";
      email = "";
    };
    quickLinks = [];
    copyright = "";
    background = null;
  };

  // New Hero Section Theme State with updated defaults
  var heroSectionTheme : HeroSectionTheme = {
    themeType = {
      mode = #light;
      accent = #blue;
      gradientStyle = #linear;
    };
    particleEffect = {
      effectType = #bubbles;
      intensity = #subtle;
      colorVariation = #mono;
      speed = #medium;
      enabled = false;
    };
    motionEffect = {
      effectType = #floatingMotion;
      speed = #medium;
      amplitude = #medium;
      pattern = {
        patternType = #wave;
        complexity = 3;
      };
      enabled = false;
    };
    vectorEffect = {
      effectType = #geometricPatterns;
      complexity = #moderate;
      colorScheme = #primary;
      enabled = false;
    };
    spacing = {
      verticalPadding = 10;
      contentAlignment = #center;
      elementSpacing = 5;
    };
    glassmorphism = {
      transparency = 50;
      blurIntensity = 10;
      overlayEffect = #subtle;
    };
    colorAccents = {
      primary = {
        red = 0;
        green = 174;
        blue = 239;
      };
      secondary = {
        red = 239;
        green = 65;
        blue = 54;
      };
    };
    gradient = {
      direction = #leftToRight;
      intensity = 50;
      colors = [
        { red = 195; green = 0; blue = 255 },
        { red = 0; green = 163; blue = 255 },
        { red = 255; green = 85; blue = 0 },
      ];
    };
    layoutOverride = {
      contentContainerPreset = #large;
      explicitMaxWidth = null;
      textSizePreset = #large;
      verticalPlacement = #center;
      horizontalAlignment = #center;
      ctaRowLayout = #row;
    };
    contentPosition = {
      x = 0;
      y = 0;
    };
    areaDimensions = {
      width = 1200;
      height = 800;
    };
    effectsEnabled = false;
  };

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public query func getConfig() : async Config {
    config;
  };

  // Public Queries - No authorization required (accessible to guests)
  public query func getWebsiteContent() : async WebsiteContent {
    websiteContent;
  };

  public query func getFooterContent() : async FooterContent {
    footerContent;
  };

  public query func getDoctorCredentials() : async DoctorCredentials {
    websiteContent.doctorCredentials;
  };

  public query func getAllClinics() : async [Clinic] {
    clinics.values().toArray().sort();
  };

  public query func getAllServices() : async [Service] {
    services.values().toArray().sort();
  };

  public query func getSortedSocialMediaLinks() : async [SocialMediaLink] {
    let linksArray = socialMediaLinks.values().toArray();
    linksArray.sort();
  };

  public query func getAllImages() : async [WebsiteImage] {
    images.values().toArray();
  };

  public query func getImage(id : Text) : async ?WebsiteImage {
    images.get(id);
  };

  public query func isImageDarkModeCompatible(imageId : Text) : async Bool {
    switch (images.get(imageId)) {
      case (?img) { img.darkModeImage != null };
      case (null) { false };
    };
  };

  public query func getHeroSectionTheme() : async HeroSectionTheme {
    heroSectionTheme;
  };

  public query func getHeroSectionBackgroundImage() : async ?{
    standard : Storage.ExternalBlob;
    darkMode : ?Storage.ExternalBlob;
  } {
    switch (images.get("hero-background")) {
      case (?bg) { ?{ standard = bg.image; darkMode = bg.darkModeImage } };
      case (null) { null };
    };
  };

  // Admin Functions - Admin-only authorization
  public shared ({ caller }) func updateWebsiteContent(content : WebsiteContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };
    websiteContent := content;
  };

  public shared ({ caller }) func updateFooterContent(content : FooterContent) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update footer content");
    };
    footerContent := content;
  };

  public shared ({ caller }) func addClinic(clinic : Clinic) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add clinics");
    };
    clinics.add(clinic.id, clinic);
  };

  public shared ({ caller }) func updateClinic(clinic : Clinic) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update clinics");
    };
    clinics.add(clinic.id, clinic);
  };

  public shared ({ caller }) func deleteClinic(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete clinics");
    };
    clinics.remove(id);
  };

  public shared ({ caller }) func addService(service : Service) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add services");
    };
    services.add(service.id, service);
  };

  public shared ({ caller }) func updateService(service : Service) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update services");
    };
    services.add(service.id, service);
  };

  public shared ({ caller }) func deleteService(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete services");
    };
    services.remove(id);
  };

  public shared ({ caller }) func addSocialMediaLink(link : SocialMediaLink) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add social media links");
    };
    socialMediaLinks.add(link.platform, link);
  };

  public shared ({ caller }) func updateSocialMediaLink(link : SocialMediaLink) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update social media links");
    };
    socialMediaLinks.add(link.platform, link);
  };

  public shared ({ caller }) func deleteSocialMediaLink(platform : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete social media links");
    };
    socialMediaLinks.remove(platform);
  };

  public shared ({ caller }) func addImage(image : WebsiteImage) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add images");
    };
    images.add(image.id, image);
  };

  public shared ({ caller }) func updateImage(image : WebsiteImage) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update images");
    };
    images.add(image.id, image);
  };

  public shared ({ caller }) func deleteImage(id : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete images");
    };
    images.remove(id);
  };

  public shared ({ caller }) func updateDoctorCredentials(credentials : DoctorCredentials) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update doctor credentials");
    };
    websiteContent := {
      websiteContent with doctorCredentials = credentials;
    };
  };

  public shared ({ caller }) func updateHeroSectionTheme(theme : HeroSectionTheme) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update hero section theme");
    };
    heroSectionTheme := theme;
  };
};
