import './styles.css';
import { categories, formatRate, modelCatalog } from './data/models.js';
import { footer, header, mountChrome, searchDialog } from './chrome.js';

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
const root = document.querySelector('#app');
const pageModule = await modulePath?.();
const context = { urls, categories, formatRate, modelCatalog };

root.innerHTML = `${header(page, context)}
  <main id="main-content" tabindex="-1">${pageModule?.render(context) ?? ''}</main>
  ${footer(context)}${searchDialog()}`;

mountChrome(root, context);
pageModule?.mount?.(root.querySelector('main'), context);

if (window.location.hash) {
  requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView());
}
