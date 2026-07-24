import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const iconSize = size === 'sm' ? 28 : size === 'md' ? 36 : 48;
  const textSize = size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-3xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 via-teal-600 to-cyan-500 p-1.5 text-white shadow-md shadow-teal-500/20">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:scale-105"
        >
          {/* Bridge Arc */}
          <path
            d="M 6 26 C 14 14, 26 14, 34 26"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Medical Cross */}
          <path
            d="M 20 10 V 22 M 14 16 H 26"
            stroke="#22D3EE"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* AI Node Motifs */}
          <circle cx="6" cy="26" r="2.5" fill="#38BDF8" />
          <circle cx="34" cy="26" r="2.5" fill="#38BDF8" />
          <circle cx="20" cy="10" r="2.5" fill="white" />
          <circle cx="20" cy="28" r="2" fill="#14B8A6" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`font-extrabold tracking-tight text-navy-900 dark:text-white ${textSize}`}>
            HealthBridge <span className="text-teal-600 dark:text-cyan-400">AI</span>
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold -mt-1">
              Healthcare Connected
            </span>
          )}
        </div>
      )}
    </div>
  );
};
