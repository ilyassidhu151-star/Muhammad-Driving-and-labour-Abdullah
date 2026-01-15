
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateWallpaper(prompt: string, aspectRatio: '1:1' | '9:16' | '16:9' = '16:9'): Promise<string> {
    try {
      // We use gemini-2.5-flash-image for general high-quality 3D visual generation
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              text: `Generate a high-quality 3D wallpaper with the following description: ${prompt}. 
                     Focus on depth, parallax effect, and high-fidelity rendering. 
                     The style should be immersive and cinematic.`
            }
          ]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio
          }
        }
      });

      let imageUrl = '';
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (!imageUrl) throw new Error("No image data received from API");
      return imageUrl;
    } catch (error) {
      console.error("Gemini Image Generation Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
