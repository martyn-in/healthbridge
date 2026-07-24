'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';

export const DisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language } = useApp();

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 px-3 py-1.5 text-xs text-amber-900 dark:text-amber-300">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>{t(language, 'disclaimerShort')}</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-50 via-sky-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border border-amber-200/80 dark:border-slate-700/60 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <span className="font-semibold text-slate-900 dark:text-white mr-1.5">
            Medical Safety Notice:
          </span>
          {t(language, 'disclaimer')}
        </div>
      </div>
    </div>
  );
};
