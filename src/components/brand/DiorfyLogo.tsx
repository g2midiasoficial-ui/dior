import React, { useId } from 'react';

interface DiorfyMarkProps {
  className?: string;
}

// The "D" arrow symbol with speed lines
export const DiorfyMark: React.FC<DiorfyMarkProps> = ({ className = 'h-8 w-auto' }) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="165 255 495 340" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}-d`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="55%" stopColor="#3730a3" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
        <linearGradient id={`${id}-l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <rect x="240" y="338" width="93" height="42" rx="21" fill={`url(#${id}-l)`} />
      <rect x="178" y="406" width="227" height="54" rx="27" fill={`url(#${id}-l)`} />
      <rect x="255" y="485" width="110" height="45" rx="22.5" fill={`url(#${id}-l)`} />
      <path
        d="M 335 272 H 485 A 154 154 0 0 1 485 580 H 368 L 565 437 L 434 352 L 434 405 Z"
        fill={`url(#${id}-d)`}
        stroke={`url(#${id}-d)`}
        strokeWidth="16"
        strokeLinejoin="round"
      />
    </svg>
  );
};

interface DiorfyLogoProps {
  /** 'dark' text for light backgrounds, 'light' text for dark backgrounds */
  tone?: 'dark' | 'light';
  /** Tailwind height class for the mark; the wordmark scales with textClassName */
  markClassName?: string;
  textClassName?: string;
  className?: string;
}

export const DiorfyLogo: React.FC<DiorfyLogoProps> = ({
  tone = 'dark',
  markClassName = 'h-8 w-auto',
  textClassName = 'text-2xl',
  className = '',
}) => (
  <span className={`inline-flex items-center gap-2 select-none ${className}`} aria-label="Diorfy">
    <DiorfyMark className={markClassName} />
    <span
      className={`font-black tracking-tight leading-none whitespace-nowrap ${textClassName} ${
        tone === 'light' ? 'text-white' : 'text-[#0b1533]'
      }`}
      aria-hidden="true"
    >
      D
      <span className="relative inline-block">
        ı
        <span className="absolute left-1/2 -translate-x-1/2 top-[-0.02em] w-[0.24em] h-[0.24em] rounded-full bg-gradient-to-br from-blue-500 to-violet-500" />
      </span>
      orfy
    </span>
  </span>
);
