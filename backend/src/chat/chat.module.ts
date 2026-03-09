import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { FirebaseModule } from '../firebase/firebase.module';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [FirebaseModule, MessageModule],
  providers: [ChatGateway],
})
export class ChatModule {}
