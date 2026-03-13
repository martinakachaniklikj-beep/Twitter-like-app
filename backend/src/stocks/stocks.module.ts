import { Module } from '@nestjs/common'
import { StocksService } from './stock.service'
import { StocksController } from './stocks.controller'
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [HttpModule],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
