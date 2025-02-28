import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticsearchServiceCustom } from './elasticsearch.service';
import { ElasticsearchController } from './elasticsearch.controller';

@Module({
  imports: [
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
    }),
  ],
  controllers: [ElasticsearchController],
  providers: [ElasticsearchServiceCustom],
  exports: [ElasticsearchServiceCustom],
})
export class ElasticsearchCustomModule {}
