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
import Clinics from './components/Clinics';
import SocialMedia from './components/SocialMedia';
import AdminPanel from './components/AdminPanel';
import ProfileSetupModal from './components/ProfileSetupModal';
import { useState } from 'react';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

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
        />
        
        {showAdminPanel && isAdmin ? (
          <AdminPanel onClose={() => setShowAdminPanel(false)} />
        ) : (
          <main className="flex-1">
            <Hero />
            <Overview />
            <About />
            <Services />
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
