'use client';

import React from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'indigo' | 'emerald' | 'amber' | 'sky' | 'purple';
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  glowColor = 'indigo',
  onClick,
}) => {
  const glowStyles = {
    indigo: 'hover:shadow-indigo-500/15 border-slate-800/80 hover:border-indigo-500/50',
    emerald: 'hover:shadow-emerald-500/15 border-slate-800/80 hover:border-emerald-500/50',
    amber: 'hover:shadow-amber-500/15 border-slate-800/80 hover:border-amber-500/50',
    sky: 'hover:shadow-sky-500/15 border-slate-800/80 hover:border-sky-500/50',
    purple: 'hover:shadow-purple-500/15 border-slate-800/80 hover:border-purple-500/50',
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 border ${glowStyles[glowColor]} backdrop-blur-xl shadow-xl shadow-black/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* 3D Surface Glow Highlight */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/[0.03] to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
