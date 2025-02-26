import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async onModuleInit() {
    await this.createIndexIfNotExists();
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

  async indexDocument(index: string, id: string, data: any) {
    return await this.elasticsearchService.index({
      index,
      id,
      body: {
        ...data,
        timestamp: new Date(), // Thêm thời gian để ranking
      },
    });
  }

  async searchDocument(index: string, query: string) {
    const result = await this.elasticsearchService.search({
      index,
      body: {
        query: {
          multi_match: {
            query: query,
            fields: ['message^3'], // Tăng trọng số cho "message"
            fuzziness: 'AUTO', // Cho phép lỗi chính tả
          },
        },
        sort: [
          {
            timestamp: { order: 'desc' }, // Ưu tiên kết quả mới nhất
          },
        ],
      },
    });

    return result.hits.hits;
  }
}
