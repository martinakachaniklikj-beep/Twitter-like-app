import { apiUrl } from './notificationServices';

export interface StockQuote {
  symbol: string;
  price: number | null;
  change: number | null;
  changePercent: number | null;
}

export interface StockHistoryPoint {
  date: string;
  close: number;
}

interface AlphaVantageQuote {
  'Global Quote'?: Record<string, string | undefined>;
}

function mapApiResponse(symbol: string, data: unknown): StockQuote {
  const quote = (data as AlphaVantageQuote)?.['Global Quote'] ?? {};

  const price = quote['05. price'] != null ? Number(quote['05. price']) : null;
  const change = quote['09. change'] != null ? Number(quote['09. change']) : null;

  let changePercent: number | null = null;
  const rawPercent: string | undefined = quote['10. change percent'];
  if (typeof rawPercent === 'string') {
    const numeric = rawPercent.replace('%', '').trim();
    const parsed = Number(numeric);
    changePercent = Number.isNaN(parsed) ? null : parsed;
  }

  return {
    symbol,
    price: Number.isNaN(price) ? null : price,
    change: Number.isNaN(change) ? null : change,
    changePercent,
  };
}

export const stockServices = {
  async fetchQuote(symbol: string): Promise<StockQuote | null> {
    try {
      const res = await fetch(`${apiUrl}/stocks/${encodeURIComponent(symbol)}`);
      if (!res.ok) {
        console.error('Failed to fetch stock quote', symbol, res.status);
        return null;
      }
      const data = await res.json();
      return mapApiResponse(symbol, data);
    } catch (error) {
      console.error('Error while fetching stock quote', symbol, error);
      return null;
    }
  },

  async fetchMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    const results = await Promise.all(symbols.map((symbol) => this.fetchQuote(symbol)));
    return results.filter((q): q is StockQuote => q !== null);
  },

  async fetchHistory(symbol: string, maxPoints = 30): Promise<StockHistoryPoint[]> {
    try {
      const res = await fetch(`${apiUrl}/stocks/${encodeURIComponent(symbol)}/history`);
      if (!res.ok) {
        console.error('Failed to fetch stock history', symbol, res.status);
        return [];
      }
      const data = await res.json();
      const series =
        (data as { 'Time Series (Daily)'?: Record<string, { '4. close'?: string }> })?.[
          'Time Series (Daily)'
        ] ?? {};
      const entries = Object.entries(series) as [string, { '4. close'?: string }][];

      // Newest first from API; we want chronological order and limited points
      const sorted = entries.sort(([a], [b]) => (a < b ? -1 : 1)).slice(-maxPoints);

      return sorted
        .map(([date, value]) => {
          const closeRaw = value?.['4. close'];
          const close = typeof closeRaw === 'string' ? Number(closeRaw) : NaN;
          if (Number.isNaN(close)) return null;
          return { date, close };
        })
        .filter((p): p is StockHistoryPoint => p !== null);
    } catch (error) {
      console.error('Error while fetching stock history', symbol, error);
      return [];
    }
  },
};
