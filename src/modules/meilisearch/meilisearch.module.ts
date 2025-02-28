import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MeiliSearch } from 'meilisearch';
import { MeiliSearchService } from './meilisearch.service';
import { MeiliSearchController } from './meilisearch.controller';

@Module({
  imports: [ConfigModule],
  controllers: [MeiliSearchController],
  providers: [
    MeiliSearchService,
    {
      provide: 'MEILI_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new MeiliSearch({
          host:
            configService.get<string>('MEILI_HOST') || 'http://localhost:7700',
          apiKey: configService.get<string>('MEILI_API_KEY') || '',
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [MeiliSearchService],
})
export class MeiliSearchModule {}
