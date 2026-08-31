'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
  ox: number; // original coordinates for warping
  oy: number;
  oz: number;
}

export default function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Mouse particles trail
  const trailRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  // 3D Sphere points
  const points3D = useRef<Point3D[]>([]);
  const rotation = useRef({ x: 0, y: 0, speed: 0.005 });
  const warpForce = useRef(0); // Shockwave factor

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

    // 1. Initialize 3D Sphere Points
    const numPoints = 120;
    const radius = 180;
    const tempPoints: Point3D[] = [];
    
    for (let i = 0; i < numPoints; i++) {
      // Even distribution on sphere (Fibonacci lattice)
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      tempPoints.push({ x, y, z, ox: x, oy: y, oz: z });
    }
    points3D.current = tempPoints;

    // 2. Mouse Move
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Spawn trail particles
      if (Math.random() < 0.6) {
        trailRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          alpha: 1.0,
          size: Math.random() * 2 + 1
        });
      }
    };

    // 3. Global Click Listener (Triggers 3D Shockwave)
    const handleGlobalClick = () => {
      warpForce.current = 1.0; // Trigger high deformation
      rotation.current.speed = 0.04; // Accelerate rotation speed
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleGlobalClick);

    // Animation Loop
    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      // --- RENDER 3D SPHERE BACKGROUND ---
      // Slowly decay speed and warp force back to idle
      rotation.current.speed += (0.003 - rotation.current.speed) * 0.05;
      warpForce.current += (0 - warpForce.current) * 0.08;

      rotation.current.x += rotation.current.speed;
      rotation.current.y += rotation.current.speed * 0.8;

      const cosX = Math.cos(rotation.current.x);
      const sinX = Math.sin(rotation.current.x);
      const cosY = Math.cos(rotation.current.y);
      const sinY = Math.sin(rotation.current.y);

      // Render 3D points
      ctx.fillStyle = 'rgba(6, 182, 212, 0.25)'; // Light cyan for sphere nodes
      
      const projected: { x: number; y: number; z: number }[] = [];

      points3D.current.forEach(p => {
        // Apply 3D warp wave deformation
        const warp = 1 + Math.sin(p.ox * 0.05 + rotation.current.x * 10) * 0.15 * warpForce.current;
        const wx = p.ox * warp;
        const wy = p.oy * warp;
        const wz = p.oz * warp;

        // Rotate Y
        let x1 = wx * cosY - wz * sinY;
        let z1 = wx * sinY + wz * cosY;

        // Rotate X
        let y2 = wy * cosX - z1 * sinX;
        let z2 = wy * sinX + z1 * cosX;

        // 3D Perspective Projection formula
        const fov = 400;
        const scale = fov / (fov + z2);
        const px = centerX + x1 * scale;
        const py = centerY + y2 * scale;

        projected.push({ x: px, y: py, z: z2 });

        // Draw node circles
        const nodeSize = Math.max(0.5, (1.5 - z2 / 200) * (1 + warpForce.current * 0.5));
        const alpha = Math.max(0.05, 0.3 - z2 / 400);
        ctx.beginPath();
        ctx.arc(px, py, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
        ctx.fill();
      });

      // Draw wireframe connection lines between nearby sphere nodes
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = dx * dx + dy * dy;

          // Connect nodes close to each other
          if (dist < 2200) {
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      // --- RENDER CONSTELLATION CURSOR TRAIL ---
      const trail = trailRef.current;
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;

        if (p.alpha <= 0) {
          trail.splice(i, 1);
          continue;
        }

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha * 0.6})`;
        ctx.fill();
      }

      // Draw constellation connecting lines between cursor trail nodes
      ctx.lineWidth = 0.8;
      for (let i = 0; i < trail.length; i++) {
        for (let j = i + 1; j < trail.length; j++) {
          const dx = trail[i].x - trail[j].x;
          const dy = trail[i].y - trail[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            const lineAlpha = (1 - dist / 80) * Math.min(trail[i].alpha, trail[j].alpha) * 0.4;
            ctx.beginPath();
            ctx.moveTo(trail[i].x, trail[i].y);
            ctx.lineTo(trail[j].x, trail[j].y);
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleGlobalClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen', opacity: 0.7 }}
    />
  );
}
