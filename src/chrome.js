import brandMark from './assets/renderport-mark.png';
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
  return `<a class="site-brand" href="${urls.home}" aria-label="RenderPort home"><img class="brand-mark" src="${brandMark}" alt=""><span>RenderPort</span></a>`;
}

export function header(page, { urls }) {
  return `<a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <div class="site-header-inner shell">
        ${brand(urls)}
        <div class="site-tools">
          <button class="site-search" type="button" data-search aria-label="Search RenderPort">
            ${icon('search')} <span>Search</span><kbd>${icon('command')} K</kbd>
          </button>
          <nav class="site-nav" aria-label="Main navigation">${navLinks(page, urls)}</nav>
          <a class="button button--primary header-playground" href="${urls.playground}">Playground</a>
          <button type="button" class="menu-toggle button" aria-controls="mobile-navigation" aria-expanded="false" aria-label="Open navigation">${icon('menu')}</button>
        </div>
      </div>
      <nav class="mobile-navigation shell" id="mobile-navigation" aria-label="Mobile navigation" hidden>
        ${navLinks(page, urls)}
        <a href="${urls.playground}">Playground ${icon('upRight')}</a>
      </nav>
    </header>`;
}

export function footer({ urls }) {
  return `<footer class="site-footer">
    <div class="shell">
      <div class="site-footer-main">
        <div>${brand(urls)}<p>One port for AI models and cloud compute.</p></div>
        <div class="footer-link-group"><h2>Product</h2>${navLinks('', urls)}</div>
        <div class="footer-link-group"><h2>Developers</h2><a href="${urls.docs}">API quickstart</a><a href="${urls.playground}">API playground</a><a href="${urls.github}">${icon('github')} GitHub ${icon('upRight')}</a></div>
      </div>
      <div class="site-footer-bottom"><span>© ${new Date().getFullYear()} RenderPort</span><span><i></i> Product preview</span></div>
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

  const dialog = root.querySelector('.search-dialog');
  const input = dialog.querySelector('input');
  const results = dialog.querySelector('.search-results');
  const shortcuts = [
    ['Model catalog', urls.models, 'grid'],
    ['Provider pricing', urls.pricing, 'layers'],
    ['GPU Cloud', urls.gpu, 'cpu'],
    ['API quickstart', urls.docs, 'code'],
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
    input.focus();
  }

  root.querySelector('[data-search]').addEventListener('click', openSearch);
  dialog.querySelector('.search-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target.closest('a')) dialog.close();
  });
  input.addEventListener('input', updateSearch);

  dialog.addEventListener('keydown', (event) => {
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
    if (event.key === 'Escape' && !mobileNavigation.hidden && !dialog.open) {
      closeMenu();
      menuToggle.focus();
    }
  });
}
