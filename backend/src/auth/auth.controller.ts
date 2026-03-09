import {
  Controller,
  Post,
  Body,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Headers('authorization') authHeader: string,
    @Body('username') username: string,
  ) {
    const token = authHeader.replace('Bearer ', '');

    return this.authService.register(token, username);
  }
}
