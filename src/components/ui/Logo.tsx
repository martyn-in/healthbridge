import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const iconBox = size === 'sm' ? 'w-8 h-8 rounded-lg' : size === 'md' ? 'w-9 h-9 rounded-xl' : 'w-12 h-12 rounded-2xl';
  const iconSize = size === 'sm' ? 18 : size === 'md' ? 22 : 28;
  const textSize = size === 'sm' ? 'text-base' : size === 'md' ? 'text-lg' : 'text-2xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`flex items-center justify-center bg-teal-600 dark:bg-teal-500 text-white shadow-sm ${iconBox}`}>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Medical Cross & Bridge Symbol */}
          <path d="M12 4v16M4 12h16" />
          <circle cx="12" cy="12" r="9" strokeOpacity="0.4" strokeWidth="1.8" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${textSize}`}>
            HealthBridge
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
              Clinical & Patient Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
};

