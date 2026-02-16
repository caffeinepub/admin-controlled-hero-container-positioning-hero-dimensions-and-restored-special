import { useEffect, useRef, useState } from 'react';
import type { MotionEffect } from '../../../backend';

interface MotionEffectLayerProps {
  config: MotionEffect;
}

export default function MotionEffectLayer({ config }: MotionEffectLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Smooth fade-in transition
    const fadeIn = setTimeout(() => setOpacity(0.4), 50);
    return () => clearTimeout(fadeIn);
  }, []);

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

    const speedMap = { slow: 0.0005, medium: 0.001, fast: 0.002 };
    const amplitudeMap = { low: 20, medium: 40, high: 60 };
    
    const speed = speedMap[config.speed];
    const amplitude = amplitudeMap[config.amplitude];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * speed;

      if (config.effectType === 'waveMotion' || config.effectType === 'wave') {
        // Material Design wave with elevation and blur
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(100, 200, 255, 0.3)';
        
        for (let i = 0; i < 3; i++) {
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          gradient.addColorStop(0, `rgba(100, 200, 255, ${0.2 - i * 0.05})`);
          gradient.addColorStop(0.5, `rgba(150, 220, 255, ${0.3 - i * 0.05})`);
          gradient.addColorStop(1, `rgba(100, 200, 255, ${0.2 - i * 0.05})`);
          
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 3 - i * 0.5;
          
          ctx.beginPath();
          for (let x = 0; x < canvas.width; x += 5) {
            const y = canvas.height / 2 + Math.sin(x * 0.01 + time + i) * amplitude;
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }
      } else if (config.effectType === 'floatingMotion') {
        // Material Design floating gradient with elevation
        const centerX = canvas.width / 2 + Math.sin(time) * 100;
        const centerY = canvas.height / 2 + Math.cos(time) * 100;
        
        const gradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(100, 200, 255, 0.25)');
        gradient.addColorStop(0.5, 'rgba(150, 220, 255, 0.15)');
        gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');
        
        ctx.shadowBlur = 30;
        ctx.shadowColor = 'rgba(100, 200, 255, 0.4)';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

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
      className="absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-700"
      style={{ opacity }}
    />
  );
}
