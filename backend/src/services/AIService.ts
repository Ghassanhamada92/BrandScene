import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ResearchQuery {
  topic: string;
  context: string;
  targetAudience: string;
}

export interface ResearchResult {
  insights: string[];
  trends: string[];
  competitorAnalysis: string[];
  recommendations: string[];
  sources: string[];
  confidenceScore: number;
}

export interface ScriptGenerationParams {
  brandName: string;
  productName: string;
  productDescription: string;
  targetAudience: string;
  keyBenefits: string[];
  brandVoice?: string;
  tone?: string;
  research?: ResearchResult;
  variantNumber: number;
}

export interface GeneratedScript {
  title: string;
  content: string;
  durationSeconds: number;
  tone: string;
  style: string;
  metadata: {
    hooks: string[];
    keyMessages: string[];
    callToAction: string;
  };
}

class AIService {
  /**
   * Conduct research on target audience, market trends, and competitors
   */
  async conductResearch(query: ResearchQuery): Promise<ResearchResult> {
    try {
      const prompt = `You are a market research expert. Conduct comprehensive research for a marketing campaign with the following parameters:

Topic: ${query.topic}
Context: ${query.context}
Target Audience: ${query.targetAudience}

Provide detailed insights in the following categories:
1. Target Audience Insights: Demographics, psychographics, pain points, and desires
2. Current Trends: Latest trends in the industry and marketing
3. Competitor Analysis: What competitors are doing well and gaps in the market
4. Recommendations: Actionable recommendations for the campaign

Format your response as valid JSON with the following structure:
{
  "insights": ["insight1", "insight2", ...],
  "trends": ["trend1", "trend2", ...],
  "competitorAnalysis": ["analysis1", "analysis2", ...],
  "recommendations": ["rec1", "rec2", ...],
  "sources": ["source1", "source2", ...],
  "confidenceScore": 0.95
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert market researcher specializing in consumer insights and marketing strategy. Always respond with valid JSON.',
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
        throw new Error('No content received from OpenAI');
      }

      return JSON.parse(content) as ResearchResult;
    } catch (error) {
      console.error('Error conducting research:', error);
      throw new Error('Failed to conduct research');
    }
  }

  /**
   * Generate a script variant based on brand info and research
   */
  async generateScript(params: ScriptGenerationParams): Promise<GeneratedScript> {
    try {
      const researchContext = params.research
        ? `
Research Insights:
- Key Insights: ${params.research.insights.join(', ')}
- Current Trends: ${params.research.trends.join(', ')}
- Recommendations: ${params.research.recommendations.join(', ')}
`
        : '';

      const prompt = `You are an expert copywriter and scriptwriter specializing in video marketing content. Create a compelling video script with the following parameters:

Brand: ${params.brandName}
Product: ${params.productName}
Description: ${params.productDescription}
Target Audience: ${params.targetAudience}
Key Benefits: ${params.keyBenefits.join(', ')}
Brand Voice: ${params.brandVoice || 'professional and engaging'}
Tone: ${params.tone || 'inspirational'}
Variant: #${params.variantNumber}

${researchContext}

Create a script that:
1. Opens with a powerful hook to capture attention in the first 3 seconds
2. Clearly communicates the product's value proposition
3. Addresses the target audience's pain points and desires
4. Includes emotional storytelling elements
5. Has a strong call-to-action
6. Is optimized for ${params.variantNumber === 1 ? 'maximum engagement' : params.variantNumber === 2 ? 'emotional appeal' : 'direct response'}
7. Duration: 30-60 seconds when read at natural pace

Format your response as valid JSON with the following structure:
{
  "title": "Engaging Title Here",
  "content": "Full script content here with natural paragraph breaks...",
  "durationSeconds": 45,
  "tone": "${params.tone || 'inspirational'}",
  "style": "storytelling",
  "metadata": {
    "hooks": ["Primary hook", "Secondary hook"],
    "keyMessages": ["Message 1", "Message 2", "Message 3"],
    "callToAction": "The main CTA"
  }
}`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert video scriptwriter who creates engaging, conversion-optimized scripts. Always respond with valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      return JSON.parse(content) as GeneratedScript;
    } catch (error) {
      console.error('Error generating script:', error);
      throw new Error('Failed to generate script');
    }
  }

  /**
   * Generate multiple script variants
   */
  async generateScriptVariants(
    params: Omit<ScriptGenerationParams, 'variantNumber'>,
    count: number = 3
  ): Promise<GeneratedScript[]> {
    const variants: GeneratedScript[] = [];

    for (let i = 1; i <= count; i++) {
      const script = await this.generateScript({ ...params, variantNumber: i });
      variants.push(script);
    }

    return variants;
  }
}

export default new AIService();
