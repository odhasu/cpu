import { quickstart, quickstartLanguages, requestFor } from '../data/requests.js';
import { copyText, escapeHtml, icon, modelUrl, outputIcon, providerMark } from '../ui.js';
import { sitePath } from '../site.js';
import { mountVisual } from './home-visual.js';

const popularProviders = ['OpenAI', 'Anthropic', 'Google', 'ByteDance', 'ElevenLabs'];

function featured(models, category) {
  return models.filter((model) => category === 'All' || model.kind === category).slice(0, 6);
}

function featuredCard(model, { urls, formatRate }) {
  const input = model.kind === 'Text' ? ' input' : '';
  return `<a class="featured-model" href="${modelUrl(urls, model.id)}">
    ${providerMark(model.provider)}
    <div class="featured-model-name"><strong>${model.name}</strong><small>${model.provider}</small></div>
    <span class="featured-kind">${outputIcon(model.kind)} ${model.kind}</span>
    <div class="featured-model-rate"><span><strong>${formatRate(model.rate)}</strong> / ${model.unit}${input}</span>${icon('upRight')}</div>
  </a>`;
}

function routingPreview(routes, urls) {
  const first = routes[0];
  return `<div class="routing-preview app-frame" data-visual data-enter-media role="group" aria-label="Interactive routing preview">
    <div class="routing-preview-header">
      <span>${icon('route')} Routing preview</span>
      <span class="routing-model-name" data-routing-model>${first.name}</span>
      <button type="button" class="route-replay" data-route-replay aria-label="Replay route" title="Replay route">${icon('replay')}</button>
    </div>
    <div class="routing-stage" data-routing-stage>
      <canvas aria-hidden="true"></canvas>
      <div class="routing-source" data-routing-source aria-hidden="true">${icon('terminal')}<span>Request</span></div>
      <div class="routing-hub" data-routing-hub aria-hidden="true">
        <div class="routing-hub-chip"><img src="${sitePath('/blinkrouter-mark.png')}" width="256" height="256" alt="" fetchpriority="high"></div>
      </div>
      <div class="routing-targets" role="group" aria-label="Choose an output to preview">
        ${routes.map((model, index) => `<button type="button" class="routing-target" data-route-kind="${model.kind}" aria-pressed="${index === 0}">${outputIcon(model.kind)}<span>${model.kind}</span><i></i></button>`).join('')}
      </div>
    </div>
    <div class="routing-preview-footer">
      <span class="routing-endpoint" role="status"><b>POST</b> <code data-routing-path>/v1${requestFor(first, '').path}</code></span>
      <a class="routing-open" data-routing-link href="${urls.docs}?model=${encodeURIComponent(first.id)}#playground" aria-label="Open Text preview in playground" title="Open playground"><span>Playground</span>${icon('upRight')}</a>
    </div>
  </div>`;
}

function codeLines(language) {
  const tokens = /("(?:[^"\\]|\\.)*"|'[^']*'|\b(?:import|from|const|await|curl|print|new)\b)/g;
  return quickstart(language).split('\n').map((line, index) => {
    const highlighted = line.split(tokens).map((part, token) => {
      if (token % 2 === 0) return escapeHtml(part);
      const style = /^['"]/.test(part) ? 'syntax-string' : 'syntax-keyword';
      return `<span class="${style}">${escapeHtml(part)}</span>`;
    }).join('');
    return `<span class="code-line"><span class="line-number" aria-hidden="true">${index + 1}</span><span>${highlighted || ' '}</span></span>`;
  }).join('\n');
}

function quickstartPanel() {
  return `<div class="home-code" data-visual data-moment-block>
    <div class="home-code-toolbar">
      <div class="home-code-languages" role="group" aria-label="Code language">
        ${quickstartLanguages.map((language, index) => `<button type="button" data-home-language="${language}" aria-pressed="${index === 0}">${language}</button>`).join('')}
      </div>
      <button type="button" class="home-code-copy" data-copy-example title="Copy example" aria-label="Copy example">${icon('copy', 'copy-idle')}${icon('check', 'copy-done')}</button>
    </div>
    <pre tabindex="0" aria-label="API quickstart example"><code data-home-code>${codeLines(quickstartLanguages[0])}</code></pre>
    <p class="home-copy-status" role="status" data-home-copy-status></p>
  </div>`;
}

export function render(context) {
  const { urls, categories, modelCatalog, formatRate } = context;
  const routes = categories.map((category) => modelCatalog.find((model) => model.kind === category));
  const video = routes.find((model) => model.kind === 'Video');
  const providers = new Set(modelCatalog.map((model) => model.provider));

  return `
  <section class="hero hero--centred" id="top" data-enter aria-labelledby="home-title">
    <div class="shell wrap hero-inner">
      <div class="hero-text">
        <div class="hero-copy">
          <h1 id="home-title" data-enter-whole>One API for AI models</h1>
          <p>Route text, image, video and audio at provider rates, with 0% markup and 0% platform fees.</p>
          <div class="hero-actions">
            <a class="button btn button--primary btn--primary" href="${urls.models}">Browse models ${icon('arrow')}</a>
            <a class="button btn btn--secondary" href="${urls.quickstart}">${icon('code')} Read the quickstart</a>
          </div>
        </div>
        ${routingPreview(routes, urls)}
      </div>
      <div class="home-provider-strip">
        <span>Browse by provider</span>
        <div>${popularProviders.filter((provider) => providers.has(provider)).map((provider) => `<a href="${urls.models}?provider=${encodeURIComponent(provider)}">${providerMark(provider)}<span>${provider}</span></a>`).join('')}</div>
      </div>
    </div>
  </section>

  <section class="home-models" id="catalog" aria-labelledby="home-models-heading">
    <div class="shell wrap">
      <div class="home-section-heading">
        <div><h2 id="home-models-heading">AI model catalog</h2><p>Compare ${modelCatalog.length} models from ${providers.size} providers by output type and estimated cost in USD.</p></div>
        <a class="inline-link m-link m-link--bare" href="${urls.models}" data-catalog-link>Browse all models ${icon('arrow')}</a>
      </div>
      <div class="home-models-body app-frame" data-ui="model-catalog" data-visual>
        <div class="home-model-tabs" role="group" aria-label="Filter featured models">
          ${['All', ...categories].map((category) => `<button type="button" data-home-kind="${category}" aria-pressed="${category === 'All'}">${category === 'All' ? icon('grid') : outputIcon(category)} ${category === 'All' ? 'All models' : category}</button>`).join('')}
        </div>
        <p class="sr-only" role="status" data-featured-status></p>
        <div class="featured-grid" data-featured-models>
          ${featured(modelCatalog, 'All').map((model) => featuredCard(model, context)).join('')}
        </div>
      </div>
    </div>
  </section>

  <section class="home-build" id="developer-tools" data-moment="iris-opens" aria-labelledby="home-build-heading">
    <div class="shell wrap home-tools-inner">
      <div class="home-build-inner">
        <div class="home-build-copy">
          <h2 id="home-build-heading">API quickstart</h2>
          <p>Copy a request in cURL, JavaScript or Python. Try it in the browser or connect an OpenAI-compatible gateway.</p>
        </div>
        ${quickstartPanel()}
      </div>
      <div class="home-services">
        <article class="home-service">
          <div class="service-content">
            <span class="service-icon">${icon('layers')}</span>
            <h3>Provider pricing</h3>
            <p>Calculate request costs using catalog rates.</p>
            <a class="inline-link" href="${urls.pricing}">Compare rates ${icon('arrow')}</a>
          </div>
          <dl class="service-ledger" data-moment-block>
            <div><dt>${providerMark(video.provider)} ${video.name}</dt><dd>${formatRate(video.rate)} <small>/ sec</small></dd></div>
            <div><dt>Platform fee</dt><dd>0%</dd></div>
            <div><dt>Markup</dt><dd>0%</dd></div>
          </dl>
        </article>
        <article class="home-service">
          <div class="service-content">
            <span class="service-icon">${icon('cpu')}</span>
            <h3>Dedicated GPU Cloud</h3>
            <p>Pick hardware and estimate the cost by the hour.</p>
            <a class="inline-link" href="${urls.gpu}">Configure a GPU ${icon('arrow')}</a>
          </div>
          <div class="service-gpu" data-moment-block>
            <div class="gpu-rack" aria-hidden="true">${Array.from({ length: 3 }, () => '<span><i></i><b></b></span>').join('')}</div>
            <div><strong>GPU configurator</strong><small>Hardware · GPU count · Hours</small></div>
          </div>
        </article>
      </div>
    </div>
  </section>`;
}

export function mount(root, context) {
  const { listen, signal } = context;
  const filters = root.querySelectorAll('[data-home-kind]');
  const grid = root.querySelector('[data-featured-models]');
  const status = root.querySelector('[data-featured-status]');
  const catalogLink = root.querySelector('[data-catalog-link]');

  for (const button of filters) {
    listen(button, 'click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;
      const category = button.dataset.homeKind;
      for (const filter of filters) filter.setAttribute('aria-pressed', String(filter === button));
      const models = featured(context.modelCatalog, category);
      grid.classList.remove('featured-grid--updated');
      grid.innerHTML = models.map((model) => featuredCard(model, context)).join('');
      grid.classList.add('featured-grid--updated');
      const all = category === 'All';
      catalogLink.href = all ? context.urls.models : `${context.urls.models}?kind=${category.toLowerCase()}`;
      catalogLink.innerHTML = `Browse ${all ? 'all' : category.toLowerCase()} models ${icon('arrow')}`;
      status.textContent = `${models.length} featured ${all ? '' : category.toLowerCase() + ' '}models`;
    });
  }

  const code = root.querySelector('[data-home-code]');
  const languages = root.querySelectorAll('[data-home-language]');
  const copyButton = root.querySelector('[data-copy-example]');
  const copyStatus = root.querySelector('[data-home-copy-status]');
  let language = quickstartLanguages[0];
  let copyFeedbackTimer;

  for (const button of languages) {
    listen(button, 'click', () => {
      language = button.dataset.homeLanguage;
      for (const tab of languages) tab.setAttribute('aria-pressed', String(tab === button));
      code.innerHTML = codeLines(language);
      code.parentElement.scrollTo(0, 0);
      delete copyButton.dataset.copied;
      window.clearTimeout(copyFeedbackTimer);
      copyStatus.textContent = '';
    });
  }

  listen(copyButton, 'click', async () => {
    const copied = await copyText(copyButton, quickstart(language));
    window.clearTimeout(copyFeedbackTimer);
    copyStatus.textContent = copied ? 'Example copied.' : 'Copy unavailable. Select the code to copy it.';
    copyFeedbackTimer = window.setTimeout(() => { copyStatus.textContent = ''; }, copied ? 1600 : 5200);
  });

  mountVisual(root, context);

  const tasteAssets = new URL(sitePath('/taste/'), window.location.origin);
  import(/* webpackIgnore: true */ /* turbopackIgnore: true */ new URL('motion.js', tasteAssets).href).catch(() => {});
  import(/* webpackIgnore: true */ /* turbopackIgnore: true */ new URL('moments/moments.js', tasteAssets).href).then(({ ready }) => {
    if (signal.aborted) return;
    const tools = root.querySelector('[data-moment="iris-opens"]');
    const keepVisible = () => {
      tools.__moment?.destroy?.();
      delete tools.__moment;
    };
    listen(tools, 'focusin', keepVisible, { once: true });
    listen(window.matchMedia('(prefers-reduced-motion: reduce)'), 'change', ({ matches }) => {
      if (matches) keepVisible();
    });
    return ready.then(() => { if (tools.matches(':focus-within')) keepVisible(); });
  }).catch(() => {});
  signal.addEventListener('abort', () => window.clearTimeout(copyFeedbackTimer), { once: true });
}
