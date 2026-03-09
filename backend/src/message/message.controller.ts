import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { MessageService } from './message.service';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';

interface AuthRequest extends Request {
  user: { uid: string; email?: string };
}

@Controller('conversations/:conversationId/messages')
@UseGuards(FirebaseAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  list(
    @Req() req: AuthRequest,
    @Param('conversationId') conversationId: string,
    @Query('before') before?: string,
    @Query('limit') limit?: string,
  ) {
    const limitNum = Math.min(parseInt(limit || '50', 10) || 50, 100);
    return this.messageService.findByConversation(
      conversationId,
      req.user.uid,
      before,
      limitNum,
    );
  }

  @Post()
  create(
    @Req() req: AuthRequest,
    @Param('conversationId') conversationId: string,
    @Body('content') content: string,
  ) {
    return this.messageService.create(conversationId, req.user.uid, content ?? '');
  }
}
