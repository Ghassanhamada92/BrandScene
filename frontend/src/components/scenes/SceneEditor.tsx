'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, Clock, Eye, Sparkles, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatDuration } from '@/lib/utils';

interface Scene {
  id: string;
  sceneNumber: number;
  narrationText: string;
  visualDescription: string;
  durationSeconds: number;
  mood: string;
  cameraAngle: string;
  transitionType: string;
  imageVariations?: ImageVariation[];
}

interface ImageVariation {
  id: string;
  variationNumber: number;
  imageUrl: string;
  selected: boolean;
}

interface SceneEditorProps {
  scenes: Scene[];
  isLoading: boolean;
  onGenerate: () => Promise<void>;
  onGenerateImages: (sceneId: string) => Promise<void>;
  onSelectImage: (variationId: string) => Promise<void>;
  onContinue: () => void;
}

export function SceneEditor({
  scenes,
  isLoading,
  onGenerate,
  onGenerateImages,
  onSelectImage,
  onContinue,
}: SceneEditorProps) {
  const [expandedScene, setExpandedScene] = useState<string | null>(null);
  const [generatingImages, setGeneratingImages] = useState<string | null>(null);

  const handleGenerateImages = async (sceneId: string) => {
    setGeneratingImages(sceneId);
    try {
      await onGenerateImages(sceneId);
    } finally {
      setGeneratingImages(null);
    }
  };

  const allScenesHaveImages = scenes.every(
    (scene) => scene.imageVariations && scene.imageVariations.length > 0
  );

  const allImagesSelected = scenes.every(
    (scene) => scene.imageVariations?.some((v) => v.selected)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Scene Composition</h2>
              <p className="text-sm text-gray-400">Break down script into visual scenes</p>
            </div>
          </div>

          {scenes.length === 0 && !isLoading && (
            <Button onClick={onGenerate} size="lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Scenes
            </Button>
          )}
        </div>
      </GlassCard>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <GlassCard className="p-12">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
              <Film className="absolute inset-0 m-auto w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Analyzing Script</h3>
            <p className="text-gray-400">
              AI is breaking down your script into logical scenes with visual descriptions...
            </p>
          </GlassCard>
        </motion.div>
      )}

      {/* Scenes List */}
      {scenes.length > 0 && (
        <>
          <div className="space-y-4">
            {scenes.map((scene, index) => (
              <SceneCard
                key={scene.id}
                scene={scene}
                index={index}
                isExpanded={expandedScene === scene.id}
                isGenerating={generatingImages === scene.id}
                onToggle={() => setExpandedScene(expandedScene === scene.id ? null : scene.id)}
                onGenerateImages={() => handleGenerateImages(scene.id)}
                onSelectImage={onSelectImage}
              />
            ))}
          </div>

          {/* Continue Button */}
          {allScenesHaveImages && allImagesSelected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <Button onClick={onContinue} size="lg" className="px-8">
                Continue to Video Synthesis
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}

function SceneCard({
  scene,
  index,
  isExpanded,
  isGenerating,
  onToggle,
  onGenerateImages,
  onSelectImage,
}: {
  scene: Scene;
  index: number;
  isExpanded: boolean;
  isGenerating: boolean;
  onToggle: () => void;
  onGenerateImages: () => void;
  onSelectImage: (variationId: string) => void;
}) {
  const hasImages = scene.imageVariations && scene.imageVariations.length > 0;
  const selectedImage = scene.imageVariations?.find((v) => v.selected);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <GlassCard className="overflow-hidden">
        {/* Scene Header */}
        <button
          onClick={onToggle}
          className="w-full p-6 text-left hover:bg-white/5 transition-colors"
          aria-expanded={isExpanded}
        >
          <div className="flex items-start gap-4">
            {/* Scene Number */}
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-white">{scene.sceneNumber}</span>
            </div>

            {/* Scene Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white">
                  Scene {scene.sceneNumber}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {scene.mood}
                </Badge>
                {selectedImage && (
                  <Badge variant="success" className="text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    Selected
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-300 line-clamp-2 mb-2">
                {scene.visualDescription}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDuration(Math.round(scene.durationSeconds))}
                </span>
                <span>{scene.cameraAngle}</span>
                <span>Transition: {scene.transitionType}</span>
              </div>
            </div>

            {/* Expand Icon */}
            <div className="flex-shrink-0">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </div>
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-4 border-t border-white/10">
                {/* Narration */}
                <div className="pt-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Narration</h4>
                  <p className="text-sm text-gray-300 italic">"{scene.narrationText}"</p>
                </div>

                {/* Visual Description */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Visual Description</h4>
                  <p className="text-sm text-gray-300">{scene.visualDescription}</p>
                </div>

                {/* Image Variations */}
                {!hasImages ? (
                  <div className="pt-4">
                    <Button
                      onClick={onGenerateImages}
                      isLoading={isGenerating}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Image Variations
                    </Button>
                  </div>
                ) : (
                  <div className="pt-4">
                    <h4 className="text-sm font-semibold text-white mb-3">
                      Image Variations (Select One)
                    </h4>
                    <div className="grid grid-cols-3 gap-4">
                      {scene.imageVariations?.map((variation) => (
                        <ImageVariationCard
                          key={variation.id}
                          variation={variation}
                          isSelected={variation.selected}
                          onSelect={() => onSelectImage(variation.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  );
}

function ImageVariationCard({
  variation,
  isSelected,
  onSelect,
}: {
  variation: ImageVariation;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={cn(
        'relative rounded-lg overflow-hidden aspect-video group',
        isSelected && 'ring-4 ring-purple-500'
      )}
    >
      <img
        src={variation.imageUrl}
        alt={`Variation ${variation.variationNumber}`}
        className="w-full h-full object-cover"
      />
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 transition-opacity',
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        )}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-xs font-medium text-white">
            Variation {variation.variationNumber}
          </span>
          {isSelected && (
            <CheckCircle2 className="w-4 h-4 text-white" />
          )}
        </div>
      </div>
    </motion.button>
  );
}
