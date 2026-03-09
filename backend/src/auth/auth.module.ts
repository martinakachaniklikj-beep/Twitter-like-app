import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    UsersModule,
    FirebaseModule, // make sure this exists
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
