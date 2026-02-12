import { useState, useEffect } from 'react';
import { useGetHeroSectionTheme, useUpdateHeroSectionTheme } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Loader2, Save, Eye, Palette, Settings, CheckCircle2, Layout, Sparkles, Move } from 'lucide-react';
import { toast } from 'sonner';
import { parseInputToBigInt } from '../../utils/heroThemeDefaults';
import { PARTICLE_EFFECT_TYPES } from '../../utils/particleEffectTypes';
import type { HeroSectionTheme } from '../../backend';

export default function HeroThemeManager() {
  const { data: themeData, isLoading, error } = useGetHeroSectionTheme();
  const updateTheme = useUpdateHeroSectionTheme();

  const [localTheme, setLocalTheme] = useState<HeroSectionTheme | null>(null);

  useEffect(() => {
    if (themeData) {
      setLocalTheme(themeData);
    }
  }, [themeData]);

  const handleSave = async () => {
    if (!localTheme) {
      toast.error('No theme data to save');
      return;
    }

    try {
      await updateTheme.mutateAsync(localTheme);
      toast.success('Hero theme settings saved successfully!', {
        description: 'Your changes are now live on the hero section.',
        icon: <CheckCircle2 className="h-5 w-5" />,
      });
    } catch (error: any) {
      console.error('Error saving hero theme:', error);
      toast.error('Failed to save hero theme settings', {
        description: error?.message || 'Please try again or contact support.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading hero theme configuration...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertDescription>
          Failed to load hero theme settings. Please refresh the page or contact support.
        </AlertDescription>
      </Alert>
    );
  }

  if (!localTheme) {
    return (
      <Alert className="max-w-2xl mx-auto mt-8">
        <AlertDescription>
          No theme configuration available. Please refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  const updateThemeType = (field: string, value: string) => {
    setLocalTheme({
      ...localTheme,
      themeType: {
        ...localTheme.themeType,
        [field]: value,
      },
    });
  };

  const updateParticleEffect = (field: string, value: string | boolean) => {
    setLocalTheme({
      ...localTheme,
      particleEffect: {
        ...localTheme.particleEffect,
        [field]: value,
      },
    });
  };

  const updateMotionEffect = (field: string, value: string | boolean) => {
    setLocalTheme({
      ...localTheme,
      motionEffect: {
        ...localTheme.motionEffect,
        [field]: value,
      },
    });
  };

  const updateMotionEffectPattern = (field: string, value: string | bigint) => {
    setLocalTheme({
      ...localTheme,
      motionEffect: {
        ...localTheme.motionEffect,
        pattern: {
          ...localTheme.motionEffect.pattern,
          [field]: value,
        },
      },
    });
  };

  const updateVectorEffect = (field: string, value: string | boolean) => {
    setLocalTheme({
      ...localTheme,
      vectorEffect: {
        ...localTheme.vectorEffect,
        [field]: value,
      },
    });
  };

  const updateSpacing = (field: string, value: bigint | string) => {
    setLocalTheme({
      ...localTheme,
      spacing: {
        ...localTheme.spacing,
        [field]: value,
      },
    });
  };

  const updateGlassmorphism = (field: string, value: bigint | string) => {
    setLocalTheme({
      ...localTheme,
      glassmorphism: {
        ...localTheme.glassmorphism,
        [field]: value,
      },
    });
  };

  const updateGradient = (field: string, value: bigint | string) => {
    setLocalTheme({
      ...localTheme,
      gradient: {
        ...localTheme.gradient,
        [field]: value,
      },
    });
  };

  const updateLayoutOverride = (field: string, value: string | bigint | null) => {
    setLocalTheme({
      ...localTheme,
      layoutOverride: {
        ...localTheme.layoutOverride,
        [field]: value,
      },
    });
  };

  const updateContentPosition = (field: 'x' | 'y', value: string) => {
    const parsed = parseInputToBigInt(value, -500, 500, BigInt(0));
    setLocalTheme({
      ...localTheme,
      contentPosition: {
        ...localTheme.contentPosition,
        [field]: parsed ?? BigInt(0),
      },
    });
  };

  const updateAreaDimensions = (field: 'width' | 'height', value: string) => {
    const minMax = field === 'width' ? { min: 800, max: 2000 } : { min: 400, max: 1200 };
    const parsed = parseInputToBigInt(value, minMax.min, minMax.max, field === 'width' ? BigInt(1200) : BigInt(800));
    setLocalTheme({
      ...localTheme,
      areaDimensions: {
        ...localTheme.areaDimensions,
        [field]: parsed ?? (field === 'width' ? BigInt(1200) : BigInt(800)),
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Palette className="h-6 w-6 text-primary" />
            Hero Section Theme Configuration
          </h2>
          <p className="text-muted-foreground mt-1">
            Customize the appearance and layout of your hero section
          </p>
        </div>
        <Button onClick={handleSave} disabled={updateTheme.isPending} size="lg" className="gap-2">
          {updateTheme.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Alert className="border-primary/50 bg-primary/5">
        <Eye className="h-4 w-4" />
        <AlertDescription>
          Changes will be reflected on the hero section after saving. Configure multiple special effects simultaneously for rich visual experiences.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Manual Positioning & Dimensions */}
        <Card className="shadow-elevation-2 hover:shadow-elevation-3 transition-shadow md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Move className="h-5 w-5 text-primary" />
              Manual Positioning & Hero Dimensions
            </CardTitle>
            <CardDescription>Freely position the hero content container and adjust hero section height</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Content X Position (horizontal offset in pixels)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={Number(localTheme.contentPosition.x)}
                  onChange={(e) => updateContentPosition('x', e.target.value)}
                  min={-500}
                  max={500}
                />
                <p className="text-xs text-muted-foreground">Move content left (negative) or right (positive), -500 to 500</p>
              </div>

              <div className="space-y-2">
                <Label>Content Y Position (vertical offset in pixels)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={Number(localTheme.contentPosition.y)}
                  onChange={(e) => updateContentPosition('y', e.target.value)}
                  min={-500}
                  max={500}
                />
                <p className="text-xs text-muted-foreground">Move content up (negative) or down (positive), -500 to 500</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Hero Section Height (pixels)</Label>
                <Input
                  type="number"
                  placeholder="800"
                  value={Number(localTheme.areaDimensions.height)}
                  onChange={(e) => updateAreaDimensions('height', e.target.value)}
                  min={400}
                  max={1200}
                />
                <p className="text-xs text-muted-foreground">Adjust hero section height, 400-1200px</p>
              </div>

              <div className="space-y-2">
                <Label>Hero Section Width (pixels, for reference)</Label>
                <Input
                  type="number"
                  placeholder="1200"
                  value={Number(localTheme.areaDimensions.width)}
                  onChange={(e) => updateAreaDimensions('width', e.target.value)}
                  min={800}
                  max={2000}
                />
                <p className="text-xs text-muted-foreground">Reference width for hero area, 800-2000px</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Effects */}
        <Card className="shadow-elevation-2 hover:shadow-elevation-3 transition-shadow md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Multi-Effect Special Effects System
            </CardTitle>
            <CardDescription>Enable and configure multiple simultaneous particle, motion, and vector effects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2 p-4 bg-muted/50 rounded-lg">
              <Label htmlFor="effects-enabled" className="flex-1 font-semibold">Master Effects Toggle</Label>
              <Switch
                id="effects-enabled"
                checked={localTheme.effectsEnabled}
                onCheckedChange={(checked) => setLocalTheme({ ...localTheme, effectsEnabled: checked })}
              />
            </div>

            {/* Particle Effect */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Particle Effect</h4>
                <Switch
                  checked={localTheme.particleEffect.enabled}
                  onCheckedChange={(checked) => updateParticleEffect('enabled', checked)}
                  disabled={!localTheme.effectsEnabled}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Particle Type</Label>
                  <Select
                    value={localTheme.particleEffect.effectType}
                    onValueChange={(value) => updateParticleEffect('effectType', value)}
                    disabled={!localTheme.effectsEnabled || !localTheme.particleEffect.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PARTICLE_EFFECT_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Intensity (Density)</Label>
                  <Select
                    value={localTheme.particleEffect.intensity}
                    onValueChange={(value) => updateParticleEffect('intensity', value)}
                    disabled={!localTheme.effectsEnabled || !localTheme.particleEffect.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subtle">Subtle</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="dynamic">Dynamic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Speed</Label>
                  <Select
                    value={localTheme.particleEffect.speed}
                    onValueChange={(value) => updateParticleEffect('speed', value)}
                    disabled={!localTheme.effectsEnabled || !localTheme.particleEffect.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="fast">Fast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color Variation</Label>
                  <Select
                    value={localTheme.particleEffect.colorVariation}
                    onValueChange={(value) => updateParticleEffect('colorVariation', value)}
                    disabled={!localTheme.effectsEnabled || !localTheme.particleEffect.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mono">Mono</SelectItem>
                      <SelectItem value="accent">Accent</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Motion Effect */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Motion Effect</h4>
                <Switch
                  checked={localTheme.motionEffect.enabled}
                  onCheckedChange={(checked) => updateMotionEffect('enabled', checked)}
                  disabled={!localTheme.effectsEnabled}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Motion Type</Label>
                  <Select
                    value={localTheme.motionEffect.effectType}
                    onValueChange={(value) => updateMotionEffect('effectType', value)}
                    disabled={!localTheme.effectsEnabled || !localTheme.motionEffect.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="floatingMotion">Floating Motion</SelectItem>
                      <SelectItem value="waveMotion">Wave Motion</SelectItem>
                      <SelectItem value="wave">Wave</SelectItem>
                      <SelectItem value="bounce">Bounce</SelectItem>
                      <SelectItem value="spiral">Spiral</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Speed</Label>
                  <Select
                    value={localTheme.motionEffect.speed}
                    onValueChange={(value) => updateMotionEffect('speed', value)}
                    disabled={!localTheme.effectsEnabled || !localTheme.motionEffect.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Slow</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="fast">Fast</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Amplitude (Strength)</Label>
                  <Select
                    value={localTheme.motionEffect.amplitude}
                    onValueChange={(value) => updateMotionEffect('amplitude', value)}
                    disabled={!localTheme.effectsEnabled || !localTheme.motionEffect.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Pattern Type</Label>
                  <Select
                    value={localTheme.motionEffect.pattern.patternType}
                    onValueChange={(value) => updateMotionEffectPattern('patternType', value)}
                    disabled={!localTheme.effectsEnabled || !localTheme.motionEffect.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wave">Wave</SelectItem>
                      <SelectItem value="bounce">Bounce</SelectItem>
                      <SelectItem value="spiral">Spiral</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Pattern Complexity: {Number(localTheme.motionEffect.pattern.complexity)}</Label>
                  <Slider
                    value={[Number(localTheme.motionEffect.pattern.complexity)]}
                    onValueChange={(values) => updateMotionEffectPattern('complexity', BigInt(values[0]))}
                    min={1}
                    max={10}
                    step={1}
                    disabled={!localTheme.effectsEnabled || !localTheme.motionEffect.enabled}
                  />
                </div>
              </div>
            </div>

            {/* Vector Effect */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Vector Effect</h4>
                <Switch
                  checked={localTheme.vectorEffect.enabled}
                  onCheckedChange={(checked) => updateVectorEffect('enabled', checked)}
                  disabled={!localTheme.effectsEnabled}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Vector Type</Label>
                  <Select
                    value={localTheme.vectorEffect.effectType}
                    onValueChange={(value) => updateVectorEffect('effectType', value)}
                    disabled={!localTheme.effectsEnabled || !localTheme.vectorEffect.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="geometricPatterns">Geometric Patterns</SelectItem>
                      <SelectItem value="animatedPaths">Animated Paths</SelectItem>
                      <SelectItem value="gradientOverlays">Gradient Overlays</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Complexity</Label>
                  <Select
                    value={localTheme.vectorEffect.complexity}
                    onValueChange={(value) => updateVectorEffect('complexity', value)}
                    disabled={!localTheme.effectsEnabled || !localTheme.vectorEffect.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="complex">Complex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Color Scheme</Label>
                  <Select
                    value={localTheme.vectorEffect.colorScheme}
                    onValueChange={(value) => updateVectorEffect('colorScheme', value)}
                    disabled={!localTheme.effectsEnabled || !localTheme.vectorEffect.enabled}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="gradient">Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layout Override */}
        <Card className="shadow-elevation-2 hover:shadow-elevation-3 transition-shadow md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5 text-primary" />
              Layout Override Settings
            </CardTitle>
            <CardDescription>Override automatic layout detection with manual presets</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Content Container Width</Label>
                <Select
                  value={localTheme.layoutOverride.contentContainerPreset}
                  onValueChange={(value) => updateLayoutOverride('contentContainerPreset', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Text Size Preset</Label>
                <Select
                  value={localTheme.layoutOverride.textSizePreset}
                  onValueChange={(value) => updateLayoutOverride('textSizePreset', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                    <SelectItem value="extraLarge">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Vertical Placement</Label>
                <Select
                  value={localTheme.layoutOverride.verticalPlacement}
                  onValueChange={(value) => updateLayoutOverride('verticalPlacement', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Horizontal Alignment</Label>
                <Select
                  value={localTheme.layoutOverride.horizontalAlignment}
                  onValueChange={(value) => updateLayoutOverride('horizontalAlignment', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>CTA Button Layout</Label>
                <Select
                  value={localTheme.layoutOverride.ctaRowLayout}
                  onValueChange={(value) => updateLayoutOverride('ctaRowLayout', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="row">Row (Side by Side)</SelectItem>
                    <SelectItem value="stacked">Stacked (Vertical)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Explicit Max Width (optional, in pixels)</Label>
                <Input
                  type="number"
                  placeholder="Leave empty for preset"
                  value={localTheme.layoutOverride.explicitMaxWidth ? Number(localTheme.layoutOverride.explicitMaxWidth) : ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') {
                      updateLayoutOverride('explicitMaxWidth', null);
                    } else {
                      const parsed = parseInputToBigInt(value, 400, 1600, BigInt(800));
                      updateLayoutOverride('explicitMaxWidth', parsed);
                    }
                  }}
                  min={400}
                  max={1600}
                />
                <p className="text-xs text-muted-foreground">Override preset with custom width (400-1600px)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme Type */}
        <Card className="shadow-elevation-2 hover:shadow-elevation-3 transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Theme Type
            </CardTitle>
            <CardDescription>Base theme settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Mode</Label>
              <Select value={localTheme.themeType.mode} onValueChange={(value) => updateThemeType('mode', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Accent Color</Label>
              <Select value={localTheme.themeType.accent} onValueChange={(value) => updateThemeType('accent', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="teal">Teal</SelectItem>
                  <SelectItem value="magenta">Magenta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Gradient Style</Label>
              <Select
                value={localTheme.themeType.gradientStyle}
                onValueChange={(value) => updateThemeType('gradientStyle', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="radial">Radial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Spacing */}
        <Card className="shadow-elevation-2 hover:shadow-elevation-3 transition-shadow">
          <CardHeader>
            <CardTitle>Spacing</CardTitle>
            <CardDescription>Content spacing and alignment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Vertical Padding: {Number(localTheme.spacing.verticalPadding)}</Label>
              <Slider
                value={[Number(localTheme.spacing.verticalPadding)]}
                onValueChange={(values) => updateSpacing('verticalPadding', BigInt(values[0]))}
                min={0}
                max={20}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Element Spacing: {Number(localTheme.spacing.elementSpacing)}</Label>
              <Slider
                value={[Number(localTheme.spacing.elementSpacing)]}
                onValueChange={(values) => updateSpacing('elementSpacing', BigInt(values[0]))}
                min={0}
                max={20}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Content Alignment</Label>
              <Select
                value={localTheme.spacing.contentAlignment}
                onValueChange={(value) => updateSpacing('contentAlignment', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Glassmorphism */}
        <Card className="shadow-elevation-2 hover:shadow-elevation-3 transition-shadow">
          <CardHeader>
            <CardTitle>Glassmorphism</CardTitle>
            <CardDescription>Glass effect settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Transparency: {Number(localTheme.glassmorphism.transparency)}%</Label>
              <Slider
                value={[Number(localTheme.glassmorphism.transparency)]}
                onValueChange={(values) => updateGlassmorphism('transparency', BigInt(values[0]))}
                min={0}
                max={100}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Blur Intensity: {Number(localTheme.glassmorphism.blurIntensity)}</Label>
              <Slider
                value={[Number(localTheme.glassmorphism.blurIntensity)]}
                onValueChange={(values) => updateGlassmorphism('blurIntensity', BigInt(values[0]))}
                min={0}
                max={30}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Overlay Effect</Label>
              <Select
                value={localTheme.glassmorphism.overlayEffect}
                onValueChange={(value) => updateGlassmorphism('overlayEffect', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subtle">Subtle</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="strong">Strong</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Gradient */}
        <Card className="shadow-elevation-2 hover:shadow-elevation-3 transition-shadow">
          <CardHeader>
            <CardTitle>Gradient</CardTitle>
            <CardDescription>Gradient overlay settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Direction</Label>
              <Select
                value={localTheme.gradient.direction}
                onValueChange={(value) => updateGradient('direction', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leftToRight">Left to Right</SelectItem>
                  <SelectItem value="topToBottom">Top to Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Intensity: {Number(localTheme.gradient.intensity)}%</Label>
              <Slider
                value={[Number(localTheme.gradient.intensity)]}
                onValueChange={(values) => updateGradient('intensity', BigInt(values[0]))}
                min={0}
                max={100}
                step={5}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
