import { useState, useEffect } from 'react';
import { analyzeHeroImage, type ImageAnalysisResult } from '../utils/heroImageAnalysis';

export type HeroLayoutPreset = 'left-content' | 'right-content' | 'centered' | 'bottom-overlay';

export interface HeroLayoutConfig {
  preset: HeroLayoutPreset;
  overlayStrength: 'light' | 'medium' | 'strong';
  containerWidth: 'narrow' | 'medium' | 'wide';
  textSize: 'compact' | 'normal' | 'large';
}

/**
 * Determines the optimal hero layout preset based on image analysis.
 * Returns a stable, cached result to prevent layout flicker.
 * This is now used as a fallback recommendation when admin overrides are not set.
 */
export function useHeroLayoutPreset(
  imageUrl: string | undefined,
  isDarkMode: boolean
): { config: HeroLayoutConfig; isAnalyzing: boolean } {
  const [config, setConfig] = useState<HeroLayoutConfig>(getDefaultConfig());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setConfig(getDefaultConfig());
      return;
    }

    let cancelled = false;
    setIsAnalyzing(true);

    analyzeHeroImage(imageUrl)
      .then((analysis) => {
        if (cancelled) return;
        
        if (analysis) {
          setConfig(determineLayoutConfig(analysis, isDarkMode));
        } else {
          setConfig(getDefaultConfig());
        }
      })
      .finally(() => {
        if (!cancelled) setIsAnalyzing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [imageUrl, isDarkMode]);

  return { config, isAnalyzing };
}

function getDefaultConfig(): HeroLayoutConfig {
  return {
    preset: 'centered',
    overlayStrength: 'medium',
    containerWidth: 'wide',
    textSize: 'normal',
  };
}

function determineLayoutConfig(
  analysis: ImageAnalysisResult,
  isDarkMode: boolean
): HeroLayoutConfig {
  const { brightness, contrast, leftWeight, rightWeight, busyness } = analysis;

  // Determine content position based on visual weight
  let preset: HeroLayoutPreset;
  const weightDifference = Math.abs(leftWeight - rightWeight);
  
  if (weightDifference > 0.15) {
    // Significant weight difference - place content on lighter side
    preset = leftWeight > rightWeight ? 'right-content' : 'left-content';
  } else if (busyness > 0.6) {
    // Very busy image - use bottom overlay to avoid clashing
    preset = 'bottom-overlay';
  } else {
    // Balanced or minimal image - center content
    preset = 'centered';
  }

  // Determine overlay strength based on contrast and brightness
  let overlayStrength: 'light' | 'medium' | 'strong';
  if (contrast < 0.2 || busyness > 0.7) {
    // Low contrast or very busy - need strong overlay
    overlayStrength = 'strong';
  } else if (contrast < 0.4 || busyness > 0.4) {
    overlayStrength = 'medium';
  } else {
    overlayStrength = 'light';
  }

  // Adjust overlay for dark mode
  if (isDarkMode && brightness > 0.6) {
    // Bright image in dark mode needs stronger overlay
    overlayStrength = overlayStrength === 'light' ? 'medium' : 'strong';
  }

  // Determine container width based on busyness
  const containerWidth: 'narrow' | 'medium' | 'wide' = 
    busyness > 0.6 ? 'narrow' : busyness > 0.3 ? 'medium' : 'wide';

  // Determine text size based on preset and image characteristics
  const textSize: 'compact' | 'normal' | 'large' =
    preset === 'bottom-overlay' ? 'compact' :
    busyness > 0.5 ? 'compact' : 'normal';

  return {
    preset,
    overlayStrength,
    containerWidth,
    textSize,
  };
}
