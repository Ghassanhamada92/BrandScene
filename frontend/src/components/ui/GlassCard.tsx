'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  delay?: number;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, delay = 0, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        whileHover={hover ? { y: -5, scale: 1.01 } : undefined}
        className={cn(
          'rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10',
          'shadow-xl shadow-black/5',
          'transition-all duration-300',
          hover && 'hover:shadow-2xl hover:shadow-black/10',
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        <div className="relative">{children}</div>
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
