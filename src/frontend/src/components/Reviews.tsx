import { useGetAllReviews, useGetReviewSettings } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Reviews() {
  const { data: reviews, isLoading, error } = useGetAllReviews();
  const { data: settings } = useGetReviewSettings();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const carouselEnabled = settings?.carouselEnabled ?? true;
  const autoScrollSpeed = settings?.autoScrollSpeed ? Number(settings.autoScrollSpeed) : 3000;
  const maxReviews = settings?.maxReviews ? Number(settings.maxReviews) : 8;

  // Deduplicate reviews by ID
  const uniqueReviews = reviews ? Array.from(
    new Map(reviews.map(r => [r.id, r])).values()
  ) : [];

  const displayedReviews = maxReviews > 0 ? uniqueReviews.slice(0, maxReviews) : uniqueReviews;

  const updateScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollButtons);
      return () => container.removeEventListener('scroll', updateScrollButtons);
    }
  }, [displayedReviews]);

  useEffect(() => {
    if (!carouselEnabled || displayedReviews.length === 0) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      const cardWidth = container.querySelector('.review-card')?.clientWidth || 0;
      const gap = 24;
      const scrollAmount = cardWidth + gap;

      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, autoScrollSpeed);

    return () => clearInterval(interval);
  }, [carouselEnabled, autoScrollSpeed, displayedReviews.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.querySelector('.review-card')?.clientWidth || 0;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (isLoading) {
    return (
      <section id="reviews" className="py-24 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <div className="container">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto mb-12" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="reviews" className="py-24">
        <div className="container">
          <Alert variant="destructive">
            <AlertDescription>Failed to load reviews. Please try again later.</AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  if (!displayedReviews || displayedReviews.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="relative py-24 bg-gradient-to-br from-background via-primary/5 to-secondary/5 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(var(--secondary-rgb),0.1),transparent_50%)]" />
      
      <div className="container relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Patient Reviews
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear what our patients have to say about their experience
          </p>
        </div>

        <div className="relative group">
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full shadow-lg bg-background/95 backdrop-blur-sm border-2 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          )}
          
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full shadow-lg bg-background/95 backdrop-blur-sm border-2 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          )}

          <div 
            ref={scrollContainerRef}
            className="overflow-x-hidden py-4 px-2"
          >
            <div className="flex gap-6" style={{ width: 'max-content' }}>
              {displayedReviews.map((review, index) => (
                <Card
                  key={review.id}
                  className="review-card w-[350px] md:w-[400px] flex-shrink-0 group hover:shadow-2xl transition-all duration-500 animate-fade-in backdrop-blur-xl bg-background/40 dark:bg-background/20 border-2 border-white/20 dark:border-white/10 hover:border-primary/50 hover:-translate-y-2 hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        {review.patientImage ? (
                          <img
                            src={review.patientImage.getDirectURL()}
                            alt={review.patientName}
                            className="w-16 h-16 rounded-full object-cover border-4 border-primary/20 shadow-lg group-hover:border-primary/40 transition-all group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                            {review.patientName.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">
                            {review.patientName}
                          </h3>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 transition-all duration-300 ${
                                  i < Number(review.rating)
                                    ? 'fill-yellow-400 text-yellow-400 group-hover:scale-110'
                                    : 'text-muted-foreground'
                                }`}
                                style={{ transitionDelay: `${i * 50}ms` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-2 -top-2 text-6xl text-primary/20 font-serif leading-none">"</div>
                        <p className="text-muted-foreground leading-relaxed pl-6 group-hover:text-foreground transition-colors">
                          {review.reviewText}
                        </p>
                        <div className="absolute -right-2 -bottom-2 text-6xl text-primary/20 font-serif leading-none">"</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
