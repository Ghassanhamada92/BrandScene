'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Film,
  Settings,
  Download,
  Play,
  CheckCircle2,
  Loader2,
  Sparkles,
  Monitor,
  Smartphone,
  Square,
  Maximize,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';

interface FinalRenderProps {
  scriptId: string;
  timeline: any;
  transitions: any[];
  presets: Record<string, any>;
  onStartRender: (preset: string, settings?: any) => Promise<void>;
  onCheckStatus: () => Promise<any>;
  renderStatus: any;
}

export function FinalRender({
  scriptId,
  timeline,
  transitions,
  presets,
  onStartRender,
  onCheckStatus,
  renderStatus,
}: FinalRenderProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>('1080p');
  const [isRendering, setIsRendering] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    if (renderStatus?.status === 'rendering') {
      const interval = setInterval(() => {
        onCheckStatus();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [renderStatus?.status]);

  const handleStartRender = async () => {
    setIsRendering(true);
    try {
      await onStartRender(selectedPreset);
    } finally {
      setIsRendering(false);
    }
  };

  const isComplete = renderStatus?.status === 'completed';
  const progress = renderStatus?.progress || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Final Render</h2>
              <p className="text-sm text-gray-400">Intelligent video stitching & export</p>
            </div>
          </div>

          {isComplete && (
            <Badge variant="success" className="px-4 py-2">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Ready to Download
            </Badge>
          )}
        </div>
      </GlassCard>

      {/* Timeline Preview */}
      <GlassCard className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Video Timeline</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTimeline(!showTimeline)}
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            {showTimeline ? 'Hide' : 'Show'} Details
          </Button>
        </div>

        <div className="space-y-4">
          {/* Timeline Bar */}
          <div className="relative h-16 bg-white/5 rounded-lg overflow-hidden">
            {timeline?.scenes?.map((scene: any, index: number) => {
              const percentage = (scene.duration / timeline.totalDuration) * 100;
              const colors = [
                'from-purple-500 to-pink-500',
                'from-blue-500 to-cyan-500',
                'from-green-500 to-emerald-500',
                'from-yellow-500 to-orange-500',
              ];
              const color = colors[index % colors.length];

              return (
                <motion.div
                  key={scene.sceneNumber}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={`absolute h-full bg-gradient-to-r ${color} border-r border-white/20`}
                  style={{ left: `${(scene.startTime / timeline.totalDuration) * 100}%` }}
                >
                  <div className="flex items-center justify-center h-full">
                    <span className="text-xs font-bold text-white">{scene.sceneNumber}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">0:00</span>
            <span className="text-white font-medium">
              Total Duration: {Math.round(timeline?.totalDuration || 0)}s
            </span>
            <span className="text-gray-400">
              {Math.floor((timeline?.totalDuration || 0) / 60)}:
              {String(Math.round((timeline?.totalDuration || 0) % 60)).padStart(2, '0')}
            </span>
          </div>

          {/* Transitions Info */}
          {transitions && transitions.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-400">Transitions:</span>
              {transitions.map((t: any, i: number) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {t.type}
                </Badge>
              ))}
            </div>
          )}

          {/* Detailed Timeline */}
          <AnimatePresence>
            {showTimeline && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-2 pt-4 border-t border-white/10">
                  {timeline?.scenes?.map((scene: any) => (
                    <div
                      key={scene.sceneNumber}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{scene.sceneNumber}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{scene.narration}</p>
                        <p className="text-xs text-gray-400">
                          {Math.floor(scene.startTime)}s - {Math.floor(scene.endTime)}s (
                          {Math.floor(scene.duration)}s)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassCard>

      {/* Render Settings */}
      {!renderStatus && (
        <GlassCard className="p-8">
          <div className="flex items-center gap-2 mb-6">
            <Settings className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Export Settings</h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(presets).map(([key, preset]) => (
              <PresetCard
                key={key}
                name={key}
                preset={preset}
                isSelected={selectedPreset === key}
                onSelect={() => setSelectedPreset(key)}
              />
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              onClick={handleStartRender}
              isLoading={isRendering}
              disabled={isRendering}
              className="px-12"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Rendering
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Rendering Progress */}
      {renderStatus?.status === 'rendering' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-8">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20" />
                <div className="absolute inset-0 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin" />
                <Film className="absolute inset-0 m-auto w-10 h-10 text-yellow-400" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Rendering Your Video</h3>
              <p className="text-gray-400 mb-6">
                Processing scenes, applying transitions, and syncing audio...
              </p>

              <Progress value={progress} max={100} showLabel className="mb-4" />

              <div className="grid md:grid-cols-4 gap-4 mt-8">
                {renderingSteps.map((step, index) => (
                  <RenderingStep
                    key={step.label}
                    {...step}
                    isComplete={progress > (index + 1) * 25}
                    isCurrent={progress >= index * 25 && progress < (index + 1) * 25}
                  />
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Completed */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <GlassCard className="p-12">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>

              <h3 className="text-3xl font-bold text-white mb-2">Video Ready!</h3>
              <p className="text-gray-400 mb-8">Your video has been successfully rendered</p>

              <div className="flex gap-4 justify-center mb-8">
                <Button size="lg" className="px-8">
                  <Play className="w-5 h-5 mr-2" />
                  Preview Video
                </Button>
                <Button size="lg" variant="outline" className="px-8 bg-white/5 border-white/10 text-white hover:bg-white/10">
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </Button>
              </div>

              <div className="inline-flex items-center gap-6 text-sm text-gray-400">
                <span>Duration: {Math.round(renderStatus.duration)}s</span>
                <span>•</span>
                <span>Resolution: {renderStatus.resolution}</span>
                <span>•</span>
                <span>Transitions: {renderStatus.transitions}</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}

function PresetCard({
  name,
  preset,
  isSelected,
  onSelect,
}: {
  name: string;
  preset: any;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const icons: Record<string, any> = {
    '1080p': Monitor,
    '4k': Maximize,
    social_square: Square,
    social_vertical: Smartphone,
    web: Monitor,
  };

  const Icon = icons[name] || Monitor;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={cn(
        'p-6 rounded-xl text-left transition-all',
        isSelected
          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500'
          : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
      )}
    >
      <Icon className={cn('w-8 h-8 mb-4', isSelected ? 'text-yellow-400' : 'text-gray-400')} />
      <h4 className="text-lg font-semibold text-white mb-2 capitalize">
        {name.replace(/_/g, ' ')}
      </h4>
      <div className="space-y-1 text-sm text-gray-400">
        <p>{preset.resolution}</p>
        <p>{preset.fps} FPS</p>
        <p>{preset.format.toUpperCase()}</p>
      </div>
    </motion.button>
  );
}

function RenderingStep({
  label,
  icon: Icon,
  isComplete,
  isCurrent,
}: {
  label: string;
  icon: any;
  isComplete: boolean;
  isCurrent: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all',
          isComplete && 'bg-gradient-to-br from-green-500 to-emerald-500',
          isCurrent && 'bg-gradient-to-br from-yellow-500 to-orange-500 animate-pulse',
          !isComplete && !isCurrent && 'bg-white/10'
        )}
      >
        {isComplete ? (
          <CheckCircle2 className="w-6 h-6 text-white" />
        ) : (
          <Icon className={cn('w-6 h-6', isCurrent ? 'text-white' : 'text-gray-400')} />
        )}
      </div>
      <span
        className={cn(
          'text-xs text-center',
          isComplete || isCurrent ? 'text-white' : 'text-gray-500'
        )}
      >
        {label}
      </span>
    </div>
  );
}

const renderingSteps = [
  { label: 'Processing Scenes', icon: Film },
  { label: 'Adding Transitions', icon: Sparkles },
  { label: 'Syncing Audio', icon: Settings },
  { label: 'Finalizing', icon: CheckCircle2 },
];
