import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';
import { SearchHistoryService } from './search-history.service';

interface AuthRequest extends Request {
  user: { uid: string };
}

@Controller('search-history')
@UseGuards(FirebaseAuthGuard)
export class SearchHistoryController {
  constructor(private readonly searchHistoryService: SearchHistoryService) {}

  @Get()
  async getMyHistory(@Req() req: AuthRequest) {
    return this.searchHistoryService.getHistoryForUser(req.user.uid);
  }

  @Post()
  async addEntry(
    @Req() req: AuthRequest,
    @Body()
    body: {
      query: string;
      targetId?: string | null;
      type: 'user' | 'hashtag' | 'post';
    },
  ) {
    const trimmedQuery = body.query?.trim();
    if (!trimmedQuery) {
      return { success: false };
    }

    await this.searchHistoryService.addEntry({
      userId: req.user.uid,
      query: trimmedQuery,
      targetId: body.targetId ?? null,
      type: body.type,
    });

    return { success: true };
  }

  @Delete(':id')
  async deleteEntry(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.searchHistoryService.deleteEntry(req.user.uid, id);
  }

  @Delete()
  async clearMyHistory(@Req() req: AuthRequest) {
    return this.searchHistoryService.clearHistory(req.user.uid);
  }
}
