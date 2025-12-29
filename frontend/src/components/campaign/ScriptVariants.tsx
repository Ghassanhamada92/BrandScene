'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, CheckCircle2, Clock, Sparkles, Play, ThumbsUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDuration } from '@/lib/utils';
import type { Script } from '@brandscene/shared';

interface ScriptVariantsProps {
  scripts: Script[];
  isLoading: boolean;
  onGenerate: () => Promise<void>;
  onApprove: (scriptId: string) => Promise<void>;
}

export function ScriptVariants({ scripts, isLoading, onGenerate, onApprove }: ScriptVariantsProps) {
  const [selectedScript, setSelectedScript] = useState<string | null>(null);
  const [expandedScript, setExpandedScript] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Script Variants</h2>
              <p className="text-sm text-gray-400">AI-generated scripts optimized for engagement</p>
            </div>
          </div>

          {scripts.length === 0 && !isLoading && (
            <Button onClick={onGenerate} size="lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Scripts
            </Button>
          )}
        </div>
      </GlassCard>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[1, 2, 3].map((i) => (
            <GlassCard key={i} className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-white/10 rounded w-full" />
                <div className="h-3 bg-white/10 rounded w-full" />
                <div className="h-3 bg-white/10 rounded w-2/3" />
              </div>
            </GlassCard>
          ))}
        </motion.div>
      )}

      {/* Script Cards */}
      <AnimatePresence>
        {scripts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {scripts.map((script, index) => (
              <ScriptCard
                key={script.id}
                script={script}
                index={index}
                isSelected={selectedScript === script.id}
                isExpanded={expandedScript === script.id}
                onSelect={() => setSelectedScript(script.id)}
                onExpand={() => setExpandedScript(expandedScript === script.id ? null : script.id)}
                onApprove={() => onApprove(script.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ScriptCardProps {
  script: Script;
  index: number;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onExpand: () => void;
  onApprove: () => void;
}

function ScriptCard({
  script,
  index,
  isSelected,
  isExpanded,
  onSelect,
  onExpand,
  onApprove,
}: ScriptCardProps) {
  const metadata = script.metadata as any;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      layoutId={script.id}
    >
      <GlassCard
        className={`p-6 cursor-pointer transition-all duration-300 ${
          isSelected ? 'ring-2 ring-purple-500 shadow-2xl shadow-purple-500/30' : ''
        }`}
        onClick={onSelect}
        hover={!isExpanded}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={variantColors[index % 3] as any}>
                  Variant {script.variantNumber}
                </Badge>
                {script.approved && (
                  <Badge variant="success">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Approved
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{script.title}</h3>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" aria-hidden="true" />
                  {script.durationSeconds ? formatDuration(script.durationSeconds) : 'N/A'}
                </span>
                <span className="capitalize">{script.tone}</span>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <p className="text-sm text-gray-300 line-clamp-3">
              {script.content.substring(0, 150)}...
            </p>

            {/* Metadata */}
            {metadata && (
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-3 h-3 text-yellow-400 mt-1 flex-shrink-0" aria-hidden="true" />
                  <p className="text-xs text-gray-400">
                    <strong className="text-white">Hook:</strong> {metadata.hooks?.[0]}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t border-white/10">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onExpand();
              }}
              className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
              aria-label={isExpanded ? 'Collapse script' : 'Expand script to read full content'}
            >
              <Play className="w-3 h-3 mr-1" />
              {isExpanded ? 'Collapse' : 'Read Full'}
            </Button>
            {!script.approved && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove();
                }}
                className="flex-1"
                aria-label="Approve this script variant"
              >
                <ThumbsUp className="w-3 h-3 mr-1" />
                Approve
              </Button>
            )}
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Full Script</h4>
                  <div className="text-sm text-gray-300 whitespace-pre-wrap max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                    {script.content}
                  </div>
                </div>

                {metadata && (
                  <>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Key Messages</h4>
                      <ul className="space-y-1" role="list">
                        {metadata.keyMessages?.map((message: string, i: number) => (
                          <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                            <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                            {message}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Call to Action</h4>
                      <p className="text-xs text-gray-400">{metadata.callToAction}</p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}

const variantColors = ['default', 'secondary', 'outline'];
