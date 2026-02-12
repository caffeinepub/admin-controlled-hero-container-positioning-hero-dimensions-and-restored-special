import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, Shield } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  isAdmin: boolean;
  showAdminPanel: boolean;
  onToggleAdminPanel: () => void;
}

export default function Header({ isAdmin, showAdminPanel, onToggleAdminPanel }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight text-primary hover:opacity-80 transition-opacity cursor-default">
            Dr. Malay Akechan
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => scrollToSection('overview')} 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Overview
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </button>
          <button 
            onClick={() => scrollToSection('services')} 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Services
          </button>
          <button 
            onClick={() => scrollToSection('clinics')} 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Clinics
          </button>
          <button 
            onClick={() => scrollToSection('social')} 
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Contact
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="hover:bg-accent"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {isAdmin && (
            <Button
              variant={showAdminPanel ? "default" : "ghost"}
              size="icon"
              onClick={onToggleAdminPanel}
            >
              <Shield className="h-5 w-5" />
            </Button>
          )}

          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? "outline" : "default"}
            className="hidden md:inline-flex"
            size="sm"
          >
            {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background animate-fade-in">
          <nav className="container py-4 flex flex-col gap-2">
            <button 
              onClick={() => scrollToSection('overview')} 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors text-left py-2 px-3 rounded-md hover:bg-accent"
            >
              Overview
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors text-left py-2 px-3 rounded-md hover:bg-accent"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('services')} 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors text-left py-2 px-3 rounded-md hover:bg-accent"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('clinics')} 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors text-left py-2 px-3 rounded-md hover:bg-accent"
            >
              Clinics
            </button>
            <button 
              onClick={() => scrollToSection('social')} 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors text-left py-2 px-3 rounded-md hover:bg-accent"
            >
              Contact
            </button>
            <Button
              onClick={handleAuth}
              disabled={disabled}
              variant={isAuthenticated ? "outline" : "default"}
              className="w-full mt-2"
              size="sm"
            >
              {loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

