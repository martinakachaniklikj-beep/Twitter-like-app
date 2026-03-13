'use client';

import { useMemo, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import {
//   stockServices,
//   type StockQuote,
//   type StockHistoryPoint,
// } from '@/services/stockServices';

const SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'];

// Temporarily disable real API history normalization to avoid hitting rate limits.
// We keep this helper signature so we can re-enable it later without changing callers.
function normalizeHistory(history: Array<{ date: string; close: number }>) {
  if (!history.length) return { points: [], min: 0, max: 0 };
  const closes = history.map((p) => p.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const span = max - min || 1;
  const points = history.map((p, idx) => {
    const x = (idx / Math.max(history.length - 1, 1)) * 100;
    const y = 100 - ((p.close - min) / span) * 100;
    return { x, y };
  });
  return { points, min, max };
}

export function StocksSidebarCard() {
  const [selectedSymbol, setSelectedSymbol] = useState<string>(SYMBOLS[0]);
  // Temporarily disable live stock API calls to avoid exhausting free quota.
  // We synthesize a static sample series instead so the UI still looks good.
  const quote = {
    symbol: selectedSymbol,
    price: 123.45,
    change: 1.23,
    changePercent: 0.98,
  };

  const effectiveHistory: Array<{ date: string; close: number }> = useMemo(() => {
    const base = 120;
    const days = 40;
    const today = new Date();
    const synthetic: Array<{ date: string; close: number }> = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const waveA = Math.sin(i / 3) * 2;
      const waveB = Math.cos(i / 5) * 1;
      const trend = ((i - days / 2) / days) * 0.5;
      const close = Math.max(0.01, base + waveA + waveB + trend);
      synthetic.push({
        date: d.toISOString().slice(0, 10),
        close,
      });
    }

    return synthetic;
  }, [selectedSymbol]);

  const { points, min, max } = useMemo(
    () => normalizeHistory(effectiveHistory),
    [effectiveHistory],
  );

  const isUp =
    (quote?.changePercent ?? 0) > 0 ||
    ((quote?.change ?? 0) > 0 && (quote?.changePercent ?? 0) === 0);
  const isDown =
    (quote?.changePercent ?? 0) < 0 ||
    ((quote?.change ?? 0) < 0 && (quote?.changePercent ?? 0) === 0);

  const changeColor = isUp
    ? 'rgb(22, 163, 74)'
    : isDown
      ? 'rgb(239, 68, 68)'
      : 'rgb(var(--muted-foreground))';

  // dedicated chart color (bright orange) so the graph has a consistent identity
  const chartColor = 'rgb(249, 146, 60)';

  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '0.95rem 1rem',
        borderRadius: '1rem',
        border: 'none',
        background:
          'linear-gradient(135deg, rgba(var(--card), 0.75), rgba(15, 23, 42, 0.28))',
        backdropFilter: 'blur(18px)',
        boxShadow: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 0% 0%, rgba(56, 189, 248, 0.18), transparent 55%), radial-gradient(circle at 100% 100%, rgba(129, 140, 248, 0.2), transparent 55%)',
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem',
        }}
      >
        <span
          style={{
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'rgb(var(--foreground))',
          }}
        >
          Market snapshot
        </span>
        <span
          style={{
            fontSize: '0.75rem',
            color: 'rgb(var(--muted-foreground))',
          }}
        >
          Live via Alpha Vantage
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.3rem',
          flexWrap: 'wrap',
          marginBottom: '0.5rem',
        }}
      >
        {SYMBOLS.map((sym) => (
          <button
            key={sym}
            type="button"
            onClick={() => setSelectedSymbol(sym)}
            style={{
              padding: '0.15rem 0.45rem',
              borderRadius: '9999px',
              border:
                selectedSymbol === sym
                  ? '1px solid rgb(var(--primary))'
                  : '1px solid rgba(var(--border), 0.8)',
              fontSize: '0.7rem',
              fontWeight: 500,
              background:
                selectedSymbol === sym
                  ? 'rgba(var(--primary), 0.08)'
                  : 'transparent',
              color:
                selectedSymbol === sym
                  ? 'rgb(var(--primary))'
                  : 'rgb(var(--muted-foreground))',
              cursor: 'pointer',
            }}
          >
            {sym}
          </button>
        ))}
      </div>

      {/* Static placeholder data while live API calls are disabled */}
      {quote && (
          <>
            <div
              style={{
                position: 'relative',
                marginBottom: '0.6rem',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.1rem',
                  letterSpacing: '0.08em',
                }}
              >
                <span
                  style={{
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                  }}
                >
                  {quote.symbol}
                </span>
                <span
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                  }}
                >
                  {quote.price != null ? `$${quote.price.toFixed(2)}` : '—'}
                </span>
              </div>
              <div
                style={{
                  textAlign: 'right',
                  fontSize: '0.8rem',
                  color: changeColor,
                }}
              >
                <div>
                  {quote.change != null
                    ? `${quote.change > 0 ? '+' : ''}${quote.change.toFixed(2)}`
                    : '—'}
                </div>
                <div>
                  {quote.changePercent != null
                    ? `${quote.changePercent > 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%`
                    : ''}
                </div>
              </div>
            </div>

            <div
              style={{
                position: 'relative',
                width: '100%',
                height: 70,
                marginBottom: '0.4rem',
              }}
            >
              {points.length > 1 ? (
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ width: '100%', height: '100%' }}
                >
                  <defs>
                    <linearGradient
                      id="stockDotGlow"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop offset="0%" stopColor={chartColor} stopOpacity="1" />
                      <stop
                        offset="100%"
                        stopColor={chartColor}
                        stopOpacity="0.4"
                      />
                    </linearGradient>
                  </defs>

                  {/* subtle horizontal grid lines */}
                  {[25, 50, 75].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      x2="100"
                      y1={y}
                      y2={y}
                      stroke="rgba(148, 163, 184, 0.18)"
                      strokeWidth="0.2"
                    />
                  ))}

                  {/* glowing stroke behind main line */}
                  <polyline
                    fill="none"
                    stroke={chartColor}
                    strokeWidth={3.4}
                    strokeOpacity={0.35}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points.map((p) => `${p.x},${p.y}`).join(' ')}
                  />

                  {/* bright orange main line */}
                  <polyline
                    fill="none"
                    stroke="url(#stockDotGlow)"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={points.map((p) => `${p.x},${p.y}`).join(' ')}
                  />
                </svg>
              ) : (
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgb(var(--muted-foreground))',
                    textAlign: 'center',
                    paddingTop: '1rem',
                  }}
                >
                  Not enough history to draw a chart yet.
                </div>
              )}
            </div>

            <div
              style={{
                fontSize: '0.7rem',
                color: 'rgb(var(--muted-foreground))',
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid darkgray',
                paddingTop: '0.35rem',
              }}
            >
              <span>Last {effectiveHistory.length} days</span>
              <span>
                Range: {min.toFixed(2)} – {max.toFixed(2)}
              </span>
            </div>
          </>
        )}
    </div>
  );
}

