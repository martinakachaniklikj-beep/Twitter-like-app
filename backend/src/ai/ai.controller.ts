import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';

@Controller('ai')
@UseGuards(FirebaseAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('suggest')
  async suggest(@Query('topic') topic: string) {
    return this.aiService.generatePostSuggestion(topic);
  }
}
