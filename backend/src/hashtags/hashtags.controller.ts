import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { HashtagsService } from './hashtags.service';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';

interface AuthRequest extends Request {
  user: {
    uid: string;
  };
}

@Controller('hashtags')
@UseGuards(FirebaseAuthGuard)
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @Get('search')
  async search(@Query('q') query: string) {
    return this.hashtagsService.search(query);
  }

  @Get('trending')
  async trending(
    @Req() req: AuthRequest,
    @Query('limit') limit?: string,
    @Query('days') daysWindow?: string,
    @Query('scope') scope?: string,
  ) {
    const limitNum = Number.isNaN(parseInt(limit || '', 10))
      ? 10
      : parseInt(limit || '10', 10);
    const daysNum = Number.isNaN(parseInt(daysWindow || '', 10))
      ? 1
      : parseInt(daysWindow || '1', 10);

    const normalizedScope =
      scope === 'country'
        ? 'country'
        : 'global';

    return this.hashtagsService.trending(
      limitNum,
      daysNum,
      normalizedScope,
      req.user.uid,
    );
  }
}
