import { MeiliSearch } from 'meilisearch';

const meiliClient = new MeiliSearch({
  host: 'http://localhost:7700',
  apiKey: '',
});

async function updateIndexSettings() {
  await meiliClient.index('messages').updateSettings({
    sortableAttributes: ['timestamp'],
  });

  console.log('✅ Updated sortableAttributes for messages index');
}

updateIndexSettings().catch(console.error);
