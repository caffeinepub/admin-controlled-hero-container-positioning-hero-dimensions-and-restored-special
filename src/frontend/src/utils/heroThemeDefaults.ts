import type { HeroSectionTheme } from '../backend';

/**
 * Clamps a bigint value between min and max
 */
export function clampBigInt(value: bigint, min: bigint, max: bigint): bigint {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

/**
 * Safely converts bigint to number with fallback
 */
export function bigIntToNumber(value: bigint | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const num = Number(value);
  return isNaN(num) ? fallback : num;
}

/**
 * Parses a string input to bigint with validation and clamping
 */
export function parseInputToBigInt(
  value: string,
  min: number,
  max: number,
  fallback: bigint | null = null
): bigint | null {
  if (!value || value.trim() === '') return fallback;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return fallback;
  const clamped = Math.max(min, Math.min(max, parsed));
  return BigInt(clamped);
}

/**
 * Determines if manual positioning is enabled based on theme data
 */
export function isManualPositioningEnabled(theme: HeroSectionTheme | null): boolean {
  if (!theme) return false;
  const pos = theme.contentPosition;
  return pos && (Number(pos.x) !== 0 || Number(pos.y) !== 0);
}

/**
 * Gets effective hero area dimensions with safe defaults and clamping
 */
export function getEffectiveAreaDimensions(theme: HeroSectionTheme | null): {
  width: number;
  height: number;
} {
  const defaultWidth = 1200;
  const defaultHeight = 800;
  const minWidth = 800;
  const maxWidth = 2000;
  const minHeight = 400;
  const maxHeight = 1200;
  
  if (!theme?.areaDimensions) {
    return { width: defaultWidth, height: defaultHeight };
  }
  
  const width = bigIntToNumber(theme.areaDimensions.width, defaultWidth);
  const height = bigIntToNumber(theme.areaDimensions.height, defaultHeight);
  
  return {
    width: Math.max(minWidth, Math.min(maxWidth, width)),
    height: Math.max(minHeight, Math.min(maxHeight, height)),
  };
}

/**
 * Gets effective content position with safe defaults and clamping
 */
export function getEffectiveContentPosition(theme: HeroSectionTheme | null): {
  x: number;
  y: number;
} {
  const minOffset = -500;
  const maxOffset = 500;
  
  if (!theme?.contentPosition) {
    return { x: 0, y: 0 };
  }
  
  const x = bigIntToNumber(theme.contentPosition.x, 0);
  const y = bigIntToNumber(theme.contentPosition.y, 0);
  
  return {
    x: Math.max(minOffset, Math.min(maxOffset, x)),
    y: Math.max(minOffset, Math.min(maxOffset, y)),
  };
}

/**
 * Normalizes hero theme data to ensure all fields exist with safe defaults
 */
export function normalizeHeroTheme(theme: HeroSectionTheme | null): HeroSectionTheme | null {
  if (!theme) return null;
  
  // Clamp glassmorphism values
  const transparency = theme.glassmorphism?.transparency 
    ? clampBigInt(theme.glassmorphism.transparency, BigInt(0), BigInt(100))
    : BigInt(50);
  const blurIntensity = theme.glassmorphism?.blurIntensity
    ? clampBigInt(theme.glassmorphism.blurIntensity, BigInt(0), BigInt(50))
    : BigInt(10);
  
  // Clamp gradient intensity
  const gradientIntensity = theme.gradient?.intensity
    ? clampBigInt(theme.gradient.intensity, BigInt(0), BigInt(100))
    : BigInt(50);
  
  return {
    ...theme,
    contentPosition: theme.contentPosition ?? { x: BigInt(0), y: BigInt(0) },
    areaDimensions: theme.areaDimensions ?? { width: BigInt(1200), height: BigInt(800) },
    effectsEnabled: theme.effectsEnabled ?? false,
    glassmorphism: {
      ...theme.glassmorphism,
      transparency,
      blurIntensity,
      overlayEffect: theme.glassmorphism?.overlayEffect ?? 'medium',
    },
    gradient: {
      ...theme.gradient,
      intensity: gradientIntensity,
      direction: theme.gradient?.direction ?? 'leftToRight',
      colors: theme.gradient?.colors ?? [],
    },
  };
}
