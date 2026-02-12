import { useEffect, useRef } from 'react';
import type { ParticleEffect } from '../../../backend';

interface ParticleEffectLayerProps {
  config: ParticleEffect;
}

export default function ParticleEffectLayer({ config }: ParticleEffectLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Map config to parameters
    const intensityMap = { subtle: 30, moderate: 60, dynamic: 100 };
    const speedMap = { slow: 0.3, medium: 0.6, fast: 1.2 };
    
    const particleCount = intensityMap[config.intensity];
    const speed = speedMap[config.speed];

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      hue: number;
      rotation: number;
      rotationSpeed: number;
      pulsePhase: number;
    }

    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.6 + 0.2,
        hue: Math.random() * 60 + 200,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        particle.pulsePhase += 0.02;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Render based on particle type
        ctx.save();
        ctx.translate(particle.x, particle.y);

        switch (config.effectType) {
          case 'bubbles':
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            break;

          case 'sparkles':
            ctx.rotate(particle.rotation);
            ctx.fillStyle = `hsla(${particle.hue}, 80%, 70%, ${particle.opacity})`;
            for (let i = 0; i < 4; i++) {
              ctx.fillRect(-particle.size / 4, -particle.size, particle.size / 2, particle.size * 2);
              ctx.rotate(Math.PI / 2);
            }
            break;

          case 'confetti':
            ctx.rotate(particle.rotation);
            ctx.fillStyle = `hsla(${particle.hue}, 90%, 60%, ${particle.opacity})`;
            ctx.fillRect(-particle.size, -particle.size / 2, particle.size * 2, particle.size);
            break;

          case 'dots':
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`;
            ctx.fill();
            break;

          case 'rings':
            const pulseSize = particle.size + Math.sin(particle.pulsePhase) * 2;
            ctx.beginPath();
            ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, 0, pulseSize * 0.6, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            break;

          case 'swirls':
            ctx.rotate(particle.rotation);
            ctx.strokeStyle = `hsla(${particle.hue}, 75%, 65%, ${particle.opacity})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let i = 0; i < 20; i++) {
              const angle = (i / 20) * Math.PI * 2;
              const radius = (i / 20) * particle.size * 2;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              if (i === 0) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.stroke();
            break;

          case 'lines':
            ctx.rotate(particle.rotation);
            ctx.strokeStyle = `hsla(${particle.hue}, 80%, 65%, ${particle.opacity})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-particle.size * 2, 0);
            ctx.lineTo(particle.size * 2, 0);
            ctx.stroke();
            break;

          case 'stethoscopeParticles':
            // Stethoscope shape: circle with two earpieces
            ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
            ctx.lineWidth = 1.5;
            // Main circle
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.stroke();
            // Earpieces
            ctx.beginPath();
            ctx.arc(-particle.size * 1.5, -particle.size * 1.5, particle.size * 0.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(particle.size * 1.5, -particle.size * 1.5, particle.size * 0.5, 0, Math.PI * 2);
            ctx.stroke();
            // Connecting lines
            ctx.beginPath();
            ctx.moveTo(-particle.size * 1.5, -particle.size);
            ctx.lineTo(0, 0);
            ctx.lineTo(particle.size * 1.5, -particle.size);
            ctx.stroke();
            break;

          case 'crossParticles':
            ctx.strokeStyle = `hsla(${particle.hue}, 75%, 60%, ${particle.opacity})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-particle.size, 0);
            ctx.lineTo(particle.size, 0);
            ctx.moveTo(0, -particle.size);
            ctx.lineTo(0, particle.size);
            ctx.stroke();
            break;

          default:
            // Fallback to simple dots
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${particle.hue}, 80%, 60%, ${particle.opacity})`;
            ctx.fill();
            break;
        }

        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current !== undefined) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ opacity: 0.5 }}
    />
  );
}
