import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElasticsearchCustomModule } from './modules/elasticsearch/elasticsearch.module';
import { MeiliSearchModule } from './modules/meilisearch/meilisearch.module';

@Module({
  imports: [ElasticsearchCustomModule, MeiliSearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
