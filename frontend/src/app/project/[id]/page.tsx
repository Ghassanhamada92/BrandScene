'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { StageProgressExtended } from '@/components/campaign/StageProgressExtended';
import { SceneEditor } from '@/components/scenes/SceneEditor';
import { VideoSynthesis } from '@/components/video/VideoSynthesis';
import { FinalRender } from '@/components/render/FinalRender';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [currentStage, setCurrentStage] = useState(2);
  const [scriptId, setScriptId] = useState<string | null>(null);
  const [scenes, setScenes] = useState<any[]>([]);
  const [musicSuggestions, setMusicSuggestions] = useState<any[]>([]);
  const [audioTrack, setAudioTrack] = useState<any>(null);
  const [timeline, setTimeline] = useState<any>(null);
  const [transitions, setTransitions] = useState<any[]>([]);
  const [presets, setPresets] = useState<Record<string, any>>({});
  const [renderStatus, setRenderStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      const project = await api.getProject(projectId);
      
      // Get the approved script
      const approvedScript = project.campaigns?.[0]?.scripts?.find((s: any) => s.approved);
      if (approvedScript) {
        setScriptId(approvedScript.id);
        loadScenes(approvedScript.id);
        loadMusicSuggestions(approvedScript.id);
      }
    } catch (error) {
      toast.error('Failed to load project');
    }
  };

  const loadScenes = async (scriptId: string) => {
    try {
      const scenesData = await api.getScenes(scriptId);
      setScenes(scenesData);
      if (scenesData.length > 0) {
        setCurrentStage(3);
      }
    } catch (error) {
      // Scenes not generated yet
    }
  };

  const loadMusicSuggestions = async (scriptId: string) => {
    try {
      const suggestions = await api.suggestMusic(scriptId);
      setMusicSuggestions(suggestions);
    } catch (error) {
      console.error('Failed to load music suggestions');
    }
  };

  // Stage 2 handlers
  const handleGenerateScenes = async () => {
    if (!scriptId) return;
    
    setIsLoading(true);
    try {
      const generatedScenes = await api.generateScenes(scriptId);
      setScenes(generatedScenes);
      toast.success('Scenes generated successfully!');
    } catch (error) {
      toast.error('Failed to generate scenes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImages = async (sceneId: string) => {
    try {
      const variations = await api.generateImageVariations(sceneId, 3);
      
      // Update scenes with new variations
      setScenes((prev) =>
        prev.map((scene) =>
          scene.id === sceneId ? { ...scene, imageVariations: variations } : scene
        )
      );
      
      toast.success('Images generated successfully!');
    } catch (error) {
      toast.error('Failed to generate images');
    }
  };

  const handleSelectImage = async (variationId: string) => {
    try {
      await api.selectImageVariation(variationId);
      
      // Update local state
      setScenes((prev) =>
        prev.map((scene) => ({
          ...scene,
          imageVariations: scene.imageVariations?.map((v: any) => ({
            ...v,
            selected: v.id === variationId,
          })),
        }))
      );
      
      toast.success('Image selected!');
    } catch (error) {
      toast.error('Failed to select image');
    }
  };

  // Stage 3 handlers
  const handleSearchVideos = async (sceneId: string) => {
    try {
      const videos = await api.searchStockVideos(sceneId);
      
      setScenes((prev) =>
        prev.map((scene) =>
          scene.id === sceneId ? { ...scene, videoClips: videos } : scene
        )
      );
      
      toast.success('Videos found!');
    } catch (error) {
      toast.error('Failed to search videos');
    }
  };

  const handleGenerateNarration = async () => {
    if (!scriptId) return;
    
    setIsLoading(true);
    try {
      const audio = await api.generateNarration(scriptId);
      setAudioTrack(audio);
      toast.success('Narration generated!');
    } catch (error) {
      toast.error('Failed to generate narration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMusic = (musicId: string) => {
    toast.success('Music selected!');
  };

  // Stage 4 handlers
  const handlePrepareRender = async () => {
    if (!scriptId) return;
    
    setCurrentStage(4);
    setIsLoading(true);
    
    try {
      const [transitionsData, timelineData, presetsData] = await Promise.all([
        api.generateTransitions(scriptId),
        api.calculateTimeline(scriptId),
        api.getRenderPresets(),
      ]);
      
      setTransitions(transitionsData);
      setTimeline(timelineData);
      setPresets(presetsData);
      
      toast.success('Ready to render!');
    } catch (error) {
      toast.error('Failed to prepare render');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartRender = async (preset: string) => {
    if (!scriptId) return;
    
    try {
      const video = await api.startRendering(scriptId, presets[preset]);
      setRenderStatus({ ...video, status: 'rendering', progress: 0 });
      toast.success('Rendering started!');
    } catch (error) {
      toast.error('Failed to start rendering');
    }
  };

  const handleCheckStatus = async () => {
    if (!scriptId) return;
    
    try {
      const status = await api.getRenderingStatus(scriptId);
      setRenderStatus(status);
    } catch (error) {
      console.error('Failed to check status');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link href="/projects">
            <Button
              variant="ghost"
              className="mb-4 text-white hover:bg-white/10"
              aria-label="Go back to projects"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>
          </Link>

          <StageProgressExtended currentStage={currentStage} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {currentStage === 2 && (
            <SceneEditor
              scenes={scenes}
              isLoading={isLoading}
              onGenerate={handleGenerateScenes}
              onGenerateImages={handleGenerateImages}
              onSelectImage={handleSelectImage}
              onContinue={() => setCurrentStage(3)}
            />
          )}

          {currentStage === 3 && (
            <VideoSynthesis
              scriptId={scriptId || ''}
              scenes={scenes}
              onSearchVideos={handleSearchVideos}
              onGenerateNarration={handleGenerateNarration}
              onSelectMusic={handleSelectMusic}
              musicSuggestions={musicSuggestions}
              audioTrack={audioTrack}
              isLoading={isLoading}
              onContinue={handlePrepareRender}
            />
          )}

          {currentStage === 4 && (
            <FinalRender
              scriptId={scriptId || ''}
              timeline={timeline}
              transitions={transitions}
              presets={presets}
              onStartRender={handleStartRender}
              onCheckStatus={handleCheckStatus}
              renderStatus={renderStatus}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
