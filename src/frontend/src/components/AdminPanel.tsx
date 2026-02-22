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
import TextFormattingManager from './admin/TextFormattingManager';

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
          <div className="mb-8 overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="grid w-full grid-cols-8 min-w-[800px] md:min-w-0">
              <TabsTrigger value="content" className="text-xs sm:text-sm px-2 sm:px-4">
                Content
              </TabsTrigger>
              <TabsTrigger value="hero-theme" className="text-xs sm:text-sm px-2 sm:px-4">
                Hero
              </TabsTrigger>
              <TabsTrigger value="clinics" className="text-xs sm:text-sm px-2 sm:px-4">
                Clinics
              </TabsTrigger>
              <TabsTrigger value="services" className="text-xs sm:text-sm px-2 sm:px-4">
                Services
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs sm:text-sm px-2 sm:px-4">
                Reviews
              </TabsTrigger>
              <TabsTrigger value="social" className="text-xs sm:text-sm px-2 sm:px-4">
                Social
              </TabsTrigger>
              <TabsTrigger value="footer" className="text-xs sm:text-sm px-2 sm:px-4">
                Footer
              </TabsTrigger>
              <TabsTrigger value="text-formatting" className="text-xs sm:text-sm px-2 sm:px-4">
                Text Format
              </TabsTrigger>
            </TabsList>
          </div>

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

          <TabsContent value="text-formatting">
            <TextFormattingManager />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
