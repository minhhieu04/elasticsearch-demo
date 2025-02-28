import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MeiliSearchService } from './meilisearch.service';

@Controller('meilisearch')
export class MeiliSearchController {
  constructor(private readonly meiliSearchService: MeiliSearchService) {}

  @Post('index')
  async addData(@Body() body: { id: string; message: string }) {
    return this.meiliSearchService.addDocument(body.id, body.message);
  }

  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    return this.meiliSearchService.normalSearch(
      query,
      Number(page),
      Number(pageSize),
    );
  }

  @Get('full-text-search')
  async fullTextSearch(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    return this.meiliSearchService.fullTextSearch(
      query,
      Number(page),
      Number(pageSize),
    );
  }

  @Get('fuzzy-search')
  async fuzzySearch(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    return this.meiliSearchService.fuzzySearch(
      query,
      Number(page),
      Number(pageSize),
    );
  }

  @Get('ranking-search')
  async rankingSearch(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    return this.meiliSearchService.rankingSearch(
      query,
      Number(page),
      Number(pageSize),
    );
  }
}
