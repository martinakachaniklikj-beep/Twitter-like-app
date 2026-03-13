import { Module } from '@nestjs/common';
import { MatchesController } from './match.controller';
import { MatchesService } from './match.services';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class MatchesModule {}
