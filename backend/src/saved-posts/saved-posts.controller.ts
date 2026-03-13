import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Req,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { Request } from 'express';
import { SavedPostsService } from './saved-posts.service';
import { FirebaseAuthGuard } from '../firebase/firebase-auth.guard';

interface AuthRequest extends Request {
  user: { uid: string; email?: string };
}

@Controller('saved-posts')
@UseGuards(FirebaseAuthGuard)
export class SavedPostsController {
  constructor(private readonly savedPostsService: SavedPostsService) {}

  @Post(':postId')
  toggleSavedPost(
    @Req() req: AuthRequest,
    @Param('postId') postId: string,
    @Body('collectionName') collectionName?: string,
  ) {
    return this.savedPostsService.toggleSavedPost(
      req.user.uid,
      postId,
      collectionName,
    );
  }

  @Get('me')
  getMySavedPosts(@Req() req: AuthRequest) {
    return this.savedPostsService.getSavedPostsForUser(req.user.uid);
  }

  @Get('collections')
  getMyCollections(@Req() req: AuthRequest) {
    return this.savedPostsService.getCollectionsForUser(req.user.uid);
  }

  @Patch('collections/:id')
  renameCollection(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body('name') name: string,
  ) {
    return this.savedPostsService.renameCollection(req.user.uid, id, name);
  }

  @Delete('collections/:id')
  deleteCollection(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.savedPostsService.deleteCollection(req.user.uid, id);
  }
}
