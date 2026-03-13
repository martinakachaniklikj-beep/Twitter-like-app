'use client';

import { useMemo, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import {
//   matchServices,
//   type MatchItem,
// } from '@/services/matchServices';

function formatKickoff(dateStr: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type LocalMatch = {
  home_team: { short_code?: string; name?: string };
  away_team: { short_code?: string; name?: string };
  stats?: { home_score?: number | null; away_score?: number | null };
  match_start: string;
  status?: string;
  match_id: string | number;
};

function formatScore(match: LocalMatch) {
  const home = match.stats?.home_score;
  const away = match.stats?.away_score;
  if (home == null || away == null) return 'vs';
  return `${home} : ${away}`;
}

export function SportsSidebarCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [league, setLeague] = useState<'all' | 39 | 2 | 140 | 78>(39);

  const LEAGUES: { id: 'all' | 39 | 2 | 140 | 78; label: string; short: string }[] = [
    { id: 'all', label: 'All leagues', short: 'All' },
    { id: 39, label: 'Premier League', short: 'PL' },
    { id: 2, label: 'Champions League', short: 'UCL' },
    { id: 140, label: 'La Liga', short: 'LL' },
    { id: 78, label: 'Bundesliga', short: 'BUN' },
  ];

  // Temporarily disable live sports API calls to avoid exhausting free quota.
  // Show a small static sample instead so the UI keeps its structure.
  const matches: LocalMatch[] = [
    {
      match_id: 'sample-1',
      home_team: { short_code: 'FCB', name: 'Barcelona' },
      away_team: { short_code: 'RMA', name: 'Real Madrid' },
      stats: { home_score: 2, away_score: 1 },
      match_start: new Date().toISOString(),
      status: 'Finished',
    },
    {
      match_id: 'sample-2',
      home_team: { short_code: 'LIV', name: 'Liverpool' },
      away_team: { short_code: 'MCI', name: 'Man City' },
      stats: { home_score: 1, away_score: 1 },
      match_start: new Date().toISOString(),
      status: 'Live',
    },
  ];

  const isLoading = false;
  const isError = false;

  const filteredMatches = useMemo(() => {
    if (!matches.length) return [];

    const now = new Date();
    const oneDayMs = 24 * 60 * 60 * 1000;

    const scoredRecent = matches.filter((m) => {
      const hasScore =
        m.stats &&
        m.stats.home_score != null &&
        m.stats.away_score != null;

      const start = new Date(m.match_start);
      if (Number.isNaN(start.getTime())) return hasScore;

      const diff = Math.abs(now.getTime() - start.getTime());
      return hasScore && diff <= oneDayMs;
    });

    if (scoredRecent.length > 0) {
      return scoredRecent.slice(0, 8);
    }

    return matches.slice(0, 8);
  }, [matches]);

  const hasMatches = filteredMatches.length > 0;
  const currentIndex =
    hasMatches && activeIndex >= 0
      ? activeIndex % filteredMatches.length
      : 0;
  const currentMatch = hasMatches ? filteredMatches[currentIndex] : null;

  const goPrev = () => {
    if (!hasMatches) return;
    setActiveIndex((idx) => (idx - 1 + filteredMatches.length) % filteredMatches.length);
  };

  const goNext = () => {
    if (!hasMatches) return;
    setActiveIndex((idx) => (idx + 1) % filteredMatches.length);
  };

  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '0.95rem 1rem',
        borderRadius: '1rem',
        border: '1px solid rgba(var(--accent), 0.6)',
        background:
          'linear-gradient(135deg, rgba(var(--card), 0.75), rgba(22, 163, 74, 0.22))',
        backdropFilter: 'blur(22px)',
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
            'radial-gradient(circle at 0% 0%, rgba(var(--primary), 0.16), transparent 55%), radial-gradient(circle at 100% 100%, rgba(var(--accent), 0.18), transparent 55%)',
          opacity: 0.85,
        }}
      />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '0.45rem',
          marginBottom: '0.75rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.15rem',
          }}
        >
          <span
            style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'rgb(var(--foreground))',
            }}
          >
            Live football scores
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'rgb(var(--muted-foreground))',
            }}
          >
            {league === 'all'
              ? 'Top European leagues'
              : LEAGUES.find(l => l.id === league)?.label ?? 'Top European leagues'}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '0.3rem',
            alignItems: 'center',
            overflowX: 'auto',
            padding: '0.1rem 0',
          }}
        >
          {LEAGUES.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => {
                setLeague(l.id);
                setActiveIndex(0);
              }}
              style={{
                padding: '0.18rem 0.6rem',
                borderRadius: '999px',
                border:
                  league === l.id
                    ? '1px solid rgba(var(--primary), 0.9)'
                    : '1px solid rgba(var(--border), 0.7)',
                fontSize: '0.7rem',
                background:
                  league === l.id
                    ? 'rgba(var(--primary), 0.14)'
                    : 'rgba(var(--card), 0.95)',
                color:
                  league === l.id
                    ? 'rgb(var(--primary))'
                    : 'rgb(var(--muted-foreground))',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {l.short}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <p
          style={{
            position: 'relative',
            fontSize: '0.8rem',
            color: 'rgb(var(--muted-foreground))',
          }}
        >
          Loading matches...
        </p>
      )}

      {isError && !isLoading && (
        <p
          style={{
            position: 'relative',
            fontSize: '0.8rem',
            color: 'rgb(var(--muted-foreground))',
          }}
        >
          Couldn&apos;t load football data right now.
        </p>
      )}

      {!isLoading && !isError && !hasMatches && (
        <p
          style={{
            position: 'relative',
            fontSize: '0.8rem',
            color: 'rgb(var(--muted-foreground))',
          }}
        >
          No live matches at the moment.
        </p>
      )}

      {!isLoading && !isError && currentMatch && (
        <>
          <div
            style={{
              position: 'relative',
              marginTop: '0.4rem',
              borderRadius: '1rem',
              padding: '0.75rem 0.8rem',
              background:
                'linear-gradient(135deg, rgba(var(--background),0.98), rgba(var(--card),0.95))',
              border: '1px solid rgba(var(--border), 0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.55rem',
              minHeight: 120,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '0.2rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'rgb(var(--muted-foreground))',
                  }}
                >
                  Home
                </span>
                <span
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {currentMatch.home_team?.short_code ||
                    currentMatch.home_team?.name ||
                    'Home'}
                </span>
              </div>

              <div
                style={{
                  minWidth: 68,
                  minHeight: 52,
                  borderRadius: '0.9rem',
                  background:
                    'linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,64,175,0.9))',
                  border: '1px solid rgba(148, 163, 184, 0.7)', // keeps nice contrast in dark
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.1rem',
                }}
              >
                <span
                  style={{
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: 'white',
                  }}
                >
                  {formatScore(currentMatch)}
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'rgba(226,232,240,0.9)',
                  }}
                >
                  {currentMatch.status?.toLowerCase() === 'finished'
                    ? 'FT'
                    : currentMatch.status || ''}
                </span>
              </div>

              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '0.2rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color: 'rgb(var(--muted-foreground))',
                  }}
                >
                  Away
                </span>
                <span
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    lineHeight: 1.2,
                    textAlign: 'right',
                  }}
                >
                  {currentMatch.away_team?.short_code ||
                    currentMatch.away_team?.name ||
                    'Away'}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.72rem',
                color: 'rgb(var(--muted-foreground))',
                marginTop: '0.25rem',
              }}
            >
              <span>{formatKickoff(currentMatch.match_start)}</span>
              <span>
                Match {currentIndex + 1} of {filteredMatches.length}
              </span>
            </div>
          </div>

          {filteredMatches.length > 1 && (
            <div
              style={{
                position: 'relative',
                marginTop: '0.55rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <button
                type="button"
                onClick={goPrev}
                style={{
                  borderRadius: '999px',
                  border: '1px solid rgba(var(--border), 0.6)',
                  background: 'rgba(var(--card),0.95)',
                  color: 'rgb(var(--foreground))',
                  padding: '0.15rem 0.55rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                ‹ Prev
              </button>

              <div
                style={{
                  display: 'flex',
                  gap: '0.25rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                }}
              >
                {filteredMatches.map((match, idx) => (
                  <button
                    key={match.match_id}
                    type="button"
                    onClick={() => setActiveIndex(idx)}
                    style={{
                      width: idx === currentIndex ? 10 : 6,
                      height: 6,
                      borderRadius: '999px',
                      border: 'none',
                      background:
                        idx === currentIndex
                          ? 'rgb(var(--primary))'
                          : 'rgba(var(--muted-foreground),0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease-out',
                    }}
                    aria-label={`Go to match ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={goNext}
                style={{
                  borderRadius: '999px',
                  border: '1px solid rgba(var(--border), 0.6)',
                  background: 'rgba(var(--card),0.95)',
                  color: 'rgb(var(--foreground))',
                  padding: '0.15rem 0.55rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                Next ›
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

