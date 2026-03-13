import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BlockService } from './block.service';
import { BlockController } from './block.controller';

@Module({
  controllers: [BlockController],
  providers: [PrismaService, BlockService],
  exports: [BlockService],
})
export class BlockModule {}

