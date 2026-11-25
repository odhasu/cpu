import './home.css';
import routerChip from '../assets/router-chip.webp';
import { icon, mark, modelCard, outputIcon } from '../ui.js';

const providerStrip = [
  ['openai', 'OpenAI'], ['anthropic', 'Anthropic'], ['google', 'Google'],
  ['bytedance', 'ByteDance'], ['kling', 'Kling AI'], ['deepseek', 'DeepSeek'],
];

function featured(models, category) {
  return (category === 'All' ? models : models.filter((model) => model.kind === category)).slice(0, 3);
}

function blades() {
  return `<div class="cluster-art" aria-hidden="true">
    ${Array.from({ length: 5 }, () => '<span><i></i><b></b></span>').join('')}
  </div>`;
}

export function render(context) {
  const { urls, categories, modelCatalog } = context;
  return `
  <section class="hero">
    <div class="shell hero-inner">
      <div class="hero-copy">
        <div class="hero-intro">${icon('route')} AI model router</div>
        <h1>One API.<br>Every model.</h1>
        <p>Route text, image, video and audio through one API. Rent dedicated cloud GPUs when you need your own compute.</p>
        <div class="hero-actions">
          <a class="button button--primary" href="${urls.models}">Explore models ${icon('arrow')}</a>
          <a class="button" href="${urls.docs}">${icon('terminal')} API quickstart</a>
        </div>
        <div class="hero-economics"><span>${icon('check')} 0% platform fees</span><span>${icon('check')} 0% markup</span></div>
      </div>
      <figure class="router-figure">
        <img src="${routerChip}" alt="" width="1260" height="930" fetchpriority="high">
        <div class="router-figure-head">
          <span><i></i> Request routing</span>
          <span>HTTPS / v1</span>
        </div>
        <div class="router-figure-corner" aria-hidden="true"></div>
        <figcaption>
          <span>${icon('code')} Your app</span>
          ${icon('chevron', 'routing-chevron')}
          <span class="routing-core">${mark()} RenderPort</span>
          ${icon('chevron', 'routing-chevron')}
          <span>${icon('layers')} Model providers</span>
        </figcaption>
      </figure>
    </div>
    <div class="shell provider-strip" aria-label="Sample model providers">
      <div>Explore models from</div>
      ${providerStrip.map(([style, name]) => `<span class="strip-provider strip-provider--${style}"><i aria-hidden="true"></i>${name}</span>`).join('')}
    </div>
  </section>

  <section class="home-models shell" aria-labelledby="home-models-heading">
    <div class="section-heading">
      <div><h2 id="home-models-heading">Find your model.</h2><p>Compare models by output and see how usage is priced.</p></div>
      <a class="inline-link" href="${urls.models}">View model catalog ${icon('arrow')}</a>
    </div>
    <div class="filter-list" aria-label="Filter featured models">
      ${['All', ...categories].map((category) => `<button type="button" class="filter-button" data-home-kind="${category}" aria-pressed="${category === 'All'}">${category === 'All' ? icon('grid') : outputIcon(category)} ${category === 'All' ? 'All models' : category}</button>`).join('')}
    </div>
    <div class="model-grid" data-featured-models>
      ${featured(modelCatalog, 'All').map((model) => modelCard(model, context)).join('')}
    </div>
    <p class="catalog-note">Sample rates in USD. Provider prices depend on model and configuration.</p>
  </section>

  <section class="home-features shell" aria-label="Pricing and GPU compute">
    <article class="home-feature home-feature-pricing">
      <div class="feature-copy">
        <p class="feature-topic">${icon('layers')} Provider pricing</p>
        <h2>Provider rates. <br>Zero markup.</h2>
        <p>Compare model prices by token, image, generation or second of video.</p>
        <a class="inline-link" href="${urls.pricing}">See model pricing ${icon('arrow')}</a>
      </div>
      <dl class="price-receipt" aria-label="Example cost per second for Seedance 2.5">
        <div class="receipt-heading"><dt>Seedance 2.5 · 720p</dt><dd>Example</dd></div>
        <div><dt>Provider rate</dt><dd>$0.23112</dd></div>
        <div><dt>Platform fee</dt><dd>$0.00</dd></div>
        <div><dt>Markup</dt><dd>$0.00</dd></div>
        <div class="receipt-total"><dt>Per second</dt><dd>$0.23112</dd></div>
      </dl>
    </article>
    <article class="home-feature home-feature-gpu">
      <div class="feature-copy">
        <p class="feature-topic">${icon('cpu')} GPU Cloud</p>
        <h2>Compute by<br>the hour.</h2>
        <p>Choose VRAM and GPU count for rendering, inference or fine-tuning.</p>
        <a class="inline-link" href="${urls.gpu}">Explore GPU Cloud ${icon('arrow')}</a>
      </div>
      ${blades()}
    </article>
  </section>

  <section class="home-quickstart shell">
    <div class="home-quickstart-copy">
      <p class="feature-topic">${icon('code')} For developers</p>
      <h2>Make your<br>first request.</h2>
      <p>Build a request in the playground and see the response shape before connecting a gateway.</p>
      <a class="button button--primary" href="${urls.playground}">Open playground ${icon('arrow')}</a>
    </div>
    <div class="home-code">
      <div class="home-code-head">${icon('terminal')} Request body <span>JSON</span></div>
      <pre class="mono"><code>{
  <span>"model"</span>: <em>"openai/gpt-6.2-sol"</em>,
  <span>"messages"</span>: [
    {
      <span>"role"</span>: <em>"user"</em>,
      <span>"content"</span>: <em>"Say hello from RenderPort."</em>
    }
  ]
}</code></pre>
      <div class="home-code-foot"><b>POST</b> /v1/chat/completions</div>
    </div>
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
      grid.innerHTML = featured(context.modelCatalog, category).map((model) => modelCard(model, context)).join('');
      catalogLink.href = category === 'All' ? context.urls.models : `${context.urls.models}?kind=${category.toLowerCase()}`;
    });
  }
}
