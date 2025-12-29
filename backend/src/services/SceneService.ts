import OpenAI from 'openai';
import prisma from '../lib/prisma';
import logger from '../utils/logger';
import { NotFoundError, AIServiceError } from '../utils/errors';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface SceneBreakdown {
  sceneNumber: number;
  narrationText: string;
  visualDescription: string;
  durationSeconds: number;
  mood: string;
  cameraAngle: string;
  transitionType: string;
}

class SceneService {
  /**
   * Break script into scenes using AI (Stage 2)
   */
  async generateScenes(scriptId: string) {
    logger.info('Generating scenes from script', { scriptId });

    const script = await prisma.script.findUnique({
      where: { id: scriptId },
    });

    if (!script) {
      throw new NotFoundError('Script', scriptId);
    }

    try {
      // Use GPT-4 to break script into scenes
      const prompt = `You are an expert video director and cinematographer. Break down the following video script into logical scenes for production.

Script Title: ${script.title}
Script Content:
${script.content}

Total Duration: ${script.durationSeconds || 30} seconds

For each scene, provide:
1. Scene number
2. Narration text (what the voiceover says)
3. Visual description (detailed description of what should be shown)
4. Duration in seconds
5. Mood (e.g., energetic, calm, inspiring, professional)
6. Camera angle (e.g., close-up, wide shot, medium shot, overhead)
7. Transition type to next scene (e.g., fade, cut, dissolve, zoom)

Ensure scenes flow naturally and match the script's tone. Each scene should be 3-10 seconds.

Format your response as valid JSON:
{
  "scenes": [
    {
      "sceneNumber": 1,
      "narrationText": "text here",
      "visualDescription": "detailed visual description",
      "durationSeconds": 5,
      "mood": "energetic",
      "cameraAngle": "wide shot",
      "transitionType": "fade"
    }
  ]
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert video director. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new AIServiceError('No content received from OpenAI');
      }

      const result = JSON.parse(content) as { scenes: SceneBreakdown[] };

      // Save scenes to database
      const scenes = await Promise.all(
        result.scenes.map((scene) =>
          prisma.scene.create({
            data: {
              scriptId,
              sceneNumber: scene.sceneNumber,
              narrationText: scene.narrationText,
              visualDescription: scene.visualDescription,
              durationSeconds: scene.durationSeconds,
              mood: scene.mood,
              cameraAngle: scene.cameraAngle,
              transitionType: scene.transitionType,
            },
          })
        )
      );

      logger.info('Scenes generated successfully', {
        scriptId,
        sceneCount: scenes.length,
      });

      return scenes;
    } catch (error) {
      logger.error('Scene generation failed', error as Error, { scriptId });
      throw new AIServiceError('Failed to generate scenes');
    }
  }

  /**
   * Generate image variations for a scene using DALL-E (Stage 2)
   */
  async generateImageVariations(sceneId: string, count: number = 3) {
    logger.info('Generating image variations', { sceneId, count });

    const scene = await prisma.scene.findUnique({
      where: { id: sceneId },
    });

    if (!scene) {
      throw new NotFoundError('Scene', sceneId);
    }

    try {
      // Create optimized prompt for DALL-E
      const imagePrompt = `Professional, high-quality video frame: ${scene.visualDescription}. 
Style: Modern, cinematic, ${scene.mood}. 
Camera: ${scene.cameraAngle}. 
Lighting: Professional video production lighting.
No text, no watermarks.`;

      const variations = [];

      // Generate multiple variations
      for (let i = 0; i < count; i++) {
        try {
          const response = await openai.images.generate({
            model: 'dall-e-3',
            prompt: imagePrompt,
            n: 1,
            size: '1792x1024', // Landscape format for video
            quality: 'hd',
          });

          const imageUrl = response.data?.[0]?.url;
          if (!imageUrl) continue;

          // Save to database
          const variation = await prisma.imageVariation.create({
            data: {
              sceneId,
              variationNumber: i + 1,
              prompt: imagePrompt,
              imageUrl,
              generationParams: {
                model: 'dall-e-3',
                size: '1792x1024',
                quality: 'hd',
              } as any,
            },
          });

          variations.push(variation);

          logger.info('Image variation generated', {
            sceneId,
            variationNumber: i + 1,
          });
        } catch (error) {
          logger.error('Failed to generate image variation', error as Error, {
            sceneId,
            variationNumber: i + 1,
          });
        }
      }

      if (variations.length === 0) {
        throw new AIServiceError('Failed to generate any image variations');
      }

      return variations;
    } catch (error) {
      logger.error('Image generation failed', error as Error, { sceneId });
      throw new AIServiceError('Failed to generate image variations');
    }
  }

  /**
   * Select an image variation for a scene
   */
  async selectImageVariation(variationId: string) {
    const variation = await prisma.imageVariation.findUnique({
      where: { id: variationId },
    });

    if (!variation) {
      throw new NotFoundError('Image variation', variationId);
    }

    // Deselect all other variations for this scene
    await prisma.imageVariation.updateMany({
      where: { sceneId: variation.sceneId },
      data: { selected: false },
    });

    // Select this variation
    const selected = await prisma.imageVariation.update({
      where: { id: variationId },
      data: { selected: true },
    });

    logger.info('Image variation selected', {
      sceneId: variation.sceneId,
      variationId,
    });

    return selected;
  }

  /**
   * Get all scenes for a script with variations
   */
  async getScenesByScript(scriptId: string) {
    const scenes = await prisma.scene.findMany({
      where: { scriptId },
      include: {
        imageVariations: {
          orderBy: { variationNumber: 'asc' },
        },
      },
      orderBy: { sceneNumber: 'asc' },
    });

    return scenes;
  }
}

export default new SceneService();
