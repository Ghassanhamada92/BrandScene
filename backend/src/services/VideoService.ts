import axios from 'axios';
import prisma from '../lib/prisma';
import logger from '../utils/logger';
import { NotFoundError, ExternalServiceError } from '../utils/errors';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';

interface PexelsVideo {
  id: number;
  url: string;
  duration: number;
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
  video_pictures: Array<{
    id: number;
    picture: string;
  }>;
}

class VideoService {
  /**
   * Search and fetch stock video clips from Pexels (Stage 3)
   */
  async searchStockVideos(sceneId: string, query?: string, count: number = 5) {
    logger.info('Searching stock videos', { sceneId, query, count });

    const scene = await prisma.scene.findUnique({
      where: { id: sceneId },
    });

    if (!scene) {
      throw new NotFoundError('Scene', sceneId);
    }

    try {
      // Use scene's visual description if no query provided
      const searchQuery = query || scene.visualDescription;

      // Search Pexels for videos
      const response = await axios.get('https://api.pexels.com/videos/search', {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
        params: {
          query: searchQuery,
          per_page: count,
          orientation: 'landscape',
        },
      });

      const videos: PexelsVideo[] = response.data.videos;

      // Save video clips to database
      const videoClips = await Promise.all(
        videos.map((video) => {
          // Get HD video file
          const hdFile = video.video_files.find(
            (file) => file.quality === 'hd' && file.width >= 1920
          ) || video.video_files[0];

          return prisma.videoClip.create({
            data: {
              sceneId,
              sourceType: 'stock',
              sourceUrl: hdFile.link,
              durationSeconds: video.duration,
              resolution: `${hdFile.width}x${hdFile.height}`,
              thumbnailUrl: video.video_pictures[0]?.picture,
              metadata: {
                pexelsId: video.id,
                quality: hdFile.quality,
                fileType: hdFile.file_type,
              } as any,
              processingStatus: 'completed',
            },
          });
        })
      );

      logger.info('Stock videos fetched', {
        sceneId,
        count: videoClips.length,
      });

      return videoClips;
    } catch (error) {
      logger.error('Stock video search failed', error as Error, { sceneId });
      
      // Return empty array if Pexels is not configured
      if (!PEXELS_API_KEY) {
        logger.warn('Pexels API key not configured');
        return [];
      }
      
      throw new ExternalServiceError('Failed to search stock videos');
    }
  }

  /**
   * Generate audio narration using ElevenLabs (Stage 3)
   */
  async generateNarration(scriptId: string, voiceId: string = 'EXAVITQu4vr4xnSDxMaL') {
    logger.info('Generating narration', { scriptId, voiceId });

    const script = await prisma.script.findUnique({
      where: { id: scriptId },
      include: {
        scenes: {
          orderBy: { sceneNumber: 'asc' },
        },
      },
    });

    if (!script) {
      throw new NotFoundError('Script', scriptId);
    }

    try {
      // Generate full script narration
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          text: script.content,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY,
          },
          responseType: 'arraybuffer',
        }
      );

      // In production, upload to S3 or similar
      // For now, we'll create a placeholder URL
      const audioUrl = `placeholder-audio-${scriptId}.mp3`;
      const duration = script.durationSeconds || 30;

      // Save audio track to database
      const audioTrack = await prisma.audioTrack.create({
        data: {
          scriptId,
          trackType: 'narration',
          audioUrl,
          durationSeconds: duration,
          voiceId,
          metadata: {
            provider: 'elevenlabs',
            model: 'eleven_monolingual_v1',
          } as any,
        },
      });

      logger.info('Narration generated', {
        scriptId,
        audioTrackId: audioTrack.id,
      });

      return audioTrack;
    } catch (error) {
      logger.error('Narration generation failed', error as Error, { scriptId });
      
      // Return null if ElevenLabs is not configured
      if (!ELEVENLABS_API_KEY) {
        logger.warn('ElevenLabs API key not configured');
        return null;
      }
      
      throw new ExternalServiceError('Failed to generate narration');
    }
  }

  /**
   * Generate scene-specific narration
   */
  async generateSceneNarration(sceneId: string, voiceId: string = 'EXAVITQu4vr4xnSDxMaL') {
    logger.info('Generating scene narration', { sceneId, voiceId });

    const scene = await prisma.scene.findUnique({
      where: { id: sceneId },
    });

    if (!scene) {
      throw new NotFoundError('Scene', sceneId);
    }

    try {
      const response = await axios.post(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          text: scene.narrationText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': ELEVENLABS_API_KEY,
          },
          responseType: 'arraybuffer',
        }
      );

      const audioUrl = `placeholder-scene-audio-${sceneId}.mp3`;

      logger.info('Scene narration generated', { sceneId });

      return {
        url: audioUrl,
        duration: Number(scene.durationSeconds),
      };
    } catch (error) {
      logger.error('Scene narration failed', error as Error, { sceneId });
      
      if (!ELEVENLABS_API_KEY) {
        logger.warn('ElevenLabs API key not configured');
        return null;
      }
      
      throw new ExternalServiceError('Failed to generate scene narration');
    }
  }

  /**
   * Suggest background music based on mood
   */
  async suggestBackgroundMusic(scriptId: string) {
    logger.info('Suggesting background music', { scriptId });

    const script = await prisma.script.findUnique({
      where: { id: scriptId },
      include: {
        scenes: true,
      },
    });

    if (!script) {
      throw new NotFoundError('Script', scriptId);
    }

    // Analyze overall mood from scenes
    const moods = script.scenes?.map((s: any) => s.mood) || [];
    const dominantMood = moods[0] || script.tone || 'upbeat';

    // Return curated music suggestions based on mood
    const musicSuggestions = this.getMusicByMood(dominantMood, script.durationSeconds || 30);

    logger.info('Music suggestions generated', {
      scriptId,
      mood: dominantMood,
      suggestions: musicSuggestions.length,
    });

    return musicSuggestions;
  }

  /**
   * Get curated music tracks by mood
   */
  private getMusicByMood(mood: string, duration: number) {
    // In production, integrate with music APIs like Epidemic Sound, Artlist, etc.
    // For now, return curated suggestions
    const musicLibrary: Record<string, any[]> = {
      energetic: [
        {
          id: 'energy-1',
          title: 'Dynamic Energy',
          artist: 'Production Music',
          duration: 60,
          url: 'https://example.com/music/energetic-1.mp3',
          mood: 'energetic',
        },
        {
          id: 'energy-2',
          title: 'Upbeat Vibes',
          artist: 'Production Music',
          duration: 45,
          url: 'https://example.com/music/energetic-2.mp3',
          mood: 'energetic',
        },
      ],
      calm: [
        {
          id: 'calm-1',
          title: 'Peaceful Moments',
          artist: 'Production Music',
          duration: 90,
          url: 'https://example.com/music/calm-1.mp3',
          mood: 'calm',
        },
      ],
      inspiring: [
        {
          id: 'inspire-1',
          title: 'Rise Up',
          artist: 'Production Music',
          duration: 75,
          url: 'https://example.com/music/inspiring-1.mp3',
          mood: 'inspiring',
        },
      ],
      professional: [
        {
          id: 'prof-1',
          title: 'Corporate Success',
          artist: 'Production Music',
          duration: 60,
          url: 'https://example.com/music/professional-1.mp3',
          mood: 'professional',
        },
      ],
    };

    return musicLibrary[mood.toLowerCase()] || musicLibrary.professional;
  }

  /**
   * Select a video clip for a scene
   */
  async selectVideoClip(clipId: string) {
    const clip = await prisma.videoClip.findUnique({
      where: { id: clipId },
    });

    if (!clip) {
      throw new NotFoundError('Video clip', clipId);
    }

    logger.info('Video clip selected', {
      sceneId: clip.sceneId,
      clipId,
    });

    return clip;
  }

  /**
   * Get all video assets for a script
   */
  async getVideoAssetsByScript(scriptId: string) {
    const scenes = await prisma.scene.findMany({
      where: { scriptId },
      include: {
        videoClips: true,
        imageVariations: {
          where: { selected: true },
        },
      },
      orderBy: { sceneNumber: 'asc' },
    });

    return scenes;
  }
}

export default new VideoService();
