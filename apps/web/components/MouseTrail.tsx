'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const lastMouseRef = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Mouse Move event
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      const dt = now - lastMouseRef.current.time;

      // Calculate speed and direction of cursor
      let vx = 0;
      let vy = 0;
      if (dt > 0) {
        vx = (dx / dt) * 0.4; // Dampen velocity
        vy = (dy / dt) * 0.4;
      }

      // Add a slight drift/gravity influence to simulate droplets falling
      vy += 0.05;

      // Spawn new particles (droplets) based on movement speed
      const speed = Math.sqrt(dx * dx + dy * dy);
      const spawnCount = Math.min(Math.floor(speed / 5) + 1, 4);

      for (let i = 0; i < spawnCount; i++) {
        // Randomize sizes to make them look like water droplets
        const size = Math.random() * 4 + 2; // 2px to 6px
        
        // Slightly randomize colors between cyan/blue/indigo
        const r = Math.floor(Math.random() * 30);
        const g = Math.floor(180 + Math.random() * 50);
        const b = 255;
        
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          // Propagate cursor direction + add slight random spreading
          vx: vx + (Math.random() - 0.5) * 0.5,
          vy: vy + (Math.random() - 0.5) * 0.5,
          size,
          alpha: 0.8,
          color: `rgba(${r}, ${g}, ${b}, `
        });
      }

      lastMouseRef.current = { x: e.clientX, y: e.clientY, time: now };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Update positions
        p.x += p.vx;
        p.y += p.vy;
        
        // Add water gravity drift
        p.vy += 0.03;
        
        // Fade out
        p.alpha -= 0.015;

        // Draw particle
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Create water drop lighting (radial gradient)
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, 'rgba(255, 255, 255, ' + p.alpha + ')'); // Highlight reflection
        grad.addColorStop(0.3, p.color + p.alpha * 0.8 + ')');
        grad.addColorStop(1, p.color + '0)');
        
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
