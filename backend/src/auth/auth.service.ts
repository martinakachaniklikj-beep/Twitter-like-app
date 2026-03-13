import { Injectable, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { FirebaseService } from '../firebase/firebase.service';
import { AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private firebaseService: FirebaseService,
  ) {}

  async register(token: string, username: string): Promise<AuthResponseDto> {
    const decoded = await this.firebaseService.verifyToken(token);

    const existingUsername = await this.usersService.findByUsername(username);
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const user = await this.usersService.create(
      decoded.uid,
      decoded.email!,
      username,
    );

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  }
}
