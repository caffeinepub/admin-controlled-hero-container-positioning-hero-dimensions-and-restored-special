import { ParticleEffectType } from '../backend';

export interface ParticleTypeMetadata {
  value: ParticleEffectType;
  label: string;
  description: string;
}

/**
 * Centralized list of all supported particle effect types with metadata.
 * This list is derived from the generated ParticleEffectType enum.
 */
export const PARTICLE_EFFECT_TYPES: ParticleTypeMetadata[] = [
  {
    value: ParticleEffectType.bubbles,
    label: 'Bubbles',
    description: 'Floating bubble outlines with gentle motion',
  },
  {
    value: ParticleEffectType.confetti,
    label: 'Confetti',
    description: 'Colorful confetti pieces falling and rotating',
  },
  {
    value: ParticleEffectType.sparkles,
    label: 'Sparkles',
    description: 'Twinkling star-shaped sparkles',
  },
  {
    value: ParticleEffectType.dots,
    label: 'Dots',
    description: 'Simple circular dots with smooth movement',
  },
  {
    value: ParticleEffectType.rings,
    label: 'Rings',
    description: 'Concentric ring patterns with pulsing animation',
  },
  {
    value: ParticleEffectType.swirls,
    label: 'Swirls',
    description: 'Spiral swirl patterns with rotation',
  },
  {
    value: ParticleEffectType.lines,
    label: 'Lines',
    description: 'Animated line segments with directional flow',
  },
  {
    value: ParticleEffectType.stethoscopeParticles,
    label: 'Stethoscope Particles',
    description: 'Medical stethoscope-shaped particles',
  },
  {
    value: ParticleEffectType.crossParticles,
    label: 'Cross Particles',
    description: 'Medical cross symbols floating',
  },
];

/**
 * Get a human-readable label for a particle effect type.
 * Falls back to a title-cased version of the enum value if not found.
 */
export function getParticleTypeLabel(effectType: string): string {
  const metadata = PARTICLE_EFFECT_TYPES.find((t) => t.value === effectType);
  if (metadata) {
    return metadata.label;
  }
  
  // Fallback: convert camelCase to Title Case
  return effectType
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Get the description for a particle effect type.
 */
export function getParticleTypeDescription(effectType: string): string {
  const metadata = PARTICLE_EFFECT_TYPES.find((t) => t.value === effectType);
  return metadata?.description || '';
}
