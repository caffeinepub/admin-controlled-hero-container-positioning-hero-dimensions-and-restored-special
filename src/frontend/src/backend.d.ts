import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Glassmorphism {
    transparency: bigint;
    blurIntensity: bigint;
    overlayEffect: Variant_strong_subtle_medium;
}
export interface SocialMediaLink {
    url: string;
    displayName: string;
    order: bigint;
    icon?: ExternalBlob;
    platform: string;
    iconSize: bigint;
    isVisible: boolean;
}
export interface ParticleEffect {
    enabled: boolean;
    speed: EffectSpeed;
    effectType: ParticleEffectType;
    intensity: EffectIntensity;
    colorVariation: ColorVariation;
}
export interface MotionEffect {
    pattern: MotionPattern;
    amplitude: MotionAmplitude;
    enabled: boolean;
    speed: MotionSpeed;
    effectType: MotionEffectType;
}
export interface HeroSection {
    subtext: string;
    headline: string;
    primaryButton: Button;
    secondaryButton?: Button;
}
export interface HeroSectionTheme {
    layoutOverride: HeroLayoutOverride;
    gradient: Gradient;
    themeType: ThemeType;
    areaDimensions: AreaDimensions;
    contentPosition: Position;
    glassmorphism: Glassmorphism;
    spacing: Spacing;
    effectsEnabled: boolean;
    colorAccents: ColorAccents;
    motionEffect: MotionEffect;
    particleEffect: ParticleEffect;
    vectorEffect: VectorEffect;
}
export interface MotionPattern {
    complexity: bigint;
    patternType: Variant_wave_bounce_random_spiral;
}
export interface VectorEffect {
    complexity: VectorComplexity;
    enabled: boolean;
    effectType: VectorEffectType;
    colorScheme: ColorAccentScheme;
}
export interface FooterLink {
    url: string;
    name: string;
}
export interface DoctorCredentials {
    yearsOfExperience: string;
    profileImage?: ExternalBlob;
    name: string;
    qualifications: string;
    achievements: string;
    specializations: string;
}
export interface Color {
    red: bigint;
    blue: bigint;
    green: bigint;
}
export interface WebsiteImage {
    id: string;
    darkModeImage?: ExternalBlob;
    description: string;
    image: ExternalBlob;
}
export interface AreaDimensions {
    height: bigint;
    width: bigint;
}
export interface Gradient {
    direction: Variant_topToBottom_leftToRight;
    colors: Array<Color>;
    intensity: bigint;
}
export interface FooterContact {
    email: string;
    address: string;
    phone: string;
}
export interface Clinic {
    id: string;
    hours: string;
    mapLink: string;
    name: string;
    address: string;
    image?: ExternalBlob;
    bookingUrl?: string;
    contactDetails: string;
}
export interface HeroLayoutOverride {
    verticalPlacement: VerticalPosition;
    textSizePreset: TextSizePreset;
    contentContainerPreset: MaxWidthPreset;
    explicitMaxWidth?: bigint;
    horizontalAlignment: HorizontalAlignment;
    ctaRowLayout: CTARowLayout;
}
export interface Service {
    id: string;
    name: string;
    description: string;
}
export interface Config {
    terms: string;
    canonicalUrl: string;
}
export interface Spacing {
    verticalPadding: bigint;
    elementSpacing: bigint;
    contentAlignment: Variant_center_left_right;
}
export interface Button {
    link: string;
    text: string;
}
export interface ThemeType {
    accent: Variant_magenta_blue_teal;
    mode: Variant_dark_light;
    gradientStyle: Variant_radial_linear;
}
export interface Position {
    x: bigint;
    y: bigint;
}
export interface FooterContent {
    contact: FooterContact;
    background?: ExternalBlob;
    quickLinks: Array<FooterLink>;
    copyright: string;
}
export interface ColorAccents {
    secondary: Color;
    primary: Color;
}
export interface WebsiteContent {
    theme: ThemePreference;
    overviewContent: string;
    heroSection: HeroSection;
    doctorCredentials: DoctorCredentials;
    aboutContent: string;
}
export interface UserProfile {
    name: string;
}
export enum CTARowLayout {
    row = "row",
    stacked = "stacked"
}
export enum ColorAccentScheme {
    gradient = "gradient",
    secondary = "secondary",
    primary = "primary"
}
export enum ColorVariation {
    accent = "accent",
    gradient = "gradient",
    mono = "mono"
}
export enum EffectIntensity {
    dynamic = "dynamic",
    subtle = "subtle",
    moderate = "moderate"
}
export enum MaxWidthPreset {
    full = "full",
    large = "large",
    medium = "medium"
}
export enum MotionAmplitude {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum MotionEffectType {
    waveMotion = "waveMotion",
    floatingMotion = "floatingMotion",
    wave = "wave",
    bounce = "bounce",
    random = "random",
    spiral = "spiral"
}
export enum MotionSpeed {
    fast = "fast",
    slow = "slow",
    medium = "medium"
}
export enum ParticleEffectType {
    confetti = "confetti",
    dots = "dots",
    crossParticles = "crossParticles",
    bubbles = "bubbles",
    lines = "lines",
    sparkles = "sparkles",
    swirls = "swirls",
    stethoscopeParticles = "stethoscopeParticles",
    rings = "rings"
}
export enum TextSizePreset {
    large = "large",
    extraLarge = "extraLarge",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_center_left_right {
    center = "center",
    left = "left",
    right = "right"
}
export enum Variant_dark_light {
    dark = "dark",
    light = "light"
}
export enum Variant_magenta_blue_teal {
    magenta = "magenta",
    blue = "blue",
    teal = "teal"
}
export enum Variant_radial_linear {
    radial = "radial",
    linear = "linear"
}
export enum Variant_strong_subtle_medium {
    strong = "strong",
    subtle = "subtle",
    medium = "medium"
}
export enum Variant_topToBottom_leftToRight {
    topToBottom = "topToBottom",
    leftToRight = "leftToRight"
}
export enum Variant_wave_bounce_random_spiral {
    wave = "wave",
    bounce = "bounce",
    random = "random",
    spiral = "spiral"
}
export enum VectorComplexity {
    complex = "complex",
    simple = "simple",
    moderate = "moderate"
}
export enum VectorEffectType {
    gradientOverlays = "gradientOverlays",
    animatedPaths = "animatedPaths",
    geometricPatterns = "geometricPatterns"
}
export enum VerticalPosition {
    top = "top",
    center = "center",
    bottom = "bottom"
}
export interface backendInterface {
    addClinic(clinic: Clinic): Promise<void>;
    addImage(image: WebsiteImage): Promise<void>;
    addService(service: Service): Promise<void>;
    addSocialMediaLink(link: SocialMediaLink): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteClinic(id: string): Promise<void>;
    deleteImage(id: string): Promise<void>;
    deleteService(id: string): Promise<void>;
    deleteSocialMediaLink(platform: string): Promise<void>;
    getAllClinics(): Promise<Array<Clinic>>;
    getAllImages(): Promise<Array<WebsiteImage>>;
    getAllServices(): Promise<Array<Service>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getConfig(): Promise<Config>;
    getDoctorCredentials(): Promise<DoctorCredentials>;
    getFooterContent(): Promise<FooterContent>;
    getHeroSectionBackgroundImage(): Promise<{
        darkMode?: ExternalBlob;
        standard: ExternalBlob;
    } | null>;
    getHeroSectionTheme(): Promise<HeroSectionTheme>;
    getImage(id: string): Promise<WebsiteImage | null>;
    getSortedSocialMediaLinks(): Promise<Array<SocialMediaLink>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWebsiteContent(): Promise<WebsiteContent>;
    isCallerAdmin(): Promise<boolean>;
    isImageDarkModeCompatible(imageId: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateClinic(clinic: Clinic): Promise<void>;
    updateDoctorCredentials(credentials: DoctorCredentials): Promise<void>;
    updateFooterContent(content: FooterContent): Promise<void>;
    updateHeroSectionTheme(theme: HeroSectionTheme): Promise<void>;
    updateImage(image: WebsiteImage): Promise<void>;
    updateService(service: Service): Promise<void>;
    updateSocialMediaLink(link: SocialMediaLink): Promise<void>;
    updateWebsiteContent(content: WebsiteContent): Promise<void>;
}
