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
import { useState, useEffect } from 'react';

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
  );
}
