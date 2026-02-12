import ParticleEffectLayer from './effects/ParticleEffectLayer';
import MotionEffectLayer from './effects/MotionEffectLayer';
import VectorEffectLayer from './effects/VectorEffectLayer';
import type { ParticleEffect, MotionEffect, VectorEffect } from '../../backend';

interface HeroMultiEffectsLayerProps {
  particleEffect: ParticleEffect;
  motionEffect: MotionEffect;
  vectorEffect: VectorEffect;
  enabled: boolean;
}

export default function HeroMultiEffectsLayer({
  particleEffect,
  motionEffect,
  vectorEffect,
  enabled,
}: HeroMultiEffectsLayerProps) {
  if (!enabled) return null;

  return (
    <>
      {particleEffect.enabled && (
        <ParticleEffectLayer config={particleEffect} />
      )}
      {motionEffect.enabled && (
        <MotionEffectLayer config={motionEffect} />
      )}
      {vectorEffect.enabled && (
        <VectorEffectLayer config={vectorEffect} />
      )}
    </>
  );
}
