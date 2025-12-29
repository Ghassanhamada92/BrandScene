'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Music, Mic, Play, Pause, Volume2, Loader2, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface VideoSynthesisProps {
  scriptId: string;
  scenes: any[];
  onSearchVideos: (sceneId: string) => Promise<void>;
  onGenerateNarration: () => Promise<void>;
  onSelectMusic: (musicId: string) => void;
  musicSuggestions: any[];
  audioTrack: any;
  isLoading: boolean;
  onContinue: () => void;
}

export function VideoSynthesis({
  scriptId,
  scenes,
  onSearchVideos,
  onGenerateNarration,
  onSelectMusic,
  musicSuggestions,
  audioTrack,
  isLoading,
  onContinue,
}: VideoSynthesisProps) {
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [searchingScene, setSearchingScene] = useState<string | null>(null);

  const handleSearchVideos = async (sceneId: string) => {
    setSearchingScene(sceneId);
    try {
      await onSearchVideos(sceneId);
    } finally {
      setSearchingScene(null);
    }
  };

  const allScenesHaveVideos = scenes.every(
    (scene) => scene.videoClips && scene.videoClips.length > 0
  );

  const hasNarration = !!audioTrack;
  const hasMusicSelected = !!selectedMusic;
  const canContinue = allScenesHaveVideos && hasNarration && hasMusicSelected;

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Video Synthesis</h2>
            <p className="text-sm text-gray-400">Add videos, narration, and music</p>
          </div>
        </div>
      </GlassCard>

      {/* Video Clips Section */}
      <GlassCard className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Stock Video Clips</h3>
          </div>
          <Badge variant={allScenesHaveVideos ? 'success' : 'secondary'}>
            {scenes.filter((s) => s.videoClips?.length > 0).length} / {scenes.length} Scenes
          </Badge>
        </div>

        <div className="space-y-4">
          {scenes.map((scene, index) => (
            <SceneVideoCard
              key={scene.id}
              scene={scene}
              index={index}
              isSearching={searchingScene === scene.id}
              onSearchVideos={() => handleSearchVideos(scene.id)}
            />
          ))}
        </div>
      </GlassCard>

      {/* Narration Section */}
      <GlassCard className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Narration</h3>
          </div>
          {hasNarration && (
            <Badge variant="success">Generated</Badge>
          )}
        </div>

        {!hasNarration ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">
              Generate AI-powered voice narration for your script
            </p>
            <Button onClick={onGenerateNarration} isLoading={isLoading}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Narration
            </Button>
          </div>
        ) : (
          <AudioPlayer audioTrack={audioTrack} />
        )}
      </GlassCard>

      {/* Music Section */}
      <GlassCard className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-pink-400" />
            <h3 className="text-lg font-semibold text-white">Background Music</h3>
          </div>
          {hasMusicSelected && (
            <Badge variant="success">Selected</Badge>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {musicSuggestions.map((music) => (
            <MusicCard
              key={music.id}
              music={music}
              isSelected={selectedMusic === music.id}
              onSelect={() => {
                setSelectedMusic(music.id);
                onSelectMusic(music.id);
              }}
            />
          ))}
        </div>
      </GlassCard>

      {/* Continue Button */}
      {canContinue && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-end"
        >
          <Button onClick={onContinue} size="lg" className="px-8">
            Continue to Final Render
          </Button>
        </motion.div>
      )}
    </div>
  );
}

function SceneVideoCard({
  scene,
  index,
  isSearching,
  onSearchVideos,
}: {
  scene: any;
  index: number;
  isSearching: boolean;
  onSearchVideos: () => void;
}) {
  const hasVideos = scene.videoClips && scene.videoClips.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-center gap-4 p-4 rounded-lg bg-white/5"
    >
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
        <span className="font-bold text-white">{scene.sceneNumber}</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white mb-1">Scene {scene.sceneNumber}</p>
        <p className="text-xs text-gray-400 truncate">{scene.visualDescription}</p>
      </div>

      {!hasVideos ? (
        <Button
          size="sm"
          onClick={onSearchVideos}
          isLoading={isSearching}
          disabled={isSearching}
        >
          Search Videos
        </Button>
      ) : (
        <div className="flex items-center gap-2">
          <Badge variant="success" className="text-xs">
            {scene.videoClips.length} clips
          </Badge>
          <Button size="sm" variant="outline" onClick={onSearchVideos}>
            Refresh
          </Button>
        </div>
      )}
    </motion.div>
  );
}

function AudioPlayer({ audioTrack }: { audioTrack: any }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:scale-105 transition-transform"
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 text-white" />
        ) : (
          <Play className="w-5 h-5 text-white ml-0.5" />
        )}
      </button>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">Full Script Narration</span>
          <span className="text-xs text-gray-400">{audioTrack.durationSeconds}s</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: '0%' }}
            animate={{ width: isPlaying ? '100%' : '0%' }}
            transition={{ duration: audioTrack.durationSeconds }}
          />
        </div>
      </div>

      <Volume2 className="w-5 h-5 text-gray-400" />
    </div>
  );
}

function MusicCard({
  music,
  isSelected,
  onSelect,
}: {
  music: any;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={cn(
        'p-4 rounded-lg text-left transition-all',
        isSelected
          ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500'
          : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsPlaying(!isPlaying);
          }}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-yellow-500 flex items-center justify-center flex-shrink-0 hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 text-white" />
          ) : (
            <Play className="w-4 h-4 text-white ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white mb-1">{music.title}</h4>
          <p className="text-xs text-gray-400 mb-2">{music.artist}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {music.mood}
            </Badge>
            <span className="text-xs text-gray-500">{music.duration}s</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
