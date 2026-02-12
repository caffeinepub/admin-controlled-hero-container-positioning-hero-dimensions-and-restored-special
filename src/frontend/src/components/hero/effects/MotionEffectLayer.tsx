import { useEffect, useRef } from 'react';
import type { MotionEffect } from '../../../backend';

interface MotionEffectLayerProps {
  config: MotionEffect;
}

export default function MotionEffectLayer({ config }: MotionEffectLayerProps) {
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

    const speedMap = { slow: 0.0005, medium: 0.001, fast: 0.002 };
    const amplitudeMap = { low: 20, medium: 40, high: 60 };
    
    const speed = speedMap[config.speed];
    const amplitude = amplitudeMap[config.amplitude];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * speed;

      if (config.effectType === 'waveMotion' || config.effectType === 'wave') {
        // Draw flowing waves
        ctx.strokeStyle = 'rgba(100, 200, 255, 0.3)';
        ctx.lineWidth = 2;
        
        for (let i = 0; i < 3; i++) {
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
        // Draw drifting gradient field
        const gradient = ctx.createRadialGradient(
          canvas.width / 2 + Math.sin(time) * 100,
          canvas.height / 2 + Math.cos(time) * 100,
          0,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(100, 200, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(100, 200, 255, 0)');
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
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{ opacity: 0.4 }}
    />
  );
}
