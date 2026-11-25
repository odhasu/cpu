import { icon, modelUrl, outputIcon, providerMark } from './ui.js';

export function mountChrome(root, { urls, modelCatalog, listen }) {
  if (/Mac|iPhone|iPad/.test(navigator.platform)) {
    root.querySelector('.site-search-control kbd').innerHTML = `${icon('command')} K`;
  }

  const menuToggle = root.querySelector('.menu-toggle');
  const mobileNavigation = root.querySelector('#mobile-navigation');
  const closeMenu = () => {
    mobileNavigation.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    menuToggle.innerHTML = icon('menu');
  };

  listen(menuToggle, 'click', () => {
    if (!mobileNavigation.hidden) {
      closeMenu();
      return;
    }
    mobileNavigation.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation');
    menuToggle.innerHTML = icon('close');
  });

  listen(mobileNavigation, 'click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  listen(window.matchMedia('(max-width: 720px)'), 'change', (event) => {
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

  listen(searchButton, 'click', openSearch);
  listen(dialog, 'close', () => searchButton.setAttribute('aria-expanded', 'false'));
  listen(dialog.querySelector('.search-close'), 'click', () => dialog.close());
  listen(dialog, 'click', (event) => {
    if (event.target === dialog || event.target.closest('a')) dialog.close();
  });
  listen(input, 'input', updateSearch);

  listen(dialog, 'keydown', (event) => {
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

  listen(document, 'keydown', (event) => {
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
