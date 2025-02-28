import { Client as ElasticClient } from '@elastic/elasticsearch';
import { MeiliSearch } from 'meilisearch';

const ELASTICSEARCH_URL = 'http://localhost:9200';
const MEILI_URL = 'http://localhost:7700';
const MEILI_API_KEY = ''; // Đặt API key nếu có

const elasticClient = new ElasticClient({ node: ELASTICSEARCH_URL });
const meiliClient = new MeiliSearch({
  host: MEILI_URL,
  apiKey: MEILI_API_KEY,
});

const INDEX_NAME = 'messages';
const SEARCH_QUERY = 'Celo';

async function searchElasticsearch() {
  const start = Date.now();
  const result = await elasticClient.search({
    index: INDEX_NAME,
    body: {
      query: {
        match: { message: SEARCH_QUERY },
      },
    },
  });
  const duration = Date.now() - start;
  console.log(`🔹 Elasticsearch search time: ${duration}ms`);
  return result.hits.hits.length;
}

async function searchMeiliSearch() {
  const start = Date.now();
  const result = await meiliClient.index(INDEX_NAME).search(SEARCH_QUERY);
  const duration = Date.now() - start;
  console.log(`🔹 MeiliSearch search time: ${duration}ms`);
  return result.hits.length;
}

async function main() {
  console.log('🚀 Benchmarking search queries...');
  const esResults = await searchElasticsearch();
  const meiliResults = await searchMeiliSearch();

  console.log(`📌 Elasticsearch found: ${esResults} results`);
  console.log(`📌 MeiliSearch found: ${meiliResults} results`);
}

main().catch(console.error);
