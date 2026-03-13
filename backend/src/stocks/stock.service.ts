import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name)

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getStock(symbol: string) {
    const apiKey = this.configService.get<string>('ALPHAVANTAGE_API_KEY')

    if (!apiKey) {
      this.logger.error('ALPHAVANTAGE_API_KEY is missing')
      return {
        error: 'Stock data provider is not configured',
      }
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`

    try {
      const response = await firstValueFrom(this.httpService.get<any>(url))

      return response.data
    } catch (error: any) {
      const status = error?.response?.status
      const data = error?.response?.data

      this.logger.error(
        `Failed to fetch stock "${symbol}" from Alpha Vantage`,
        status ? `status=${status}` : undefined,
      )
      if (data) {
        this.logger.debug(JSON.stringify(data))
      }

      // Return a safe payload so the frontend can degrade gracefully
      return {
        error: 'Unable to fetch stock data at the moment',
        symbol,
      }
    }
  }

  async getStockHistory(symbol: string) {
    const apiKey = this.configService.get<string>('ALPHAVANTAGE_API_KEY')

    if (!apiKey) {
      this.logger.error('ALPHAVANTAGE_API_KEY is missing')
      return {
        error: 'Stock data provider is not configured',
      }
    }

    // Daily time series, compact = ~100 latest points
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}&outputsize=compact`

    try {
      const response = await firstValueFrom(this.httpService.get<any>(url))
      return response.data
    } catch (error: any) {
      const status = error?.response?.status
      const data = error?.response?.data

      this.logger.error(
        `Failed to fetch stock history "${symbol}" from Alpha Vantage`,
        status ? `status=${status}` : undefined,
      )
      if (data) {
        this.logger.debug(JSON.stringify(data))
      }

      return {
        error: 'Unable to fetch stock history at the moment',
        symbol,
      }
    }
  }
}
