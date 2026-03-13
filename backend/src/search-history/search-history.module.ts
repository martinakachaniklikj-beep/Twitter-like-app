import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchHistoryService } from './search-history.service';
import { SearchHistoryController } from './search-history.controller';

@Module({
  controllers: [SearchHistoryController],
  providers: [SearchHistoryService, PrismaService],
})
export class SearchHistoryModule {}

