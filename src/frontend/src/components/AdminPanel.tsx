import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import ClinicsManager from './admin/ClinicsManager';
import ServicesManager from './admin/ServicesManager';
import SocialMediaManager from './admin/SocialMediaManager';
import ContentManager from './admin/ContentManager';
import HeroThemeManager from './admin/HeroThemeManager';
import ReviewsManager from './admin/ReviewsManager';
import FooterManager from './admin/FooterManager';

interface AdminPanelProps {
  onClose: () => void;
}

export default function AdminPanel({ onClose }: AdminPanelProps) {
  return (
    <main className="flex-1 bg-muted/30">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <Button variant="outline" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8">
            <TabsTrigger value="content">Content & Images</TabsTrigger>
            <TabsTrigger value="hero-theme">Hero Theme</TabsTrigger>
            <TabsTrigger value="clinics">Clinics</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="footer">Footer</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <ContentManager />
          </TabsContent>

          <TabsContent value="hero-theme">
            <HeroThemeManager />
          </TabsContent>

          <TabsContent value="clinics">
            <ClinicsManager />
          </TabsContent>

          <TabsContent value="services">
            <ServicesManager />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsManager />
          </TabsContent>

          <TabsContent value="social">
            <SocialMediaManager />
          </TabsContent>

          <TabsContent value="footer">
            <FooterManager />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
