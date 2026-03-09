import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { FirebaseService } from './firebase.service';
  
  @Injectable()
  export class FirebaseAuthGuard implements CanActivate {
    constructor(private firebaseService: FirebaseService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException('No token provided');
      }
  
      const token = authHeader.replace('Bearer ', '');


  
      try {
        const decoded = await this.firebaseService.verifyToken(token);
        request.user = decoded;
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid Firebase token');
      }
    }
  }
  