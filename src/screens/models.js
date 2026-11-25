import { icon, modelCard, outputIcon, providerMark, copyText } from '../ui.js';

export function render(context) {
  const { urls, categories, modelCatalog } = context;
  const providers = [...new Set(modelCatalog.map((model) => model.provider))].sort();
  return `<section class="catalog-shell shell">
    <div class="catalog-heading">
      <p>${icon('grid')} Model catalog</p>
      <h1>Find the right <br>model.</h1>
      <p>Compare models by provider, output and price across text, image, video and audio.</p>
    </div>
    <div class="catalog-controls">
      <div class="filter-list" aria-label="Filter by output">
        ${['All', ...categories].map((category) => `<button type="button" class="filter-button" data-kind-filter="${category}" aria-pressed="${category === 'All'}">${category === 'All' ? icon('grid') : outputIcon(category)} ${category === 'All' ? 'All models' : category}</button>`).join('')}
      </div>
      <div class="catalog-inputs">
        <label class="catalog-search">
          <span class="sr-only">Search model catalog</span>${icon('search')}
          <input class="field" type="search" data-model-query placeholder="Search models" autocomplete="off">
        </label>
        <label>
          <span class="sr-only">Provider</span>
          <select class="field" data-provider-filter>
            <option value="">All providers</option>
            ${providers.map((provider) => `<option>${provider}</option>`).join('')}
          </select>
        </label>
      </div>
    </div>
    <div class="catalog-meta"><p data-model-count role="status">${modelCatalog.length} models</p><a href="${urls.pricing}">Compare sample rates ${icon('arrow')}</a></div>
    <div class="model-grid" data-model-grid>${modelCatalog.map((model) => modelCard(model, context)).join('')}</div>
    <div class="catalog-empty" hidden>
      ${icon('search')}
      <h2>No matching models</h2>
      <p>Try a provider name or clear your filters.</p>
      <button class="button" type="button" data-clear-models>Clear filters</button>
    </div>
  </section>
  <dialog class="model-dialog" aria-labelledby="model-dialog-title">
    <button class="button button--quiet model-dialog-close" type="button" aria-label="Close model details">${icon('close')}</button>
    <div data-model-details></div>
  </dialog>`;
}

export function mount(root, context) {
  const { categories, modelCatalog, formatRate, urls, listen } = context;
  const query = root.querySelector('[data-model-query]');
  const provider = root.querySelector('[data-provider-filter]');
  const grid = root.querySelector('[data-model-grid]');
  const count = root.querySelector('[data-model-count]');
  const empty = root.querySelector('.catalog-empty');
  const filters = [...root.querySelectorAll('[data-kind-filter]')];
  const dialog = root.querySelector('.model-dialog');
  const details = dialog.querySelector('[data-model-details]');
  const params = new URLSearchParams(location.search);
  let kind = categories.find((category) => category.toLowerCase() === params.get('kind')) ?? 'All';
  query.value = params.get('q') ?? '';
  provider.value = params.get('provider') ?? '';
  if (provider.selectedIndex === -1) provider.selectedIndex = 0;

  function updateLocation(model = '') {
    const url = new URL(location.href);
    const values = { kind: kind === 'All' ? '' : kind.toLowerCase(), q: query.value.trim(), provider: provider.value, model };
    for (const [key, value] of Object.entries(values)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    history.replaceState(null, '', url);
  }

  function updateCatalog() {
    const terms = query.value.trim().toLowerCase().split(/\s+/);
    const models = modelCatalog.filter((model) => {
      const summary = `${model.name} ${model.id} ${model.provider} ${model.description}`.toLowerCase();
      return (kind === 'All' || model.kind === kind) && (!provider.value || model.provider === provider.value) &&
        terms.every((term) => summary.includes(term));
    });
    for (const filter of filters) filter.setAttribute('aria-pressed', String(filter.dataset.kindFilter === kind));
    grid.innerHTML = models.map((model) => modelCard(model, context)).join('');
    empty.hidden = models.length > 0;
    count.textContent = `${models.length} ${models.length === 1 ? 'model' : 'models'}`;
  }

  function applyFilters() {
    updateCatalog();
    updateLocation();
  }

  function showModel(id) {
    const model = modelCatalog.find((entry) => entry.id === id);
    if (!model) return;
    const pricing = model.outputRate === undefined
      ? `<div><dt>Sample rate</dt><dd>${formatRate(model.rate)} <small>/ ${model.unit}</small></dd></div>`
      : `<div><dt>Input <small>per 1M tokens</small></dt><dd>${formatRate(model.rate)}</dd></div>
        <div><dt>Output <small>per 1M tokens</small></dt><dd>${formatRate(model.outputRate)}</dd></div>`;
    const playgroundLink = `${urls.docs}?model=${encodeURIComponent(model.id)}#playground`;
    details.innerHTML = `<div class="model-dialog-label">${providerMark(model.provider)} <span>${model.provider}</span></div>
      <h2 id="model-dialog-title">${model.name}</h2>
      <p class="model-detail-meta"><span class="category-chip" data-kind="${model.kind}">${outputIcon(model.kind)} ${model.kind}</span> ${model.detail}</p>
      <p class="model-description">${model.description}</p>
      <div class="model-id"><code>${model.id}</code><button class="button button--quiet" type="button" data-copy-model aria-label="Copy model ID">${icon('copy', 'copy-idle')}${icon('check', 'copy-done')}</button></div>
      <p class="sr-only" data-model-copy-status role="status"></p>
      <dl class="model-rates">${pricing}<div><dt>Platform markup</dt><dd>0%</dd></div></dl>
      <p class="catalog-note">Sample rates in USD.</p>
      <div class="model-detail-actions"><a class="button button--primary" href="${playgroundLink}">Open playground ${icon('arrow')}</a><a class="button" href="${urls.pricing}">View pricing</a></div>`;
    listen(details.querySelector('[data-copy-model]'), 'click', async (event) => {
      const copied = await copyText(event.currentTarget, model.id);
      details.querySelector('[data-model-copy-status]').textContent = copied ? 'Model ID copied.' : 'Copy unavailable. Select the model ID to copy it.';
    });
    updateLocation(model.id);
    dialog.showModal();
  }

  for (const filter of filters) listen(filter, 'click', () => {
    kind = filter.dataset.kindFilter;
    applyFilters();
  });
  listen(query, 'input', applyFilters);
  listen(provider, 'change', applyFilters);
  listen(root.querySelector('[data-clear-models]'), 'click', () => {
    kind = 'All';
    query.value = '';
    provider.value = '';
    applyFilters();
    query.focus();
  });

  listen(grid, 'click', (event) => {
    const link = event.target.closest('a');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const modelId = new URL(link.href).searchParams.get('model');
    if (!modelId) return;
    event.preventDefault();
    showModel(modelId);
  });

  listen(dialog.querySelector('.model-dialog-close'), 'click', () => dialog.close());
  listen(dialog, 'click', (event) => { if (event.target === dialog) dialog.close(); });
  listen(dialog, 'close', () => updateLocation());

  updateCatalog();
  if (params.has('model')) showModel(params.get('model'));
}
