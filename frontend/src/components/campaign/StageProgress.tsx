'use client';

import { motion } from 'framer-motion';
import { FileText, Search, Film, Wand2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StageProgressProps {
  currentStage: number;
}

const stages = [
  { number: 1, label: 'Brand Info', icon: FileText, description: 'Tell us about your brand' },
  { number: 2, label: 'Research', icon: Search, description: 'AI-powered market insights' },
  { number: 3, label: 'Scripts', icon: Wand2, description: 'Generate script variants' },
  { number: 4, label: 'Scenes', icon: Film, description: 'Scene composition' },
];

export function StageProgress({ currentStage }: StageProgressProps) {
  return (
    <nav className="mb-12" aria-label="Campaign creation progress">
      <ol className="flex items-center justify-between max-w-4xl mx-auto" role="list">
        {stages.map((stage, index) => {
          const isCompleted = currentStage > stage.number;
          const isCurrent = currentStage === stage.number;
          const Icon = stage.icon;

          return (
            <li key={stage.number} className="flex-1">
              <div className="flex items-center">
                {/* Stage Circle */}
                <div className="relative flex flex-col items-center flex-1">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center relative z-10 transition-all duration-300',
                      {
                        'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50':
                          isCurrent,
                        'bg-gradient-to-br from-green-500 to-emerald-500': isCompleted,
                        'bg-white/5 border border-white/20': !isCurrent && !isCompleted,
                      }
                    )}
                    aria-current={isCurrent ? 'step' : undefined}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-white" aria-label="Completed" />
                    ) : (
                      <Icon
                        className={cn('w-5 h-5', {
                          'text-white': isCurrent,
                          'text-gray-400': !isCurrent,
                        })}
                        aria-hidden="true"
                      />
                    )}
                  </motion.div>

                  {/* Label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    className="mt-2 text-center"
                  >
                    <p
                      className={cn('text-sm font-semibold', {
                        'text-white': isCurrent || isCompleted,
                        'text-gray-500': !isCurrent && !isCompleted,
                      })}
                    >
                      {stage.label}
                    </p>
                    <p
                      className={cn('text-xs mt-1', {
                        'text-gray-400': isCurrent || isCompleted,
                        'text-gray-600': !isCurrent && !isCompleted,
                      })}
                    >
                      {stage.description}
                    </p>
                  </motion.div>

                  {/* Connector Line */}
                  {index < stages.length - 1 && (
                    <div className="absolute top-6 left-1/2 w-full h-0.5 -z-10">
                      <div className="h-full bg-white/10" />
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isCompleted ? 1 : 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 origin-left"
                      />
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
