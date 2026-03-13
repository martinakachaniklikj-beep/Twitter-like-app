import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';
import { BlockService } from './block.service';

interface AuthRequest extends Request {
  user: {
    uid: string;
    email?: string;
  };
}

@Controller('blocks')
@UseGuards(FirebaseAuthGuard)
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Get()
  list(@Req() req: AuthRequest) {
    return this.blockService.listBlocked(req.user.uid);
  }

  @Post(':userId')
  block(@Req() req: AuthRequest, @Param('userId') userId: string) {
    return this.blockService.blockUser(req.user.uid, userId);
  }

  @Delete(':userId')
  unblock(@Req() req: AuthRequest, @Param('userId') userId: string) {
    return this.blockService.unblockUser(req.user.uid, userId);
  }
}

