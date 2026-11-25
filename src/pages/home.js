import './home.css';
import banner from '../assets/renderport-banner.png';
import { icon, modelUrl, outputIcon, providerMark } from '../ui.js';

const providers = ['OpenAI', 'Anthropic', 'Google', 'ByteDance', 'Kling AI', 'DeepSeek'];

function featured(models, category) {
  return (category === 'All' ? models : models.filter((model) => model.kind === category)).slice(0, 6);
}

function featuredCard(model, { urls, formatRate }) {
  return `<a class="featured-model" href="${modelUrl(urls, model.id)}">
    ${providerMark(model.provider)}
    <span class="featured-model-name"><strong>${model.name}</strong><small>${model.id}</small></span>
    <span class="featured-model-rate"><strong>${formatRate(model.rate)}</strong><small>/ ${model.unit}</small></span>
  </a>`;
}

function gpuArt() {
  return `<div class="gpu-preview" aria-label="GPU configuration preview">
    <div class="panel-heading"><span>GPU configuration</span><span>Preview</span></div>
    <div class="gpu-preview-body">
      <div class="gpu-preview-rack" aria-hidden="true">
        ${Array.from({ length: 4 }, () => '<span><i></i><b></b><em></em></span>').join('')}
      </div>
      <div class="gpu-preview-specs"><span>Choose your hardware</span><strong>Dedicated GPUs</strong><small>Configure GPU count, memory and hours.</small></div>
    </div>
    <div class="panel-footer"><span>Compute for your workload</span><span>Hourly estimates</span></div>
  </div>`;
}

export function render(context) {
  const { urls, categories, modelCatalog, formatRate } = context;
  const example = modelCatalog.find((model) => model.id === 'bytedance/seedance-2.5');
  return `
  <section class="hero">
    <img class="hero-banner" src="${banner}" alt="" fetchpriority="high">
    <div class="shell hero-inner">
      <div class="hero-copy">
        <h1>One API.<br>Every model.</h1>
        <p>Explore text, image, video and audio models in one place, with transparent pricing and GPU compute for your workloads.</p>
        <div class="hero-actions">
          <a class="button button--primary" href="${urls.models}">Explore models</a>
          <a class="button" href="${urls.docs}">API quickstart ${icon('upRight')}</a>
        </div>
        <div class="hero-economics" aria-label="Pricing policy">
          <span><strong>0%</strong><small>platform fees</small></span>
          <span><strong>0%</strong><small>markup</small></span>
          <span><strong>GPU</strong><small>cloud preview</small></span>
        </div>
      </div>
    </div>
  </section>

  <section class="provider-strip shell" aria-label="Sample model providers">
    <p>Explore models from</p>
    <div>${providers.map((provider) => `<span>${provider}</span>`).join('')}</div>
  </section>

  <section class="home-models shell" aria-labelledby="home-models-heading">
    <div class="section-heading">
      <div><h2 id="home-models-heading">Models for every idea.</h2><p>Discover models for text, images, video and audio, all in one catalog.</p></div>
      <a class="inline-link" href="${urls.models}">Discover models ${icon('arrow')}</a>
    </div>
    <div class="home-model-tabs" aria-label="Filter featured models">
      ${['All', ...categories].map((category) => `<button type="button" data-home-kind="${category}" aria-pressed="${category === 'All'}">${category === 'All' ? icon('grid') : outputIcon(category)} ${category === 'All' ? 'All models' : category} <small>${category === 'All' ? modelCatalog.length : modelCatalog.filter((model) => model.kind === category).length}</small></button>`).join('')}
    </div>
    <div class="featured-grid" data-featured-models>
      ${featured(modelCatalog, 'All').map((model) => featuredCard(model, context)).join('')}
    </div>
    <p class="catalog-note">Sample rates in USD. Provider prices depend on model and configuration.</p>
  </section>

  <section class="home-feature shell" aria-labelledby="pricing-heading">
    <div class="feature-copy">
      <h2 id="pricing-heading">Provider pricing,<br>without the markup.</h2>
      <p>Compare sample model rates across providers. With 0% platform fees and 0% markup, the price stays clear.</p>
      <a class="inline-link" href="${urls.pricing}">Compare pricing ${icon('arrow')}</a>
    </div>
    <div class="rate-panel">
      <div class="panel-heading"><span>Request cost</span><span>Example</span></div>
      <div class="rate-panel-body">
        <div class="rate-model">${providerMark(example.provider)}<span><strong>${example.name}</strong><small>${example.detail} video</small></span></div>
        <div class="rate-lines"><div><span>Provider rate</span><strong>${formatRate(example.rate)} / second</strong></div><div><span>Platform fee</span><strong>0%</strong></div><div><span>Markup</span><strong>0%</strong></div></div>
      </div>
      <div class="panel-footer"><span>Estimated cost per second</span><strong>${formatRate(example.rate)}</strong></div>
    </div>
  </section>

  <section class="home-feature home-feature--reverse shell" aria-labelledby="gpu-heading">
    ${gpuArt()}
    <div class="feature-copy">
      <h2 id="gpu-heading">Your own compute, ready to configure.</h2>
      <p>Explore dedicated GPU configurations for rendering, inference and fine-tuning. Estimate your cost by the hour.</p>
      <a class="inline-link" href="${urls.gpu}">Explore GPU Cloud ${icon('arrow')}</a>
    </div>
  </section>

  <section class="home-feature shell" aria-labelledby="quickstart-heading">
    <div class="feature-copy">
      <h2 id="quickstart-heading">Start building with one request.</h2>
      <p>Try the playground, compare response shapes and connect an OpenAI-compatible gateway when you are ready.</p>
      <a class="inline-link" href="${urls.playground}">Open playground ${icon('arrow')}</a>
    </div>
    <div class="home-code">
      <div class="panel-heading"><span>Request body</span><span>JSON</span></div>
      <pre><code>{
  <span>"model"</span>: <em>"openai/gpt-6.2-sol"</em>,
  <span>"messages"</span>: [
    {
      <span>"role"</span>: <em>"user"</em>,
      <span>"content"</span>: <em>"Say hello from RenderPort."</em>
    }
  ]
}</code></pre>
      <div class="panel-footer"><span><b>POST</b> /v1/chat/completions</span></div>
    </div>
  </section>

  <section class="home-cta shell">
    <h2>Find your next model.</h2>
    <p>Compare models, explore pricing and build your first request.</p>
    <div><a class="button button--primary" href="${urls.models}">Explore models</a><a class="button" href="${urls.docs}">Read the docs ${icon('upRight')}</a></div>
  </section>`;
}

export function mount(root, context) {
  const filters = [...root.querySelectorAll('[data-home-kind]')];
  const grid = root.querySelector('[data-featured-models]');
  const catalogLink = root.querySelector('.home-models .inline-link');
  for (const button of filters) {
    button.addEventListener('click', () => {
      const category = button.dataset.homeKind;
      for (const filter of filters) filter.setAttribute('aria-pressed', String(filter === button));
      grid.innerHTML = featured(context.modelCatalog, category).map((model) => featuredCard(model, context)).join('');
      catalogLink.href = category === 'All' ? context.urls.models : `${context.urls.models}?kind=${category.toLowerCase()}`;
    });
  }
}
