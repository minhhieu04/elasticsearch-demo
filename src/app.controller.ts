import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('index')
  async indexData(@Body() body: { id: string; message: string }) {
    return this.appService.indexDocument('messages', body.id, {
      message: body.message,
    });
  }

  @Get('search/:query')
  async search(@Param('query') query: string) {
    return this.appService.searchDocument('messages', query);
  }
}
