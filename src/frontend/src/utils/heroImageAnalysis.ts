/**
 * Client-side image analysis utility for hero background images.
 * Analyzes brightness, contrast, visual weight distribution, and busyness
 * to determine optimal content layout presets.
 */

export interface ImageAnalysisResult {
  brightness: number; // 0-1, average luminance
  contrast: number; // 0-1, standard deviation of luminance
  leftWeight: number; // 0-1, visual weight on left side
  rightWeight: number; // 0-1, visual weight on right side
  busyness: number; // 0-1, edge density / complexity
}

/**
 * Analyzes an image and returns deterministic signals for layout decisions.
 * @param imageUrl - Direct URL to the hero background image
 * @returns Promise resolving to analysis result or null on failure
 */
export async function analyzeHeroImage(imageUrl: string): Promise<ImageAnalysisResult | null> {
  try {
    // Create an offscreen canvas for analysis
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    // Load image
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageUrl;
    });

    // Create canvas and downsample for performance
    const canvas = document.createElement('canvas');
    const maxDimension = 200; // Downsample for fast analysis
    const scale = Math.min(maxDimension / img.width, maxDimension / img.height);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Calculate brightness and contrast
    let totalLuminance = 0;
    const luminances: number[] = [];
    
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      // Relative luminance formula
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      luminances.push(luminance);
      totalLuminance += luminance;
    }

    const avgLuminance = totalLuminance / luminances.length;
    const brightness = avgLuminance / 255;

    // Calculate contrast (standard deviation)
    const variance = luminances.reduce((sum, lum) => {
      return sum + Math.pow(lum - avgLuminance, 2);
    }, 0) / luminances.length;
    const contrast = Math.sqrt(variance) / 255;

    // Calculate left vs right visual weight
    const midpoint = canvas.width / 2;
    let leftWeight = 0;
    let rightWeight = 0;
    let leftCount = 0;
    let rightCount = 0;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4;
        const luminance = luminances[y * canvas.width + x];
        
        if (x < midpoint) {
          leftWeight += luminance;
          leftCount++;
        } else {
          rightWeight += luminance;
          rightCount++;
        }
      }
    }

    const normalizedLeftWeight = (leftWeight / leftCount) / 255;
    const normalizedRightWeight = (rightWeight / rightCount) / 255;

    // Calculate busyness (edge density using simple Sobel-like approach)
    let edgeStrength = 0;
    for (let y = 1; y < canvas.height - 1; y++) {
      for (let x = 1; x < canvas.width - 1; x++) {
        const idx = y * canvas.width + x;
        const current = luminances[idx];
        const right = luminances[idx + 1];
        const bottom = luminances[idx + canvas.width];
        
        const dx = Math.abs(current - right);
        const dy = Math.abs(current - bottom);
        edgeStrength += dx + dy;
      }
    }
    const busyness = Math.min(1, edgeStrength / (canvas.width * canvas.height * 100));

    return {
      brightness,
      contrast,
      leftWeight: normalizedLeftWeight,
      rightWeight: normalizedRightWeight,
      busyness,
    };
  } catch (error) {
    console.error('Image analysis failed:', error);
    return null;
  }
}
