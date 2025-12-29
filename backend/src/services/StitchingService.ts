import OpenAI from 'openai';
import prisma from '../lib/prisma';
import logger from '../utils/logger';
import { NotFoundError, AIServiceError } from '../utils/errors';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TransitionConfig {
  type: string;
  duration: number;
  parameters: Record<string, any>;
}

interface RenderSettings {
  resolution: string;
  fps: number;
  codec: string;
  bitrate: string;
  format: string;
}

class StitchingService {
  /**
   * Analyze scenes and suggest optimal transitions (Stage 4)
   */
  async generateTransitions(scriptId: string): Promise<TransitionConfig[]> {
    logger.info('Generating intelligent transitions', { scriptId });

    const script = await prisma.script.findUnique({
      where: { id: scriptId },
      include: {
        scenes: {
          orderBy: { sceneNumber: 'asc' },
        },
      },
    });

    if (!script || !script.scenes) {
      throw new NotFoundError('Script or scenes', scriptId);
    }

    try {
      // Use AI to determine best transitions between scenes
      const sceneDescriptions = script.scenes.map((scene: any) => ({
        number: scene.sceneNumber,
        mood: scene.mood,
        description: scene.visualDescription,
        duration: scene.durationSeconds,
      }));

      const prompt = `You are a professional video editor. Analyze these video scenes and recommend the best transition type between each pair of consecutive scenes.

Scenes:
${JSON.stringify(sceneDescriptions, null, 2)}

For each transition, consider:
1. Mood compatibility between scenes
2. Visual flow and continuity
3. Pacing and rhythm
4. Professional video editing standards

Available transitions:
- fade: Smooth fade to black/white
- dissolve: Cross-dissolve blend
- cut: Direct cut (instant)
- wipe: Directional wipe effect
- zoom: Zoom in/out transition
- slide: Slide transition

Provide recommendations as valid JSON:
{
  "transitions": [
    {
      "fromScene": 1,
      "toScene": 2,
      "type": "fade",
      "duration": 0.5,
      "reasoning": "Smooth transition for mood shift"
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are a professional video editor. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new AIServiceError('No content received from OpenAI');
      }

      const result = JSON.parse(content) as { transitions: any[] };

      logger.info('Transitions generated', {
        scriptId,
        count: result.transitions.length,
      });

      return result.transitions.map((t) => ({
        type: t.type,
        duration: t.duration,
        parameters: { reasoning: t.reasoning },
      }));
    } catch (error) {
      logger.error('Transition generation failed', error as Error, { scriptId });
      
      // Fallback to default transitions
      return this.getDefaultTransitions(script.scenes.length);
    }
  }

  /**
   * Get default transitions as fallback
   */
  private getDefaultTransitions(sceneCount: number): TransitionConfig[] {
    const transitions: TransitionConfig[] = [];
    
    for (let i = 0; i < sceneCount - 1; i++) {
      transitions.push({
        type: i === 0 || i === sceneCount - 2 ? 'fade' : 'dissolve',
        duration: 0.5,
        parameters: {},
      });
    }

    return transitions;
  }

  /**
   * Calculate video composition timeline (Stage 4)
   */
  async calculateTimeline(scriptId: string) {
    logger.info('Calculating video timeline', { scriptId });

    const script = await prisma.script.findUnique({
      where: { id: scriptId },
      include: {
        scenes: {
          orderBy: { sceneNumber: 'asc' },
          include: {
            videoClips: true,
            imageVariations: {
              where: { selected: true },
            },
          },
        },
        audioTracks: {
          where: { trackType: 'narration' },
        },
      },
    });

    if (!script) {
      throw new NotFoundError('Script', scriptId);
    }

    let currentTime = 0;
    const timeline = [];

    for (const scene of script.scenes) {
      timeline.push({
        sceneNumber: scene.sceneNumber,
        startTime: currentTime,
        endTime: currentTime + Number(scene.durationSeconds),
        duration: Number(scene.durationSeconds),
        videoClip: scene.videoClips[0] || null,
        imageVariation: scene.imageVariations[0] || null,
        narration: scene.narrationText,
      });

      currentTime += Number(scene.durationSeconds);
    }

    logger.info('Timeline calculated', {
      scriptId,
      totalDuration: currentTime,
      scenes: timeline.length,
    });

    return {
      totalDuration: currentTime,
      scenes: timeline,
      narration: script.audioTracks[0] || null,
    };
  }

  /**
   * Start video rendering process (Stage 4)
   */
  async startRendering(
    scriptId: string,
    settings: Partial<RenderSettings> = {}
  ) {
    logger.info('Starting video rendering', { scriptId, settings });

    const script = await prisma.script.findUnique({
      where: { id: scriptId },
      include: {
        scenes: {
          orderBy: { sceneNumber: 'asc' },
          include: {
            videoClips: true,
            imageVariations: {
              where: { selected: true },
            },
          },
        },
        audioTracks: true,
      },
    });

    if (!script) {
      throw new NotFoundError('Script', scriptId);
    }

    // Validate all required assets
    const missingAssets = this.validateAssets(script);
    if (missingAssets.length > 0) {
      throw new Error(`Missing assets: ${missingAssets.join(', ')}`);
    }

    // Default render settings
    const renderSettings: RenderSettings = {
      resolution: settings.resolution || '1920x1080',
      fps: settings.fps || 30,
      codec: settings.codec || 'h264',
      bitrate: settings.bitrate || '5000k',
      format: settings.format || 'mp4',
    };

    // Generate transitions
    const transitions = await this.generateTransitions(scriptId);

    // Calculate timeline
    const timeline = await this.calculateTimeline(scriptId);

    // Create video record
    const video = await prisma.video.create({
      data: {
        scriptId,
        videoUrl: `rendering-${scriptId}.${renderSettings.format}`,
        durationSeconds: timeline.totalDuration,
        resolution: renderSettings.resolution,
        renderSettings: renderSettings as any,
        status: 'rendering',
      },
    });

    // Save transitions
    await this.saveTransitions(video.id, script.scenes, transitions);

    // In production, this would:
    // 1. Queue the rendering job
    // 2. Use FFmpeg or cloud rendering service
    // 3. Process video clips, images, audio
    // 4. Apply transitions and effects
    // 5. Export final video
    // 6. Upload to storage (S3, etc.)
    // 7. Update video record with final URL

    // Simulate rendering completion
    setTimeout(async () => {
      await prisma.video.update({
        where: { id: video.id },
        data: {
          status: 'completed',
          videoUrl: `final-${scriptId}.mp4`,
          completedAt: new Date(),
        },
      });

      logger.info('Video rendering completed', {
        scriptId,
        videoId: video.id,
      });
    }, 5000); // Simulate 5 second render

    logger.info('Video rendering queued', {
      scriptId,
      videoId: video.id,
      settings: renderSettings,
    });

    return video;
  }

  /**
   * Save transitions to database
   */
  private async saveTransitions(
    videoId: string,
    scenes: any[],
    transitions: TransitionConfig[]
  ) {
    const transitionRecords = transitions.map((transition, index) => ({
      videoId,
      fromSceneId: scenes[index].id,
      toSceneId: scenes[index + 1].id,
      transitionType: transition.type,
      durationSeconds: transition.duration,
      parameters: transition.parameters as any,
    }));

    await prisma.transition.createMany({
      data: transitionRecords,
    });

    logger.info('Transitions saved', {
      videoId,
      count: transitionRecords.length,
    });
  }

  /**
   * Validate all required assets are present
   */
  private validateAssets(script: any): string[] {
    const missing: string[] = [];

    // Check scenes have video clips or images
    script.scenes.forEach((scene: any) => {
      const hasVideo = scene.videoClips && scene.videoClips.length > 0;
      const hasImage = scene.imageVariations && scene.imageVariations.length > 0;
      
      if (!hasVideo && !hasImage) {
        missing.push(`Scene ${scene.sceneNumber}: No video or image`);
      }
    });

    // Check narration exists
    const hasNarration = script.audioTracks?.some((t: any) => t.trackType === 'narration');
    if (!hasNarration) {
      missing.push('No narration audio track');
    }

    return missing;
  }

  /**
   * Get rendering status
   */
  async getRenderingStatus(scriptId: string) {
    const video = await prisma.video.findFirst({
      where: { scriptId },
      orderBy: { createdAt: 'desc' },
      include: {
        transitions: true,
      },
    });

    if (!video) {
      return null;
    }

    return {
      id: video.id,
      status: video.status,
      progress: video.status === 'rendering' ? 50 : video.status === 'completed' ? 100 : 0,
      videoUrl: video.videoUrl,
      duration: video.durationSeconds,
      resolution: video.resolution,
      completedAt: video.completedAt,
      transitions: video.transitions.length,
    };
  }

  /**
   * Get render presets
   */
  getRenderPresets(): Record<string, RenderSettings> {
    return {
      '1080p': {
        resolution: '1920x1080',
        fps: 30,
        codec: 'h264',
        bitrate: '5000k',
        format: 'mp4',
      },
      '4k': {
        resolution: '3840x2160',
        fps: 30,
        codec: 'h264',
        bitrate: '20000k',
        format: 'mp4',
      },
      'social_square': {
        resolution: '1080x1080',
        fps: 30,
        codec: 'h264',
        bitrate: '4000k',
        format: 'mp4',
      },
      'social_vertical': {
        resolution: '1080x1920',
        fps: 30,
        codec: 'h264',
        bitrate: '4000k',
        format: 'mp4',
      },
      'web': {
        resolution: '1280x720',
        fps: 30,
        codec: 'h264',
        bitrate: '3000k',
        format: 'mp4',
      },
    };
  }
}

export default new StitchingService();
