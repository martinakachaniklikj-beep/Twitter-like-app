import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ConversationService } from './conversation.service';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';

interface AuthRequest extends Request {
  user: { uid: string; email?: string };
}

@Controller('conversations')
@UseGuards(FirebaseAuthGuard)
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get()
  list(@Req() req: AuthRequest) {
    return this.conversationService.listForUser(req.user.uid);
  }

  @Get(':id')
  findOne(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.conversationService.findOne(id, req.user.uid);
  }

  @Post('direct')
  getOrCreateDirect(@Req() req: AuthRequest, @Body('otherUserId') otherUserId: string) {
    return this.conversationService.getOrCreateDirect(req.user.uid, otherUserId);
  }
}
