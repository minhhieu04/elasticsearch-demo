import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ElasticsearchServiceCustom } from './elasticsearch.service';

@Controller('elasticsearch')
export class ElasticsearchController {
  constructor(
    private readonly elasticsearchService: ElasticsearchServiceCustom,
  ) {}

  @Post('index')
  async indexData(@Body() body: { id: string; message: string }) {
    return this.elasticsearchService.indexDocument(body.id, body.message);
  }

  // Search thường (exact match)
  @Get('search')
  async search(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    return this.elasticsearchService.normalSearch(
      query,
      Number(page),
      Number(pageSize),
    );
  }

  // Full-text search
  @Get('full-text-search')
  async fullTextSearch(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    return this.elasticsearchService.fullTextSearch(
      query,
      Number(page),
      Number(pageSize),
    );
  }

  // Fuzzy search
  @Get('fuzzy-search')
  async fuzzySearch(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    return this.elasticsearchService.fuzzySearch(
      query,
      Number(page),
      Number(pageSize),
    );
  }

  // Ranking search
  @Get('ranking-search')
  async rankingSearch(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    return this.elasticsearchService.rankingSearch(
      query,
      Number(page),
      Number(pageSize),
    );
  }
}
