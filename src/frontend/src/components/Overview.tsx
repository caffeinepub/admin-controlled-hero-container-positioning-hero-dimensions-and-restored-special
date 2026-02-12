import { useGetWebsiteContent, useIsCallerAdmin } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Stethoscope, Heart, Award, Users, AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import EditableContent from './EditableContent';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Overview() {
  const { data: content, isLoading: contentLoading, error: contentError } = useGetWebsiteContent();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const overviewContent = content?.overviewContent ?? '';
  const isLoading = contentLoading || adminLoading;

  const highlights = [
    { icon: Stethoscope, title: 'Expert Care', description: 'Comprehensive medical services', gradient: 'from-primary via-primary/80 to-primary/60' },
    { icon: Heart, title: 'Patient-Centered', description: 'Your health is our priority', gradient: 'from-secondary via-secondary/80 to-secondary/60' },
    { icon: Award, title: 'Experienced', description: 'Years of medical excellence', gradient: 'from-accent via-accent/80 to-accent/60' },
    { icon: Users, title: 'Trusted', description: 'Serving the community', gradient: 'from-success via-success/80 to-success/60' },
  ];

  if (isLoading) {
    return (
      <section id="overview" className="py-20 md:py-24 bg-background relative overflow-hidden">
        <div className="container">
          <div className="text-center mb-16 md:mb-20">
            <Skeleton className="h-12 md:h-14 w-64 md:w-72 mx-auto mb-6 rounded-xl bg-foreground/10" />
            <Skeleton className="h-6 md:h-8 w-80 md:w-96 mx-auto rounded-xl bg-foreground/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border border-border/50 bg-card/80 backdrop-blur-md">
                <CardContent className="pt-12 pb-10 px-6 text-center">
                  <Skeleton className="h-20 w-20 mx-auto mb-8 rounded-2xl bg-foreground/10" />
                  <Skeleton className="h-6 w-32 mx-auto mb-3 rounded-lg bg-foreground/10" />
                  <Skeleton className="h-4 w-full rounded-lg bg-foreground/10" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (contentError) {
    return (
      <section id="overview" className="py-20 md:py-24 bg-background relative overflow-hidden">
        <div className="container">
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load overview content. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  if (!overviewContent && !isAdmin) {
    return null;
  }

  return (
    <section id="overview" className="py-20 md:py-24 bg-background relative overflow-hidden">
      {/* Background Accent Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      <div className="container relative z-10">
        <div className="text-center mb-16 md:mb-20 animate-fade-in">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Overview
          </h2>
          <div className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            <EditableContent
              content={overviewContent}
              field="overviewContent"
              isAdmin={isAdmin ?? false}
              multiline
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {highlights.map((item, index) => (
            <HighlightCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface HighlightCardProps {
  item: {
    icon: React.ElementType;
    title: string;
    description: string;
    gradient: string;
  };
  index: number;
}

function HighlightCard({ item, index }: HighlightCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="relative overflow-hidden transition-all duration-700 cursor-pointer group animate-scale-in border border-border/50 bg-card/80 backdrop-blur-md hover:border-transparent"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Border Effect on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10`} />
      <div className="absolute inset-[1px] bg-card rounded-[calc(var(--radius)-1px)] z-0" />
      
      {/* Subtle Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 -z-20`} />
      
      {/* Parallax Background Accent */}
      <div 
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-700`}
        style={{
          transform: isHovered ? 'translate(10%, -10%) scale(1.2)' : 'translate(20%, -20%) scale(1)',
        }}
      />
      
      <CardContent className="relative z-10 pt-12 pb-10 px-6 text-center">
        {/* Icon Container with Enhanced Effects */}
        <div className="relative inline-flex items-center justify-center mb-8">
          {/* Outer Glow Ring */}
          <div className={`absolute inset-0 w-24 h-24 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-20 group-hover:opacity-40 blur-md transition-all duration-700 group-hover:scale-125`} />
          
          {/* Icon Background */}
          <div className={`relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-elevation-3 group-hover:shadow-elevation-4 transition-all duration-700 group-hover:scale-110 group-hover:rotate-3`}>
            <item.icon className="h-10 w-10 text-white drop-shadow-lg" />
          </div>
        </div>
        
        {/* Text Content with Enhanced Typography */}
        <h3 className="text-xl font-bold mb-3 text-foreground group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
          {item.title}
        </h3>
        <p className="text-base text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-500">
          {item.description}
        </p>
      </CardContent>
      
      {/* Lift Effect Shadow */}
      <div className="absolute inset-0 shadow-elevation-2 group-hover:shadow-elevation-4 transition-shadow duration-700 rounded-lg pointer-events-none" />
    </Card>
  );
}
