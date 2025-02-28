import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';

@Injectable()
export class MeiliSearchService implements OnModuleInit {
  private readonly index;

  constructor(
    @Inject('MEILI_CLIENT') private readonly meiliClient: MeiliSearch,
  ) {
    this.index = this.meiliClient.index('messages');
  }

  async onModuleInit() {
    await this.createIndexIfNotExists();
  }

  private async createIndexIfNotExists() {
    try {
      await this.meiliClient.getIndex('messages');
    } catch (error) {
      if (error.code === 'index_not_found') {
        console.log(`⚡ Creating MeiliSearch index: messages`);
        await this.meiliClient.createIndex('messages', { primaryKey: 'id' });

        // Cập nhật cài đặt
        await this.index.updateSettings({
          sortableAttributes: ['timestamp'],
          searchableAttributes: ['message'],
          filterableAttributes: ['message'],
          typoTolerance: {
            enabled: true,
            minWordSizeForTypos: { oneTypo: 5, twoTypos: 9 },
          },
        });

        console.log(`✅ Index "messages" created with settings`);
      } else {
        console.error('❌ Error initializing MeiliSearch:', error);
      }
    }
  }

  async addDocument(id: string, message: string) {
    return await this.index.addDocuments([
      { id, message, timestamp: new Date() },
    ]);
  }

  async normalSearch(query: string, page: number, pageSize: number) {
    return this.search(query, page, pageSize);
  }

  async fullTextSearch(query: string, page: number, pageSize: number) {
    return this.search(query, page, pageSize);
  }

  async fuzzySearch(query: string, page: number, pageSize: number) {
    return this.search(query, page, pageSize);
  }

  async rankingSearch(query: string, page: number, pageSize: number) {
    return this.search(query, page, pageSize, { sort: ['timestamp:desc'] });
  }

  private async search(
    query: string,
    page: number,
    pageSize: number,
    options: any = {},
  ) {
    const result = await this.index.search(query, {
      limit: pageSize,
      offset: (page - 1) * pageSize,
      ...options,
    });

    return {
      total: result.estimatedTotalHits,
      hits: result.hits,
    };
  }
}
