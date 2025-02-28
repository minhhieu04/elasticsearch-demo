import { Client as ElasticClient } from '@elastic/elasticsearch';
import { MeiliSearch } from 'meilisearch';
import { faker } from '@faker-js/faker';

const ELASTICSEARCH_URL = 'http://localhost:9200';
const MEILI_URL = 'http://localhost:7700';
const MEILI_API_KEY = ''; // Đặt API key nếu có

const elasticClient = new ElasticClient({ node: ELASTICSEARCH_URL });
const meiliClient = new MeiliSearch({
  host: MEILI_URL,
  apiKey: MEILI_API_KEY,
});

const INDEX_NAME = 'messages';

async function createElasticIndex() {
  const exists = await elasticClient.indices.exists({ index: INDEX_NAME });
  if (!exists) {
    await elasticClient.indices.create({
      index: INDEX_NAME,
      body: {
        mappings: {
          properties: {
            message: { type: 'text' },
            timestamp: { type: 'date' },
          },
        },
      },
    });
  }
}

async function seedData() {
  console.log('🚀 Generating messages...');
  const messages = [];

  for (let i = 0; i < 1_000_000; i++) {
    messages.push({
      id: i.toString(),
      message: faker.lorem.sentence(),
      timestamp: new Date().toISOString(),
    });

    if (messages.length >= 10_000) {
      console.log(`📌 Inserting batch: ${i}`);

      // Insert vào Elasticsearch
      const body = messages.flatMap((doc) => [
        { index: { _index: INDEX_NAME, _id: doc.id } },
        doc,
      ]);
      await elasticClient.bulk({ body });

      // Insert vào Meilisearch
      await meiliClient.index(INDEX_NAME).addDocuments(messages);

      messages.length = 0;
    }
  }
  console.log('✅ Data seeding completed!');
}

async function main() {
  await createElasticIndex();
  await seedData();
}

main().catch(console.error);
