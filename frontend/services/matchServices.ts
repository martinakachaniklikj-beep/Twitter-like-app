import { apiUrl } from './notificationServices';

export interface TeamInfo {
  team_id?: number;
  name: string;
  short_code?: string;
  logo?: string | null;
}

export interface MatchStats {
  home_score?: number | null;
  away_score?: number | null;
  ht_score?: string | null;
  ft_score?: string | null;
}

export interface MatchItem {
  match_id: number;
  match_start: string;
  status: string;
  league_id?: number;
  season_id?: number;
  home_team: TeamInfo;
  away_team: TeamInfo;
  stats?: MatchStats | null;
}

interface SportdataRawMatch {
  match_id?: number;
  match_start?: string;
  status?: string;
  league_id?: number;
  season_id?: number;
  home_team?: Record<string, unknown>;
  away_team?: Record<string, unknown>;
  stats?: { home_score?: number; away_score?: number; ht_score?: string; ft_score?: string };
}

function normalizeFromSportdata(payload: unknown): MatchItem[] | null {
  const obj = payload as { data?: unknown[] };
  const raw = Array.isArray(obj?.data) ? obj.data : Array.isArray(payload) ? payload : null;
  if (!raw) return null;

  return (raw as SportdataRawMatch[])
    .map((m, idx): MatchItem | null => {
      const home = (m.home_team || {}) as Record<string, unknown>;
      const away = (m.away_team || {}) as Record<string, unknown>;

      const match_id = typeof m.match_id === 'number' ? m.match_id : idx;
      const match_start =
        typeof m.match_start === 'string' ? m.match_start : new Date().toISOString();

      return {
        match_id,
        match_start,
        status: String(m.status ?? ''),
        league_id: typeof m.league_id === 'number' ? m.league_id : undefined,
        season_id: typeof m.season_id === 'number' ? m.season_id : undefined,
        home_team: {
          team_id: typeof home.team_id === 'number' ? home.team_id : undefined,
          name: String(home.name ?? 'Home'),
          short_code: typeof home.short_code === 'string' ? home.short_code : undefined,
          logo: home.logo != null && typeof home.logo === 'string' ? home.logo : null,
        },
        away_team: {
          team_id: typeof away.team_id === 'number' ? away.team_id : undefined,
          name: String(away.name ?? 'Away'),
          short_code: typeof away.short_code === 'string' ? away.short_code : undefined,
          logo: away.logo != null && typeof away.logo === 'string' ? away.logo : null,
        },
        stats: {
          home_score: m.stats?.home_score ?? null,
          away_score: m.stats?.away_score ?? null,
          ht_score: m.stats?.ht_score ?? null,
          ft_score: m.stats?.ft_score ?? null,
        },
      };
    })
    .filter((x): x is MatchItem => x !== null);
}

interface ApiFootballRawMatch {
  fixture?: { id?: number; date?: string; status?: { short?: string; long?: string } };
  match_id?: number;
  match_start?: string;
  status?: string;
  league?: { id?: number; season?: number };
  teams?: { home?: Record<string, unknown>; away?: Record<string, unknown> };
  goals?: { home?: number; away?: number };
  score?: {
    fulltime?: { home?: number; away?: number };
    halftime?: { home?: number; away?: number };
  };
}

function normalizeFromApiFootball(payload: unknown): MatchItem[] | null {
  const obj = payload as { response?: unknown[] };
  const raw = Array.isArray(obj?.response) ? obj.response : null;
  if (!raw) return null;

  return (raw as ApiFootballRawMatch[])
    .map((m, idx): MatchItem | null => {
      const fixture = m.fixture || {};
      const teams = m.teams || {};
      const goals = m.goals || {};

      const homeTeam = (teams.home || {}) as Record<string, unknown>;
      const awayTeam = (teams.away || {}) as Record<string, unknown>;

      const match_id =
        typeof fixture.id === 'number'
          ? fixture.id
          : typeof m.match_id === 'number'
            ? m.match_id
            : idx;

      const match_start =
        typeof fixture.date === 'string'
          ? fixture.date
          : typeof m.match_start === 'string'
            ? m.match_start
            : new Date().toISOString();

      const status =
        (fixture.status && (fixture.status.short || fixture.status.long)) ?? m.status ?? '';

      return {
        match_id,
        match_start,
        status: String(status),
        league_id: typeof m.league?.id === 'number' ? m.league.id : undefined,
        season_id: typeof m.league?.season === 'number' ? m.league.season : undefined,
        home_team: {
          team_id: typeof homeTeam.id === 'number' ? homeTeam.id : undefined,
          name: String(homeTeam.name ?? 'Home'),
          short_code: typeof homeTeam.code === 'string' ? homeTeam.code : undefined,
          logo: homeTeam.logo != null && typeof homeTeam.logo === 'string' ? homeTeam.logo : null,
        },
        away_team: {
          team_id: typeof awayTeam.id === 'number' ? awayTeam.id : undefined,
          name: String(awayTeam.name ?? 'Away'),
          short_code: typeof awayTeam.code === 'string' ? awayTeam.code : undefined,
          logo: awayTeam.logo != null && typeof awayTeam.logo === 'string' ? awayTeam.logo : null,
        },
        stats: {
          home_score:
            typeof goals.home === 'number'
              ? goals.home
              : (m.score?.fulltime?.home ?? m.score?.halftime?.home ?? null),
          away_score:
            typeof goals.away === 'number'
              ? goals.away
              : (m.score?.fulltime?.away ?? m.score?.halftime?.away ?? null),
          ht_score:
            typeof m.score?.halftime?.home === 'number' &&
            typeof m.score?.halftime?.away === 'number'
              ? `${m.score.halftime.home}-${m.score.halftime.away}`
              : null,
          ft_score:
            typeof m.score?.fulltime?.home === 'number' &&
            typeof m.score?.fulltime?.away === 'number'
              ? `${m.score.fulltime.home}-${m.score.fulltime.away}`
              : null,
        },
      };
    })
    .filter((x): x is MatchItem => x !== null);
}

function normalizeMatches(payload: unknown): MatchItem[] {
  const fromSportdata = normalizeFromSportdata(payload);
  if (fromSportdata && fromSportdata.length > 0) return fromSportdata;

  const fromApiFootball = normalizeFromApiFootball(payload);
  if (fromApiFootball && fromApiFootball.length > 0) return fromApiFootball;

  return [];
}

export const matchServices = {
  async fetchMatches(leagueId?: number | 'all'): Promise<MatchItem[]> {
    try {
      const params = new URLSearchParams();
      if (leagueId && leagueId !== 'all') {
        params.set('league', String(leagueId));
      }

      const url = params.toString()
        ? `${apiUrl}/matches?${params.toString()}`
        : `${apiUrl}/matches`;

      const res = await fetch(url);
      if (!res.ok) {
        console.error('Failed to fetch matches', res.status);
        return [];
      }

      const json = await res.json();
      const normalized = normalizeMatches(json);
      return normalized;
    } catch (error) {
      console.error('Error while fetching matches', error);
      return [];
    }
  },
};
