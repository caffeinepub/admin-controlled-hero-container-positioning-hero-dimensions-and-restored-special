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
  return Number(value);
}

/**
 * Parses a string input to bigint with validation
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
 * Gets effective hero area dimensions with safe defaults
 */
export function getEffectiveAreaDimensions(theme: HeroSectionTheme | null): {
  width: number;
  height: number;
} {
  const defaultWidth = 1200;
  const defaultHeight = 800;
  
  if (!theme?.areaDimensions) {
    return { width: defaultWidth, height: defaultHeight };
  }
  
  return {
    width: bigIntToNumber(theme.areaDimensions.width, defaultWidth),
    height: bigIntToNumber(theme.areaDimensions.height, defaultHeight),
  };
}

/**
 * Gets effective content position with safe defaults
 */
export function getEffectiveContentPosition(theme: HeroSectionTheme | null): {
  x: number;
  y: number;
} {
  if (!theme?.contentPosition) {
    return { x: 0, y: 0 };
  }
  
  return {
    x: bigIntToNumber(theme.contentPosition.x, 0),
    y: bigIntToNumber(theme.contentPosition.y, 0),
  };
}

/**
 * Normalizes hero theme data to ensure all fields exist with safe defaults
 */
export function normalizeHeroTheme(theme: HeroSectionTheme | null): HeroSectionTheme | null {
  if (!theme) return null;
  
  return {
    ...theme,
    contentPosition: theme.contentPosition ?? { x: BigInt(0), y: BigInt(0) },
    areaDimensions: theme.areaDimensions ?? { width: BigInt(1200), height: BigInt(800) },
    effectsEnabled: theme.effectsEnabled ?? false,
  };
}
