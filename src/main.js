import './styles.css';
import { categories, formatRate, modelCatalog } from './data/models.js';

const page = document.body.dataset.page;
const prefix = page === 'home' ? './' : '../';
const urls = {
  home: prefix,
  models: `${prefix}models/`,
  pricing: `${prefix}pricing/`,
  gpu: `${prefix}gpu/`,
  docs: `${prefix}docs/`,
  playground: `${prefix}docs/#playground`,
  github: 'https://github.com/odhasu/cpu',
};
const pages = import.meta.glob('./pages/*.js');
const modulePath = pages[`./pages/${page}.js`];

if (modulePath) {
  const { render, mount } = await modulePath();
  const root = document.querySelector('#app');
  const context = { urls, categories, formatRate, modelCatalog };
  root.innerHTML = render(context);
  mount?.(root, context);
}
