import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  private model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async generatePostSuggestion(topic: string) {
    const prompt = `Write a short engaging tweet about ${topic}. Keep it under 280 characters.`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  }
}
