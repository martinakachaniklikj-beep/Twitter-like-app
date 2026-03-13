import { Controller, Get, Query, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';

@Controller('geminiAi')
@UseGuards(FirebaseAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('suggest')
  async suggest(@Query('topic') topic: string) {
    const text = await this.aiService.generatePostSuggestion(topic);
    return { text };
  }

  @Get('inspiration')
  async inspiration(@Query('kind') kind?: 'joke' | 'quote') {
    const safeKind: 'joke' | 'quote' =
      kind === 'joke' || kind === 'quote' ? kind : 'quote';
    const text = await this.aiService.getInspiration(safeKind);
    return { text, kind: safeKind };
  }

  @Post('moderate')
  async moderate(@Body() body: { text: string }) {
    return this.aiService.moderateText(body.text);
  }

  @Post('check-hashtags')
  async checkHashtags(@Body() body: { text: string }) {
    return this.aiService.checkHashtags(body.text);
  }

  @Post('fix-text')
  async fixText(@Body() body: { text: string }) {
    return this.aiService.fixText(body.text);
  }

  @Post('describe-image')
  async describeImage(@Body() body: { base64: string; mimeType: string }) {
    return this.aiService.describeImageFromBase64(body.base64, body.mimeType);
  }

  @Post('chat')
  async chat(@Body() body: { message: string }) {
    const reply = await this.aiService.chat(body.message);
    return { reply };
  }
}
