import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { FirebaseAuthGuard } from './firebase/firebase-auth.guard';

interface AuthRequest extends Request {
  user: { uid: string; email?: string };
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthRequest) {
    return {
      message: 'This is a protected route',
      user: req.user,
    };
  }
}
