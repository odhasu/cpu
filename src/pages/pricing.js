import './pricing.css';

const ALL = 'All';
const DEFAULT_USAGE = { units: 10, input: 1, output: 0.25 };
const quantityLabels = {
  second: 'Seconds',
  image: 'Images',
  generation: 'Generations',
  megapixel: 'Megapixels',
  '1K characters': 'Thousands of characters',
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderRates(model, formatRate) {
  const rate = escapeHtml(formatRate(model.rate));

  if (model.kind === 'Text') {
    return `
      <span class="pricing-token-rate"><span>Input</span> <strong>${rate}</strong></span>
      <span class="pricing-token-rate"><span>Output</span> <strong>${escapeHtml(formatRate(model.outputRate))}</strong></span>
      <span class="pricing-rate-unit">per 1M tokens</span>`;
  }

  return `<strong>${rate}</strong><span class="pricing-rate-unit">per ${escapeHtml(model.unit)}</span>`;
}

function renderRows(models, { urls, formatRate }) {
  return models.map((model) => `
    <tr>
      <th scope="row">
        <a class="pricing-model" href="${escapeHtml(urls.models)}?model=${encodeURIComponent(model.id)}">
          ${escapeHtml(model.name)}&nbsp;<span aria-hidden="true">↗</span>
        </a>
        <span class="pricing-model-meta">${escapeHtml(model.provider)} · ${escapeHtml(model.kind)}</span>
      </th>
      <td class="pricing-table-rate">${renderRates(model, formatRate)}</td>
      <td class="pricing-table-markup">0%</td>
    </tr>`).join('');
}

function modelCount(count) {
  return `${count} ${count === 1 ? 'model' : 'models'}`;
}

function estimateCost(model, { units, input, output }) {
  return model.kind === 'Text' ? input * model.rate + output * model.outputRate : units * model.rate;
}

function estimatorRate(model, formatRate) {
  if (model.kind === 'Text') {
    return `${formatRate(model.rate)} input + ${formatRate(model.outputRate)} output per 1M tokens each`;
  }
  return `${formatRate(model.rate)} per ${model.unit}`;
}

export function render(context) {
  const { categories, formatRate, modelCatalog, urls } = context;
  const [initialModel] = modelCatalog;
  const startsWithText = initialModel?.kind === 'Text';

  return `
    <div class="pricing-page">
      <section class="pricing-hero shell" aria-labelledby="pricing-title">
        <div>
          <h1 id="pricing-title">Provider rates.</h1>
          <p class="pricing-hero-policy">0% platform fees. 0% markup.</p>
          <p class="pricing-hero-lede">Compare sample rates across text, image, video and audio models. Estimate a request using the same rates in the table.</p>
          <div class="pricing-hero-actions">
            <a class="button button--primary" href="#pricing-catalog">Compare model rates <span aria-hidden="true">↓</span></a>
            <a class="button" href="${escapeHtml(urls.docs)}">API docs <span aria-hidden="true">↗</span></a>
          </div>
        </div>

        <div class="pricing-ledger">
          <p class="pricing-ledger-title">Cost breakdown</p>
          <dl>
            <div><dt>Model usage</dt><dd>Provider rate</dd></div>
            <div><dt>Platform fees</dt><dd>0%</dd></div>
            <div><dt>Markup</dt><dd>0%</dd></div>
          </dl>
          <a href="#pricing-estimator">Estimate your usage <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section class="pricing-catalog shell" id="pricing-catalog" aria-labelledby="pricing-catalog-title">
        <div class="pricing-catalog-heading">
          <h2 id="pricing-catalog-title">Model rates</h2>
          <p>Sample provider rates in USD.</p>
        </div>

        <div class="pricing-controls">
          <div class="pricing-filters" role="group" aria-label="Model category">
            ${[ALL, ...categories].map((category) => `
              <button type="button" data-pricing-category="${escapeHtml(category)}" aria-pressed="${category === ALL}">${escapeHtml(category)}</button>`).join('')}
          </div>
          <label class="pricing-search">
            <span class="sr-only">Search models or providers</span>
            <input id="pricing-search" type="search" placeholder="Search models or providers" autocomplete="off">
          </label>
        </div>

        <p class="pricing-count" role="status">${modelCount(modelCatalog.length)}</p>
        <div class="pricing-table-wrap">
          <table class="pricing-table"${modelCatalog.length ? '' : ' hidden'}>
            <caption class="sr-only">Sample model rates in USD</caption>
            <colgroup><col class="pricing-col-model"><col class="pricing-col-rate"><col class="pricing-col-markup"></colgroup>
            <thead>
              <tr>
                <th scope="col">Model</th>
                <th scope="col" class="pricing-table-rate">Sample rate</th>
                <th scope="col" class="pricing-table-markup">Markup</th>
              </tr>
            </thead>
            <tbody id="pricing-rows">${renderRows(modelCatalog, context)}</tbody>
          </table>
          <div class="pricing-empty"${modelCatalog.length ? ' hidden' : ''}>
            <h3>No matching models</h3>
            <p>Try another search or clear the category filter.</p>
            <button class="button" id="pricing-reset" type="button">Reset filters</button>
          </div>
        </div>
      </section>

      ${initialModel ? `
      <section class="pricing-estimator shell" id="pricing-estimator" aria-labelledby="pricing-estimator-title">
        <div class="pricing-estimator-intro">
          <h2 id="pricing-estimator-title">Cost estimator</h2>
          <p>Choose a model and enter your expected usage. The estimate uses sample provider rates in USD.</p>
          <a href="${escapeHtml(urls.gpu)}">View GPU pricing <span aria-hidden="true">↗</span></a>
        </div>

        <form class="pricing-calculator" data-reveal>
          <div class="pricing-calculator-fields">
            <label class="pricing-model-field" for="pricing-estimate-model">
              Model
              <select id="pricing-estimate-model" name="model">
                ${modelCatalog.map((model) => `<option value="${escapeHtml(model.id)}">${escapeHtml(model.name)} · ${escapeHtml(model.kind)}</option>`).join('')}
              </select>
            </label>
            <label for="pricing-estimate-units"${startsWithText ? ' hidden' : ''}>
              <span id="pricing-quantity-label">${escapeHtml(quantityLabels[initialModel.unit] ?? 'Units')}</span>
              <input id="pricing-estimate-units" name="units" type="number" min="0" step="any" value="${DEFAULT_USAGE.units}" inputmode="decimal">
            </label>
            <label for="pricing-estimate-input"${startsWithText ? '' : ' hidden'}>
              Input tokens (millions)
              <input id="pricing-estimate-input" name="input" type="number" min="0" step="any" value="${DEFAULT_USAGE.input}" inputmode="decimal">
            </label>
            <label for="pricing-estimate-output"${startsWithText ? '' : ' hidden'}>
              Output tokens (millions)
              <input id="pricing-estimate-output" name="output" type="number" min="0" step="any" value="${DEFAULT_USAGE.output}" inputmode="decimal">
            </label>
          </div>
          <div class="pricing-calculator-summary">
            <div>
              <span id="pricing-total-label">Estimated cost</span>
              <output id="pricing-total" aria-labelledby="pricing-total-label" for="pricing-estimate-model pricing-estimate-units pricing-estimate-input pricing-estimate-output">${escapeHtml(formatRate(estimateCost(initialModel, DEFAULT_USAGE)))}</output>
            </div>
            <div>
              <p id="pricing-estimate-rate">${escapeHtml(estimatorRate(initialModel, formatRate))}</p>
              <p class="pricing-estimate-markup">0% markup</p>
            </div>
          </div>
        </form>
      </section>` : ''}
    </div>`;
}

export function mount(root, context) {
  const { formatRate, modelCatalog } = context;
  const search = root.querySelector('#pricing-search');
  const filters = [...root.querySelectorAll('[data-pricing-category]')];
  const rows = root.querySelector('#pricing-rows');
  const table = root.querySelector('.pricing-table');
  const count = root.querySelector('.pricing-count');
  const empty = root.querySelector('.pricing-empty');
  let category = ALL;

  function filterModels() {
    const terms = search.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matches = modelCatalog.filter((model) => {
      const searchable = [model.id, model.name, model.provider, model.kind, model.detail].join(' ').toLowerCase();
      return (category === ALL || model.kind === category) && terms.every((term) => searchable.includes(term));
    });

    rows.innerHTML = renderRows(matches, context);
    count.textContent = modelCount(matches.length);
    table.hidden = matches.length === 0;
    empty.hidden = matches.length > 0;
  }

  function setCategory(nextCategory) {
    category = nextCategory;
    for (const button of filters) {
      button.setAttribute('aria-pressed', String(button.dataset.pricingCategory === category));
    }
    filterModels();
  }

  search.addEventListener('input', filterModels);
  for (const button of filters) {
    button.addEventListener('click', () => setCategory(button.dataset.pricingCategory));
  }
  root.querySelector('#pricing-reset').addEventListener('click', () => {
    search.value = '';
    setCategory(ALL);
    search.focus();
  });
  if (search.value) filterModels();

  const form = root.querySelector('.pricing-calculator');
  if (!form) return;

  const modelSelect = form.elements.model;
  const units = form.elements.units;
  const input = form.elements.input;
  const output = form.elements.output;
  const rate = form.querySelector('#pricing-estimate-rate');
  const total = form.querySelector('#pricing-total');
  const quantityLabel = form.querySelector('#pricing-quantity-label');
  let model = modelCatalog[0];

  function updateEstimate() {
    const fields = model.kind === 'Text' ? [input, output] : [units];
    if (fields.some((field) => !field.validity.valid)) {
      total.value = 'Enter a valid quantity';
      return;
    }
    const estimate = estimateCost(model, {
      units: units.valueAsNumber || 0,
      input: input.valueAsNumber || 0,
      output: output.valueAsNumber || 0,
    });
    total.value = Number.isFinite(estimate) ? formatRate(estimate) : 'Quantity is too large';
  }

  function selectModel() {
    model = modelCatalog.find(({ id }) => id === modelSelect.value) ?? modelCatalog[0];
    const isText = model.kind === 'Text';
    for (const field of [units, input, output]) {
      field.disabled = field === units ? isText : !isText;
      field.closest('label').hidden = field.disabled;
    }
    quantityLabel.textContent = quantityLabels[model.unit] ?? 'Units';
    rate.textContent = estimatorRate(model, formatRate);
    updateEstimate();
  }

  form.addEventListener('submit', (event) => event.preventDefault());
  modelSelect.addEventListener('change', selectModel);
  for (const field of [units, input, output]) {
    field.addEventListener('input', updateEstimate);
  }
  selectModel();
}
