// Example: src/sanityClient.ts
import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId: 'ahmigjpv', // from sanity.config.ts
  dataset: 'production', // from sanity.config.ts
  apiVersion: '2023-01-01', // use today's date or latest
  useCdn: true,
});