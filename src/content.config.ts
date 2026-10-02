import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Lesson notes synced from ../solid (see scripts/sync-learning.mjs).
// id = path without extension, lowercased: "03-lsp/simple/readme"
const solid = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './learning/solid',
    generateId: ({ entry }) => entry.replace(/\.md$/i, '').toLowerCase(),
  }),
});

export const collections = { solid };
