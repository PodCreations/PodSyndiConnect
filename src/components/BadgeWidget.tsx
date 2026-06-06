import React from 'react';
import { motion } from 'motion/react';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';

interface BadgeWidgetProps {
  score: number;
  isLocked: boolean;
  lockReason?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  hideLabels?: boolean;
}

export const BadgeWidget: React.FC<BadgeWidgetProps> = ({
  score,
  isLocked,
  lockReason = 'Log in to unlock compatibility rating',
  size = 'md',
  animated = true,
  hideLabels = false,
}) => {
  const sizeClasses = {
    sm: {
      shield: 'w-20 h-22',
      scoreText: 'text-lg',
      subText: 'text-[7px]',
      container: 'p-2',
      marginOffset: '-mt-1'
    },
    md: {
      shield: 'w-28 h-30',
      scoreText: 'text-2xl',
      subText: 'text-[9px]',
      container: 'p-4',
      marginOffset: '-mt-2'
    },
    lg: {
      shield: 'w-36 h-40',
      scoreText: 'text-3.5xl',
      subText: 'text-[11px]',
      container: 'p-6',
      marginOffset: '-mt-3'
    },
  };

  const currSize = sizeClasses[size];

  if (isLocked) {
    return (
      <div className={`${currSize.container} flex flex-col items-center justify-center text-center`}>
        <motion.div
          initial={animated ? { scale: 0.95, opacity: 0.8 } : false}
          animate={animated ? { scale: 1, opacity: 1 } : false}
          className="border-2 border-dashed border-amber-300 bg-amber-50/70 dark:bg-amber-950/20 px-5 py-4 rounded-xl text-amber-800 dark:text-amber-200 text-sm font-semibold max-w-xs shadow-sm flex flex-col items-center gap-2"
        >
          <div className="bg-amber-100 dark:bg-amber-900/40 p-1.5 rounded-full">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-xs leading-relaxed text-amber-900/80 dark:text-amber-100/90 font-medium">
            {lockReason}
          </p>
        </motion.div>
        <span className="text-xs text-amber-700/60 font-medium mt-2">
          [Shortcode: psc_match_score_badge_dynamic]
        </span>
      </div>
    );
  }

  // Color intensity indicators based on score
  const getIntensityLabel = (val: number) => {
    if (val >= 85) return { text: 'Exceptional Fit', color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40' };
    if (val >= 70) return { text: 'High Compatibility', color: 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40' };
    if (val >= 50) return { text: 'Moderate Match', color: 'text-amber-600 bg-amber-50 dark:text-amber-500 dark:bg-amber-950/20' };
    return { text: 'Introductory Stage', color: 'text-slate-500 bg-slate-50 dark:text-slate-400 dark:bg-slate-900/40' };
  };

  const intensity = getIntensityLabel(score);

  return (
    <div className={`${currSize.container} flex flex-col items-center justify-center text-center`}>
      <motion.div
        className="relative flex items-center justify-center cursor-help group select-none"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <svg
          className={`${currSize.shield} drop-shadow-[0_10px_15px_rgba(212,175,55,0.35)] dark:drop-shadow-[0_10px_15px_rgba(212,175,55,0.15)]`}
          viewBox="0 0 100 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="shieldGoldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF1B8" />   {/* Ultra high gold highlight */}
              <stop offset="40%" stopColor="#D4AF37" />  {/* Metallic gold */}
              <stop offset="100%" stopColor="#916E0F" /> {/* Deep shadow gold */}
            </linearGradient>
            <radialGradient id="innerShieldGlow" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#FFFBE6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Main Shield Path */}
          <path
            d="M50 5 L90 25 C90 65 75 90 50 105 C25 90 10 65 10 25 L50 5 Z"
            fill="url(#shieldGoldGradient)"
            stroke="#7C6010"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          
          {/* Inner Gloss Overlay */}
          <path
            d="M50 11 L83 28 C83 62 70 85 50 98 C30 85 17 62 17 28 L50 11 Z"
            fill="url(#innerShieldGlow)"
            stroke="#FFFFFF"
            strokeOpacity="0.3"
            strokeWidth="1.5"
          />
        </svg>

        {/* Dynamic score content centered in shield */}
        <div className={`absolute z-10 text-center ${currSize.marginOffset} flex flex-col items-center justify-center`}>
          <span className={`${currSize.scoreText} font-display font-bold text-white tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]`}>
            {score}%
          </span>
          <span className={`${currSize.subText} font-display font-bold text-amber-50 uppercase tracking-widest leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]`}>
            Match
          </span>
        </div>
      </motion.div>

      {!hideLabels && (
        <>
          <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-amber-200/40 ${intensity.color}`}>
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            {intensity.text}
          </div>
          
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-1">
            [psc_match_score_badge_dynamic]
          </span>
        </>
      )}
    </div>
  );
};
