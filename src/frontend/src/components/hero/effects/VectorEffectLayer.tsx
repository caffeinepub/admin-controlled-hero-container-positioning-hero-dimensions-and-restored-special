import { useEffect, useState } from 'react';
import type { VectorEffect } from '../../../backend';

interface VectorEffectLayerProps {
  config: VectorEffect;
}

export default function VectorEffectLayer({ config }: VectorEffectLayerProps) {
  const [offset, setOffset] = useState(0);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Smooth fade-in transition
    const fadeIn = setTimeout(() => setOpacity(0.3), 50);
    return () => clearTimeout(fadeIn);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const complexityMap = { simple: 3, moderate: 6, complex: 10 };
  const shapeCount = complexityMap[config.complexity];

  const colorSchemeMap = {
    primary: 'stroke-primary',
    secondary: 'stroke-secondary',
    gradient: 'stroke-accent',
  };
  const strokeColor = colorSchemeMap[config.colorScheme];

  if (config.effectType === 'geometricPatterns') {
    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-700"
        style={{ opacity }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {Array.from({ length: shapeCount }).map((_, i) => {
          const size = 50 + i * 30;
          const x = (i * 150 + offset * 2) % window.innerWidth;
          const y = 100 + (i * 80) % 400;
          
          return (
            <g key={i} style={{ filter: 'url(#glow)' }}>
              <circle
                cx={x}
                cy={y}
                r={size}
                fill="none"
                className={`${strokeColor} transition-all duration-500`}
                strokeWidth="2"
                strokeDasharray="10 5"
                style={{
                  transform: `rotate(${offset * 2}deg)`,
                  transformOrigin: `${x}px ${y}px`,
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            </g>
          );
        })}
      </svg>
    );
  }

  if (config.effectType === 'animatedPaths') {
    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-700"
        style={{ opacity }}
      >
        <defs>
          <filter id="pathGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {Array.from({ length: shapeCount }).map((_, i) => {
          const pathLength = 500;
          const dashOffset = (offset * 5 + i * 50) % pathLength;
          
          return (
            <path
              key={i}
              d={`M ${i * 100} 0 Q ${i * 100 + 50} ${200 + i * 30}, ${i * 100 + 100} 400`}
              fill="none"
              className={`${strokeColor} transition-all duration-300`}
              strokeWidth="2"
              strokeDasharray="20 10"
              strokeDashoffset={dashOffset}
              style={{ 
                filter: 'url(#pathGlow)',
                transition: 'stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          );
        })}
      </svg>
    );
  }

  return null;
}
