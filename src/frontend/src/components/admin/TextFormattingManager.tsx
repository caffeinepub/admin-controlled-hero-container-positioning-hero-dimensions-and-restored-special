import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetHomepageTextFormatting, useUpdateHomepageTextFormatting } from '../../hooks/useQueries';
import { AlertCircle, Save, Type } from 'lucide-react';
import { toast } from 'sonner';
import type { HomepageTextFormatting, TextFormattingBundle } from '../../backend';

const fontFamilies = [
  'Roboto',
  'Arial',
  'Helvetica',
  'Georgia',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Tahoma',
  'Trebuchet MS',
  'Palatino',
  'Garamond',
  'Comic Sans MS',
  'Impact',
];

export default function TextFormattingManager() {
  const { data: formatting, isLoading, error } = useGetHomepageTextFormatting();
  const updateMutation = useUpdateHomepageTextFormatting();

  const [localFormatting, setLocalFormatting] = useState<HomepageTextFormatting | null>(null);

  useEffect(() => {
    if (formatting) {
      setLocalFormatting(formatting);
    }
  }, [formatting]);

  const handleBundleChange = (
    section: keyof HomepageTextFormatting,
    field: keyof TextFormattingBundle,
    value: string | number
  ) => {
    if (!localFormatting) return;

    setLocalFormatting({
      ...localFormatting,
      [section]: {
        ...localFormatting[section],
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    if (!localFormatting) return;

    try {
      await updateMutation.mutateAsync(localFormatting);
      toast.success('Text formatting saved successfully!');
    } catch (error) {
      console.error('Failed to save text formatting:', error);
      toast.error('Failed to save text formatting. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load text formatting settings. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (!localFormatting) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Type className="h-6 w-6" />
            Text Formatting
          </h2>
          <p className="text-muted-foreground mt-1">
            Customize font size, family, weight, letter spacing, and text transform for homepage sections
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Separator />

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>
            Configure text formatting for the hero section headline and body text
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormattingControls
            label="Headline"
            bundle={localFormatting.heroHeading}
            onChange={(field, value) => handleBundleChange('heroHeading', field, value)}
          />
          <Separator />
          <FormattingControls
            label="Body Text"
            bundle={localFormatting.heroBody}
            onChange={(field, value) => handleBundleChange('heroBody', field, value)}
          />
        </CardContent>
      </Card>

      {/* Overview/About Section */}
      <Card>
        <CardHeader>
          <CardTitle>Overview/About Section</CardTitle>
          <CardDescription>
            Configure text formatting for the overview and about sections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormattingControls
            label="Heading"
            bundle={localFormatting.overviewHeading}
            onChange={(field, value) => handleBundleChange('overviewHeading', field, value)}
          />
          <Separator />
          <FormattingControls
            label="Body Text"
            bundle={localFormatting.overviewBody}
            onChange={(field, value) => handleBundleChange('overviewBody', field, value)}
          />
        </CardContent>
      </Card>

      {/* Services Section */}
      <Card>
        <CardHeader>
          <CardTitle>Services Section</CardTitle>
          <CardDescription>
            Configure text formatting for service card titles and descriptions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormattingControls
            label="Service Titles"
            bundle={localFormatting.servicesHeading}
            onChange={(field, value) => handleBundleChange('servicesHeading', field, value)}
          />
          <Separator />
          <FormattingControls
            label="Service Descriptions"
            bundle={localFormatting.servicesBody}
            onChange={(field, value) => handleBundleChange('servicesBody', field, value)}
          />
        </CardContent>
      </Card>

      {/* Footer Section */}
      <Card>
        <CardHeader>
          <CardTitle>Footer Section</CardTitle>
          <CardDescription>
            Configure text formatting for footer headings and body text
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormattingControls
            label="Section Headings"
            bundle={localFormatting.footerHeading}
            onChange={(field, value) => handleBundleChange('footerHeading', field, value)}
          />
          <Separator />
          <FormattingControls
            label="Body Text"
            bundle={localFormatting.footerBody}
            onChange={(field, value) => handleBundleChange('footerBody', field, value)}
          />
        </CardContent>
      </Card>
    </div>
  );
}

interface FormattingControlsProps {
  label: string;
  bundle: TextFormattingBundle;
  onChange: (field: keyof TextFormattingBundle, value: string | number) => void;
}

function FormattingControls({ label, bundle, onChange }: FormattingControlsProps) {
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-lg">{label}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Font Size */}
        <div className="space-y-2">
          <Label htmlFor={`${label}-fontSize`}>Font Size (px)</Label>
          <Input
            id={`${label}-fontSize`}
            type="number"
            min="8"
            max="120"
            value={Number(bundle.fontSize)}
            onChange={(e) => onChange('fontSize', parseInt(e.target.value) || 16)}
          />
        </div>

        {/* Font Family */}
        <div className="space-y-2">
          <Label htmlFor={`${label}-fontFamily`}>Font Family</Label>
          <Select
            value={bundle.fontFamily}
            onValueChange={(value) => onChange('fontFamily', value)}
          >
            <SelectTrigger id={`${label}-fontFamily`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font} value={font}>
                  {font}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Weight */}
        <div className="space-y-2">
          <Label htmlFor={`${label}-fontWeight`}>Font Weight</Label>
          <Select
            value={bundle.fontWeight}
            onValueChange={(value) => onChange('fontWeight', value)}
          >
            <SelectTrigger id={`${label}-fontWeight`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="bold">Bold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Letter Spacing */}
        <div className="space-y-2">
          <Label htmlFor={`${label}-letterSpacing`}>Letter Spacing (em)</Label>
          <Input
            id={`${label}-letterSpacing`}
            type="number"
            min="-0.5"
            max="1"
            step="0.01"
            value={Number(bundle.letterSpacing) / 100}
            onChange={(e) => onChange('letterSpacing', Math.round((parseFloat(e.target.value) || 0) * 100))}
          />
        </div>

        {/* Text Transform */}
        <div className="space-y-2">
          <Label htmlFor={`${label}-textTransform`}>Text Transform</Label>
          <Select
            value={bundle.textTransform}
            onValueChange={(value) => onChange('textTransform', value)}
          >
            <SelectTrigger id={`${label}-textTransform`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="uppercase">Uppercase</SelectItem>
              <SelectItem value="lowercase">Lowercase</SelectItem>
              <SelectItem value="capitalize">Capitalize</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
