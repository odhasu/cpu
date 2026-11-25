import { categories, formatRate, modelCatalog } from './data/models.js';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function sitePath(path) {
  return `${basePath}${path}`;
}

export const siteContext = {
  urls: {
    home: sitePath('/'),
    models: sitePath('/models/'),
    pricing: sitePath('/pricing/'),
    gpu: sitePath('/gpu/'),
    docs: sitePath('/docs/'),
    quickstart: sitePath('/docs/#quickstart'),
    playground: sitePath('/docs/#playground'),
    github: 'https://github.com/odhasu/cpu',
  },
  categories,
  formatRate,
  modelCatalog,
};
