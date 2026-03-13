import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MatchesService {
  private API_URL = 'https://v3.football.api-sports.io/fixtures';
  private API_KEY = process.env.API_FOOTBALL;

  async getMatches(leagueId?: number) {
    try {
      const response = await axios.get(this.API_URL, {
        headers: {
          'x-apisports-key': this.API_KEY,
        },
        params: {
          live: 'all',
          ...(leagueId ? { league: leagueId } : {}),
        },
      });

      return response.data;
    } catch (error: any) {
      // Surface some context in logs to make debugging easier
      // without leaking raw error details to the client.

      console.error(
        'Error fetching live football fixtures',
        error?.response?.status,
        error?.response?.data,
      );

      throw new HttpException(
        'Failed to fetch matches',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMatchById(id: string) {
    try {
      const response = await axios.get(this.API_URL, {
        headers: {
          'x-apisports-key': this.API_KEY,
        },
        params: {
          id,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error(
        'Error fetching football fixture by id',
        id,
        error?.response?.status,
        error?.response?.data,
      );

      throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
    }
  }
}
