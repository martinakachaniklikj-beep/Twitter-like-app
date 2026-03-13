import { Controller, Get, Param } from '@nestjs/common';
import { StocksService } from './stock.service';

@Controller('stocks')
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @Get(':symbol')
  getStock(@Param('symbol') symbol: string) {
    return this.stocksService.getStock(symbol);
  }

  @Get(':symbol/history')
  getStockHistory(@Param('symbol') symbol: string) {
    return this.stocksService.getStockHistory(symbol);
  }
}
