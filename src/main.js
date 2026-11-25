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
  quickstart: `${prefix}docs/#quickstart`,
  playground: `${prefix}docs/#playground`,
  github: 'https://github.com/odhasu/cpu',
};
const pages = import.meta.glob('./pages/*.js');
const modulePath = pages[`./pages/${page}.js`];
const root = document.body;
const pageModule = await modulePath?.();
const context = { urls, categories, formatRate, modelCatalog };

const layout = document.createElement('template');
layout.innerHTML = `${header(page, context)}
  <main id="main-content" tabindex="-1">${pageModule?.render(context) ?? ''}</main>
  ${footer(context, page)}${searchDialog()}`;
root.querySelector('#app').replaceWith(layout.content);

mountChrome(root, context);
pageModule?.mount?.(root.querySelector('main'), context);

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove('awaiting-reveal');
      observer.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -40px 0px' });

  for (const item of root.querySelectorAll('[data-reveal]')) {
    if (item.getBoundingClientRect().top < window.innerHeight) continue;
    item.classList.add('awaiting-reveal');
    observer.observe(item);
  }
}

if (window.location.hash) {
  requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView());
}
