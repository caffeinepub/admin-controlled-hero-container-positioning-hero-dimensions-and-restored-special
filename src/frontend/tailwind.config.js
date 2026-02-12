import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '1.5rem',
                lg: '2rem',
                xl: '2.5rem',
                '2xl': '3rem',
            },
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                success: {
                    DEFAULT: 'hsl(var(--success))',
                    foreground: 'hsl(var(--success-foreground))'
                },
                warning: {
                    DEFAULT: 'hsl(var(--warning))',
                    foreground: 'hsl(var(--warning-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                chart: {
                    1: 'hsl(var(--chart-1))',
                    2: 'hsl(var(--chart-2))',
                    3: 'hsl(var(--chart-3))',
                    4: 'hsl(var(--chart-4))',
                    5: 'hsl(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            boxShadow: {
                'elevation-1': '0 2px 4px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
                'elevation-2': '0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)',
                'elevation-3': '0 12px 24px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)',
                'elevation-4': '0 20px 40px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.12)',
                'glow-primary': '0 8px 32px rgba(59, 130, 246, 0.3), 0 4px 16px rgba(59, 130, 246, 0.2)',
                'glow-secondary': '0 8px 32px rgba(139, 92, 246, 0.3), 0 4px 16px rgba(139, 92, 246, 0.2)',
                'glow-accent': '0 8px 32px rgba(6, 182, 212, 0.3), 0 4px 16px rgba(6, 182, 212, 0.2)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                },
                'fade-in': {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                'scale-in': {
                    from: { transform: 'scale(0.9)', opacity: '0' },
                    to: { transform: 'scale(1)', opacity: '1' }
                },
                'slide-in': {
                    from: { opacity: '0', transform: 'translateX(-20px)' },
                    to: { opacity: '1', transform: 'translateX(0)' }
                },
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
                    '50%': { boxShadow: '0 0 40px rgba(59, 130, 246, 0.8)' }
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' }
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
                    '33%': { transform: 'translateY(-15px) translateX(10px)' },
                    '66%': { transform: 'translateY(-5px) translateX(-10px)' }
                },
                'float-slow': {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(5deg)' }
                },
                'spin-slow': {
                    from: { transform: 'rotate(0deg)' },
                    to: { transform: 'rotate(360deg)' }
                },
                'bounce-float': {
                    '0%, 100%': { transform: 'translateY(0px) scale(1)' },
                    '50%': { transform: 'translateY(-25px) scale(1.1)' }
                },
                'spiral': {
                    '0%': { transform: 'translate(0, 0) rotate(0deg)' },
                    '25%': { transform: 'translate(10px, -10px) rotate(90deg)' },
                    '50%': { transform: 'translate(0, -20px) rotate(180deg)' },
                    '75%': { transform: 'translate(-10px, -10px) rotate(270deg)' },
                    '100%': { transform: 'translate(0, 0) rotate(360deg)' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'fade-in': 'fade-in 0.6s ease-out',
                'scale-in': 'scale-in 0.5s ease-out',
                'slide-in': 'slide-in 0.5s ease-out',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float-slow 8s ease-in-out infinite',
                'spin-slow': 'spin-slow 20s linear infinite',
                'bounce-float': 'bounce-float 4s ease-in-out infinite',
                'spiral': 'spiral 10s ease-in-out infinite'
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};
