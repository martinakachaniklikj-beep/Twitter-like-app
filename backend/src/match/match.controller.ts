import { Controller, Get, Param, Query } from '@nestjs/common';
import { MatchesService } from './match.services';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  getAllMatches(@Query('league') league?: string) {
    const leagueId = league ? Number(league) : undefined;
    return this.matchesService.getMatches(
      Number.isFinite(leagueId as number) ? leagueId : undefined,
    );
  }

  @Get(':id')
  getMatch(@Param('id') id: string) {
    return this.matchesService.getMatchById(id);
  }
}
