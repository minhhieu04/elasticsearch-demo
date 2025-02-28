import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticsearchServiceCustom implements OnModuleInit {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    await this.createIndexIfNotExists();
  }

  private async search(
    query: string,
    page: number,
    pageSize: number,
    type: 'match' | 'multi_match',
    fuzziness?: string,
    ranking?: boolean,
  ) {
    const body: any = {
      from: (page - 1) * pageSize,
      size: pageSize,
      query: {
        [type]: {
          query,
          fields: ['message^3'],
          fuzziness: fuzziness || undefined,
        },
      },
    };

    if (ranking) {
      body.sort = [{ timestamp: { order: 'desc' } }];
    }

    const result = await this.elasticsearchService.search({
      index: 'messages',
      body,
    });

    return {
      total: result.hits.total,
      hits: result.hits,
    };
  }

  async createIndexIfNotExists() {
    const index = 'messages';

    // Kiểm tra index đã tồn tại chưa
    const exists = await this.elasticsearchService.indices.exists({ index });

    if (!exists) {
      await this.elasticsearchService.indices.create({
        index,
        body: {
          settings: {
            analysis: {
              analyzer: {
                custom_analyzer: {
                  // Khai báo custom analyzer giúp Elasticsearch phân tích dữ liệu tốt hơn
                  type: 'standard',
                  stopwords: '_english_', // bỏ qua các từ vô nghĩa như "the", "a", "an" giúp cải thiện full-text search.
                },
              },
            },
          },
          mappings: {
            properties: {
              message: {
                // Kiểu text để hỗ trợ full-text search
                type: 'text',
                analyzer: 'custom_analyzer', // Dùng custom analyzer để tối ưu full-text search
              },
              timestamp: {
                type: 'date', // Lưu thời gian index để ranking
              },
            },
          },
        },
      });

      console.log(`Index ${index} created!`);
    }
  }

  async indexDocument(id: string, message: string) {
    return await this.elasticsearchService.index({
      index: 'messages',
      id,
      body: { message, timestamp: new Date() },
    });
  }

  async normalSearch(query: string, page: number, pageSize: number) {
    return this.search(query, page, pageSize, 'match');
  }

  async fullTextSearch(query: string, page: number, pageSize: number) {
    return this.search(query, page, pageSize, 'multi_match');
  }

  async fuzzySearch(query: string, page: number, pageSize: number) {
    return this.search(query, page, pageSize, 'multi_match', 'AUTO');
  }

  async rankingSearch(query: string, page: number, pageSize: number) {
    return this.search(query, page, pageSize, 'multi_match', 'AUTO', true);
  }
}
