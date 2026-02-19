import React, { useState, useEffect, Component, ReactNode } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from './hooks/useQueries';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Overview from './components/Overview';
import About from './components/About';
import Services from './components/Services';
import Reviews from './components/Reviews';
import Clinics from './components/Clinics';
import SocialMedia from './components/SocialMedia';
import AdminPanel from './components/AdminPanel';
import ProfileSetupModal from './components/ProfileSetupModal';
import BlogsPage from './components/BlogsPage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Something went wrong</p>
                <p className="text-sm">{this.state.error?.message || 'An unexpected error occurred'}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'blogs'>('home');

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Handle hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/blogs') {
        setCurrentView('blogs');
        setShowAdminPanel(false);
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isInitializing) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen flex flex-col">
          <Header 
            isAdmin={isAdmin || false} 
            showAdminPanel={showAdminPanel}
            onToggleAdminPanel={() => setShowAdminPanel(!showAdminPanel)}
            currentView={currentView}
            onNavigate={setCurrentView}
          />
          
          {showAdminPanel && isAdmin ? (
            <AdminPanel onClose={() => setShowAdminPanel(false)} />
          ) : currentView === 'blogs' ? (
            <BlogsPage isAdmin={isAdmin || false} />
          ) : (
            <main className="flex-1">
              <Hero />
              <Overview />
              <About />
              <Services />
              <Reviews />
              <Clinics />
              <SocialMedia />
            </main>
          )}
          
          <Footer />
          
          {showProfileSetup && <ProfileSetupModal />}
          <Toaster />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
