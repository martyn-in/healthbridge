import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const iconBox = size === 'sm' ? 'w-8 h-8 rounded-xl' : size === 'md' ? 'w-10 h-10 rounded-2xl' : 'w-13 h-13 rounded-2xl';
  const iconSize = size === 'sm' ? 18 : size === 'md' ? 24 : 30;
  const textSize = size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : 'text-2xl';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon container with hands securing heart image / vector fallback */}
      <div className={`flex items-center justify-center bg-[#6E56CF] text-white shadow-sm overflow-hidden p-1 shrink-0 ${iconBox}`}>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Central Medical Heart */}
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="currentColor"
            fillOpacity="0.3"
          />
          {/* Hands Securing & Protecting the Heart */}
          <path d="M4.5 16.5C3 15 2 13 2 10.5C2 7 5 5 8 5c1.5 0 2.8.6 3.8 1.6" strokeWidth="2" />
          <path d="M19.5 16.5C21 15 22 13 22 10.5C22 7 19 5 16 5c-1.5 0-2.8.6-3.8 1.6" strokeWidth="2" />
          <path d="M7 19c2.5 1.5 7.5 1.5 10 0" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <span className={`font-extrabold tracking-tight text-[var(--text-primary)] ${textSize}`}>
            HealthBridge
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]">
              Clinical Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
};
