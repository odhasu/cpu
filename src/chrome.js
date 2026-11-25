import brandMark from './assets/blinkrouter-mark.png';
import { icon, modelUrl, outputIcon, providerMark } from './ui.js';

const nav = [
  ['models', 'Models'],
  ['pricing', 'Pricing'],
  ['gpu', 'GPU Cloud'],
  ['docs', 'Docs'],
];

function navLinks(page, urls) {
  return nav.map(([key, label]) => (
    `<a href="${urls[key]}"${page === key ? ' aria-current="page"' : ''}>${label}</a>`
  )).join('');
}

function brand(urls) {
  return `<a class="site-brand" href="${urls.home}" aria-label="Blinkrouter home"><img class="brand-mark" src="${brandMark}" alt=""><span>Blinkrouter</span></a>`;
}

export function header(page, { urls }) {
  const appleKeyboard = /Mac|iPhone|iPad/.test(navigator.platform);
  return `<header class="site-header nav">
      <a class="skip-link" href="#main-content">Skip to content</a>
      <div class="site-header-inner shell wrap">
        <div class="site-header-links">
          ${brand(urls)}
          <nav class="site-nav" aria-label="Main navigation">${navLinks(page, urls)}</nav>
        </div>
        <div class="site-tools">
          <div class="site-search-control">
            <button class="site-search" type="button" data-search aria-label="Search Blinkrouter" aria-keyshortcuts="Meta+K Control+K" aria-haspopup="dialog" aria-expanded="false">
              ${icon('search')} <span>Search</span>
            </button>
            <kbd aria-hidden="true">${appleKeyboard ? icon('command') : 'Ctrl'} K</kbd>
          </div>
          <a class="button header-playground" href="${urls.playground}">Playground ${icon('upRight')}</a>
          <button type="button" class="menu-toggle button" aria-controls="mobile-navigation" aria-expanded="false" aria-label="Open navigation">${icon('menu')}</button>
        </div>
      </div>
      <nav class="mobile-navigation shell" id="mobile-navigation" aria-label="Mobile navigation" hidden>
        ${navLinks(page, urls)}
        <a href="${urls.playground}">Playground ${icon('upRight')}</a>
      </nav>
    </header>`;
}

export function footer({ urls }, page) {
  return `<footer class="site-footer closing">
    <div class="shell wrap">
      ${page === 'home' ? `<div class="site-footer-close">
        <h2>API playground</h2>
        <a class="button btn btn--primary button--primary" href="${urls.playground}">Try an API request ${icon('arrow')}</a>
      </div>` : ''}
      <div>
      <div class="site-footer-main">
        <div>${brand(urls)}<p>One port for AI models and cloud compute.</p></div>
        <nav class="footer-link-group" aria-label="Product"><p class="footer-group-title">Product</p>${navLinks('', urls)}</nav>
        <nav class="footer-link-group" aria-label="Developers"><p class="footer-group-title">Developers</p><a href="${urls.quickstart}">API quickstart</a><a href="${urls.playground}">API playground</a><a href="${urls.github}">${icon('github')} GitHub ${icon('upRight')}</a></nav>
      </div>
      <div class="site-footer-bottom"><span>© ${new Date().getFullYear()} Blinkrouter</span><span><i></i> Product preview</span></div>
      </div>
    </div>
  </footer>`;
}

export function searchDialog() {
  return `<dialog class="search-dialog" aria-labelledby="search-heading">
    <div class="search-dialog-input">
      ${icon('search')}
      <label for="site-search-query" id="search-heading" class="sr-only">Search models and pages</label>
      <input type="search" id="site-search-query" placeholder="Search models and pages" autocomplete="off" autofocus>
      <button type="button" class="search-close" aria-label="Close search">${icon('close')}</button>
    </div>
    <div class="search-results"></div>
  </dialog>`;
}

export function mountChrome(root, { urls, modelCatalog }) {
  const menuToggle = root.querySelector('.menu-toggle');
  const mobileNavigation = root.querySelector('#mobile-navigation');
  const closeMenu = () => {
    mobileNavigation.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.innerHTML = icon('menu');
  };

  menuToggle.addEventListener('click', () => {
    if (!mobileNavigation.hidden) {
      closeMenu();
      return;
    }
    mobileNavigation.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation');
    menuToggle.innerHTML = icon('close');
  });

  mobileNavigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  window.matchMedia('(max-width: 720px)').addEventListener('change', (event) => {
    if (!event.matches) closeMenu();
  });

  const dialog = root.querySelector('.search-dialog');
  const searchButton = root.querySelector('[data-search]');
  const input = dialog.querySelector('input');
  const results = dialog.querySelector('.search-results');
  const shortcuts = [
    ['Model catalog', urls.models, 'grid'],
    ['Provider pricing', urls.pricing, 'layers'],
    ['GPU Cloud', urls.gpu, 'cpu'],
    ['API quickstart', urls.quickstart, 'code'],
    ['API playground', urls.playground, 'terminal'],
  ];

  function updateSearch() {
    const terms = input.value.toLowerCase().trim().split(/\s+/);
    const matches = (value) => terms.every((term) => value.toLowerCase().includes(term));
    const pages = shortcuts.filter(([title]) => matches(title));
    const models = modelCatalog.filter(
      (model) => matches(`${model.name} ${model.provider} ${model.kind} ${model.id}`),
    ).slice(0, input.value.trim() ? 12 : 4);
    results.innerHTML = [
      pages.length ? `<p>Pages</p>${pages.map(([title, url, glyph]) => (
        `<a href="${url}">${icon(glyph)}<span>${title}</span>${icon('chevron')}</a>`
      )).join('')}` : '',
      models.length ? `<p>Models</p>${models.map((model) => (
        `<a href="${modelUrl(urls, model.id)}">${providerMark(model.provider)}<span>${model.name}<small>${model.provider}</small></span>${outputIcon(model.kind)}</a>`
      )).join('')}` : '',
      !(pages.length || models.length) ? '<p class="search-empty" role="status">No matches. Try a model name or provider.</p>' : '',
    ].join('');
  }

  function openSearch() {
    if (dialog.open) return;
    input.value = '';
    updateSearch();
    dialog.showModal();
    searchButton.setAttribute('aria-expanded', 'true');
    input.focus();
  }

  searchButton.addEventListener('click', openSearch);
  dialog.addEventListener('close', () => searchButton.setAttribute('aria-expanded', 'false'));
  dialog.querySelector('.search-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target.closest('a')) dialog.close();
  });
  input.addEventListener('input', updateSearch);

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      dialog.close();
      return;
    }
    const links = [...results.querySelectorAll('a')];
    if (!links.length) return;
    const index = links.indexOf(document.activeElement);
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      links[Math.min(index + 1, links.length - 1)].focus();
    } else if (event.key === 'ArrowUp' && index >= 0) {
      event.preventDefault();
      (links[index - 1] ?? input).focus();
    } else if (event.key === 'Enter' && event.target === input) {
      links[0].click();
    }
  });

  document.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openSearch();
    }
    if (event.key === 'Escape' && !event.defaultPrevented && !mobileNavigation.hidden && !dialog.open) {
      closeMenu();
      menuToggle.focus();
    }
  });
}
