'use client';

import { motion } from 'framer-motion';
import { FileText, Search, Film, Wand2, Image, Video, Music, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StageProgressExtendedProps {
  currentStage: number;
}

const stages = [
  { 
    number: 1, 
    label: 'Script', 
    icon: Wand2, 
    description: 'AI-powered script generation',
    substeps: ['Brand Info', 'Research', 'Script Variants']
  },
  { 
    number: 2, 
    label: 'Scenes', 
    icon: Image, 
    description: 'Scene composition & visuals',
    substeps: ['Scene Breakdown', 'Image Generation', 'Visual Selection']
  },
  { 
    number: 3, 
    label: 'Video', 
    icon: Video, 
    description: 'Video & audio synthesis',
    substeps: ['Stock Video', 'Narration', 'Music Selection']
  },
  { 
    number: 4, 
    label: 'Render', 
    icon: Film, 
    description: 'Final video production',
    substeps: ['Stitching', 'Transitions', 'Export']
  },
];

export function StageProgressExtended({ currentStage }: StageProgressExtendedProps) {
  return (
    <nav className="mb-12" aria-label="Campaign creation progress">
      {/* Main Progress Bar */}
      <div className="relative mb-8">
        <div className="absolute top-6 left-0 w-full h-1 bg-white/10" />
        <motion.div
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStage - 1) / 3) * 100}%` }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
        
        <div className="relative flex justify-between">
          {stages.map((stage, index) => {
            const isCompleted = currentStage > stage.number;
            const isCurrent = currentStage === stage.number;
            const Icon = stage.icon;

            return (
              <motion.div
                key={stage.number}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center flex-1"
              >
                {/* Stage Circle */}
                <motion.div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 shadow-lg',
                    {
                      'bg-gradient-to-br from-purple-500 to-pink-500 shadow-purple-500/50 scale-110':
                        isCurrent,
                      'bg-gradient-to-br from-green-500 to-emerald-500 shadow-green-500/50': isCompleted,
                      'bg-white/10 backdrop-blur-xl border border-white/20': !isCurrent && !isCompleted,
                    }
                  )}
                  whileHover={{ scale: 1.1 }}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-white" aria-label="Completed" />
                    </motion.div>
                  ) : (
                    <Icon
                      className={cn('w-5 h-5', {
                        'text-white': isCurrent || isCompleted,
                        'text-gray-400': !isCurrent && !isCompleted,
                      })}
                      aria-hidden="true"
                    />
                  )}
                </motion.div>

                {/* Stage Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="mt-3 text-center max-w-[150px]"
                >
                  <p
                    className={cn('text-sm font-semibold mb-1', {
                      'text-white': isCurrent || isCompleted,
                      'text-gray-500': !isCurrent && !isCompleted,
                    })}
                  >
                    Stage {stage.number}: {stage.label}
                  </p>
                  <p
                    className={cn('text-xs', {
                      'text-gray-400': isCurrent || isCompleted,
                      'text-gray-600': !isCurrent && !isCompleted,
                    })}
                  >
                    {stage.description}
                  </p>

                  {/* Substeps */}
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ delay: 0.3 }}
                      className="mt-2 space-y-1"
                    >
                      {stage.substeps.map((substep, i) => (
                        <motion.div
                          key={substep}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="flex items-center gap-1 text-xs text-gray-400"
                        >
                          <div className="w-1 h-1 rounded-full bg-purple-400" />
                          <span>{substep}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Progress Percentage */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
          <span className="text-sm text-gray-400">Overall Progress:</span>
          <span className="text-lg font-bold text-white">
            {Math.round(((currentStage - 1) / 3) * 100)}%
          </span>
        </div>
      </motion.div>
    </nav>
  );
}
