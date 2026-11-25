import './gpu.css';
import { drawGpu } from '../assets/gpu/hardware.js';
import { icon } from '../ui.js';

const hardware = [
  { id: 'rtx-4090', name: 'RTX 4090', vendor: 'NVIDIA', memory: '24 GB', memoryType: 'GDDR6X', use: 'Image generation and 3D rendering', power: 'Low power', cents: 89 },
  { id: 'l40s', name: 'L40S', vendor: 'NVIDIA', memory: '48 GB', memoryType: 'GDDR6', use: 'Video inference and fine-tuning', power: 'Low power', cents: 159 },
  { id: 'h100', name: 'H100', vendor: 'NVIDIA', memory: '80 GB', memoryType: 'HBM3 (SXM)', use: 'Large-model training and inference', power: 'Medium power', cents: 349 },
  { id: 'h200', name: 'H200', vendor: 'NVIDIA', memory: '141 GB', memoryType: 'HBM3e', use: 'Memory-intensive model inference', power: 'High power', cents: 499 },
];

const tutorials = [
  ['Model and render in Blender with Claude', '3D modeling', 'Blender'],
  ['Render Houdini simulations', 'Simulation', 'Houdini'],
  ['Render Blender animations with Claude', 'Animation', 'Blender'],
  ['Render a city in Unreal Engine', '3D modeling', 'Unreal Engine'],
  ['Simulate flower growth in Houdini', 'Simulation', 'Houdini'],
  ['Build a city in Blender with Claude', '3D modeling', 'Blender'],
];
const loras = ['1920s Silent Horror', '1980s Horror Movies', '360° Orbit', 'Bullet Time', 'Character Design Sheet', 'Citron · Moonlight', 'Classic Painting', 'Product visualization'];
const blenderPresets = [
  ['Simulate destruction in Blender', '/destruction-studio', 'Create cinematic destruction with fractured structures, debris and dust.'],
  ['Animate object assembly in Blender', '/exploded-view', 'Show how an object fits together with coordinated motion.'],
  ['Build 3D scenes in Blender', '/scene-builder', 'Stage characters, props and architecture in an editable scene.'],
  ['Create cartoon materials in Blender', '/cartoon-shaders', 'Build stylized materials with toon shading and outlines.'],
];
const artcraftPresets = [
  ['Build a character sheet in ArtCraft', '/character-sheet', 'Explore consistent character variations with a reusable prompt setup.'],
  ['Create a cinematic still in ArtCraft', '/cinematic-still', 'Compose lighting, lens and atmosphere references for a still image.'],
  ['Generate a product study in ArtCraft', '/product-study', 'Compare clean product directions with a focused visual brief.'],
  ['Make a style exploration in ArtCraft', '/style-exploration', 'Collect a small set of visual directions for your next scene.'],
];
const initialHours = 4;

function renderCard(gpu, index, formatRate) {
  return `<button class="rp-gpu-card" type="button" data-gpu-model="${gpu.id}" aria-controls="gpu-config" aria-pressed="${index === 0}">
    <span class="rp-gpu-card__name">${gpu.name} <small>${gpu.vendor}</small><span aria-hidden="true">↗</span></span>
    <span class="rp-gpu-card__memory">${gpu.memory} <small>${gpu.memoryType}</small></span>
    <span class="rp-gpu-card__use">${gpu.power} · ${gpu.use}</span>
    <span class="rp-gpu-card__rate">${formatRate(gpu.cents / 100)} <small>/ GPU-hour</small></span>
  </button>`;
}

function renderPresetCards(presets) {
  return presets.map(([title, command, description]) => `<article class="rp-gpu-preset">
    <span class="rp-gpu-preset__icon">${command.slice(1, 2).toUpperCase()}</span>
    <h3>${title}</h3><p>${description}</p><code>${command}</code>
    <button class="rp-gpu-preset__action" type="button" data-workflow="${title}">Preview workflow ${icon('arrow')}</button>
  </article>`).join('');
}

function interactiveChat() {
  return `<div class="rp-gpu-chat-panel">
    <div class="rp-gpu-chat-glow"><span>●</span><span>●</span><span>●</span><span>●</span></div>
    <div class="rp-gpu-chat-panel__window"><div><b>Claude</b><small>connected to Blinkrouter GPU</small></div><i></i><i></i><i></i></div>
    <div class="rp-gpu-chat-panel__prompt"><span>/gpu</span><strong>Launch a Blender render</strong></div>
  </div>`;
}

export function render({ formatRate }) {
  const defaultRate = hardware[0].cents / 100;
  return `<div class="rp-gpu">
    <section class="rp-gpu-hero" data-reveal aria-labelledby="gpu-title">
      <div class="shell rp-gpu-hero__inner">
        <div class="rp-gpu-hero__copy">
          <p class="rp-gpu-eyebrow">GPU Cloud preview</p>
          <h1 id="gpu-title">GPU power for<br>your creative workspace.</h1>
          <p>Explore Blender, Houdini, ArtCraft and your own LoRAs through a focused hardware workspace.</p>
          <div class="rp-gpu-hero__actions"><a class="button button--primary" href="#instances">Explore hardware ${icon('arrow')}</a><a class="button rp-gpu-hero__estimate" href="#gpu-config">Estimate cost</a></div>
          <p class="rp-gpu-hero__status">Includes sample hourly rates and a downloadable configuration.</p>
        </div>
        <div class="rp-gpu-hero__stage" aria-hidden="true"><canvas width="1680" height="1020" data-gpu-art></canvas><div class="rp-gpu-server-label">GPU<br><small>PREVIEW</small></div></div>
      </div>
    </section>

    <section class="shell rp-gpu-workspace" data-reveal aria-label="GPU workspace">
      <div class="rp-gpu-workspace__tabs" role="tablist" aria-label="GPU workspace views"><button id="gpu-tab-explore" role="tab" type="button" data-gpu-view="explore" aria-controls="gpu-panel-explore" aria-selected="true">Explore</button><button id="gpu-tab-computers" role="tab" type="button" data-gpu-view="computers" aria-controls="gpu-panel-computers" aria-selected="false">My computers &amp; GPUs</button></div>
      <div class="rp-gpu-workspace__panels"><div class="rp-gpu-speed" id="gpu-panel-explore" role="tabpanel" aria-labelledby="gpu-tab-explore"><span>GPU WORKSPACE PREVIEW</span><strong>Configure rendering for<br>Blender, 3D and motion</strong><a class="inline-link" href="#instances">Explore GPUs ${icon('arrow')}</a></div><div class="rp-gpu-speed rp-gpu-computers" id="gpu-panel-computers" role="tabpanel" aria-labelledby="gpu-tab-computers" hidden><span>MY COMPUTERS &amp; GPUS</span><strong>No computers yet</strong><p>Connected machines will appear here when this workspace is linked to a provider.</p><button class="inline-link" type="button" data-preview-action="computer">View connection preview ${icon('arrow')}</button></div></div>
    </section>

    <section class="shell rp-gpu-instances" id="instances" data-reveal aria-labelledby="gpu-instances-title">
      <div class="rp-gpu-instances__heading"><div><p class="rp-gpu-eyebrow">Explore</p><h2 id="gpu-instances-title">Available NVIDIA GPUs</h2></div><a class="inline-link" href="#gpu-config">See all ${icon('arrow')}</a></div>
      <div class="rp-gpu-instances__grid">${hardware.map((gpu, index) => renderCard(gpu, index, formatRate)).join('')}</div>
    </section>

    <section class="shell rp-gpu-chat" data-reveal aria-labelledby="gpu-chat-title">
      ${interactiveChat()}
      <div><p class="rp-gpu-eyebrow">A connected workflow preview</p><h2 id="gpu-chat-title">Control your GPU<br>from Claude.</h2><p>See how a conversational workspace could launch and edit a 3D scene once an MCP connection is configured.</p><button class="button" type="button" data-preview-action="claude">Preview Claude MCP ${icon('upRight')}</button></div>
    </section>

    <section class="shell rp-gpu-learn" data-reveal aria-labelledby="gpu-learn-title">
      <div class="rp-gpu-instances__heading"><div><p class="rp-gpu-eyebrow">Learn</p><h2 id="gpu-learn-title">How to use Blinkrouter GPU</h2></div><a class="inline-link" href="${location.pathname}">See all ${icon('arrow')}</a></div>
      <div class="rp-gpu-tutorials">${tutorials.map(([title, kind, app], index) => `<button class="rp-gpu-tutorial" type="button" data-tutorial="${title}"><span class="rp-gpu-tutorial__art" data-art="${index % 3}"><i></i><b></b></span><strong>${title}</strong><small>${kind} · ${app}</small></button>`).join('')}</div>
    </section>

    <section class="shell rp-gpu-lora" data-reveal aria-labelledby="gpu-lora-title">
      <div class="rp-gpu-lora__copy"><p class="rp-gpu-eyebrow">Your models</p><h2 id="gpu-lora-title">Generate with<br>your own LoRA.</h2><p>Preview how a model library could fit into a dedicated GPU workflow.</p><button class="button" type="button" data-preview-action="lora">Preview custom LoRA import ${icon('arrow')}</button></div>
      <div class="rp-gpu-lora__grid">${loras.map((name, index) => `<button type="button" class="rp-gpu-lora-card" data-lora="${name}"><span class="rp-gpu-lora-card__art" data-art="${index % 4}"></span><strong>${name}</strong><small>Run on GPU ${icon('arrow')}</small></button>`).join('')}</div>
    </section>

    <section class="shell rp-gpu-presets" data-reveal aria-labelledby="gpu-presets-title">
      <div class="rp-gpu-instances__heading"><div><p class="rp-gpu-eyebrow">Workflows</p><h2 id="gpu-presets-title">One-click presets</h2></div><div class="rp-gpu-preset-tabs" role="tablist" aria-label="Workflow presets"><button id="preset-tab-blender" role="tab" type="button" aria-controls="preset-panel-blender" aria-selected="true" data-preset="blender">For Blender 4</button><button id="preset-tab-artcraft" role="tab" type="button" aria-controls="preset-panel-artcraft" aria-selected="false" data-preset="artcraft">For ArtCraft 9</button></div></div>
      <div class="rp-gpu-preset-grid" id="preset-panel-blender" role="tabpanel" aria-labelledby="preset-tab-blender">${renderPresetCards(blenderPresets)}</div><div class="rp-gpu-preset-grid" id="preset-panel-artcraft" role="tabpanel" aria-labelledby="preset-tab-artcraft" hidden>${renderPresetCards(artcraftPresets)}</div>
    </section>

    <section class="shell rp-gpu-config" id="gpu-config" aria-labelledby="gpu-config-title">
      <p class="rp-gpu-eyebrow">Preview calculator</p><h2 id="gpu-config-title">Estimate sample cost</h2>
      <form class="rp-gpu-config__layout" data-gpu-form>
        <div class="rp-gpu-config__fields"><div class="rp-gpu-config__field"><label for="gpu-model">GPU model</label><select id="gpu-model" name="model">${hardware.map((gpu) => `<option value="${gpu.id}">${gpu.name} · ${gpu.memory}</option>`).join('')}</select></div><div class="rp-gpu-config__numbers"><div class="rp-gpu-config__field"><label for="gpu-count">GPU count</label><input id="gpu-count" name="count" type="number" min="1" step="1" value="1" inputmode="numeric" required></div><div class="rp-gpu-config__field"><label for="gpu-duration">Duration (hours)</label><input id="gpu-duration" name="hours" type="number" min="1" step="1" value="${initialHours}" inputmode="numeric" required></div></div></div>
        <div class="rp-gpu-config__summary"><label class="rp-gpu-config__total-label" for="gpu-estimate">Estimated total <span>USD</span></label><output id="gpu-estimate" for="gpu-model gpu-count gpu-duration">${formatRate(defaultRate * initialHours)}</output><p class="rp-gpu-config__calculation" data-gpu-calculation>${initialHours} GPU-hours × ${formatRate(defaultRate)} sample rate</p><button class="button button--primary rp-gpu-config__download" type="submit">Download configuration ${icon('arrow')}</button><p class="rp-gpu-config__feedback" data-gpu-feedback role="status"></p></div>
      </form>
    </section>
  </div>`;
}

export function mount(root, { formatRate }) {
  const config = root.querySelector('#gpu-config');
  const form = config.querySelector('[data-gpu-form]');
  const { model, count, hours } = form.elements;
  const cards = root.querySelectorAll('[data-gpu-model]');
  const estimate = form.querySelector('output');
  const calculation = form.querySelector('[data-gpu-calculation]');
  const download = form.querySelector('button[type="submit"]');
  const feedback = form.querySelector('[data-gpu-feedback]');
  const integer = new Intl.NumberFormat('en-US');

  const updateEstimate = () => {
    const gpu = hardware.find(({ id }) => id === model.value) ?? hardware[0];
    const gpuCount = count.valueAsNumber;
    const durationHours = hours.valueAsNumber;
    const gpuHours = gpuCount * durationHours;
    const totalCents = gpuHours * gpu.cents;
    const quantitiesValid = [count, hours].every((input) => {
      const valid = input.validity.valid && Number.isSafeInteger(input.valueAsNumber);
      input.setAttribute('aria-invalid', String(!valid));
      return valid;
    });

    for (const card of cards) card.setAttribute('aria-pressed', String(card.dataset.gpuModel === gpu.id));
    if (!quantitiesValid || !Number.isSafeInteger(totalCents)) {
      estimate.value = '—';
      calculation.textContent = quantitiesValid ? 'Enter a smaller count or duration.' : 'Enter a whole number of at least 1 in both fields.';
      download.disabled = true;
      return null;
    }

    const sampleRatePerGpuHourUsd = gpu.cents / 100;
    const estimatedTotalUsd = totalCents / 100;
    const unit = gpuHours === 1 ? 'GPU-hour' : 'GPU-hours';
    estimate.value = formatRate(estimatedTotalUsd);
    calculation.textContent = `${integer.format(gpuHours)} ${unit} × ${formatRate(sampleRatePerGpuHourUsd)} sample rate`;
    download.disabled = false;
    return { model: gpu.name, gpuCount, durationHours, gpuHours, currency: 'USD', sampleRatePerGpuHourUsd, estimatedTotalUsd, liveRentalAvailable: false };
  };

  const showPreview = (message, shouldScroll = true) => {
    feedback.textContent = message;
    if (shouldScroll) {
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      config.scrollIntoView({ block: 'start', behavior });
    }
  };

  for (const card of cards) card.addEventListener('click', () => {
    model.value = card.dataset.gpuModel;
    updateEstimate();
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    config.scrollIntoView({ block: 'start', behavior });
  });

  form.addEventListener('input', updateEstimate);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const configuration = updateEstimate();
    if (!configuration) return;
    const objectUrl = URL.createObjectURL(new Blob([JSON.stringify(configuration, null, 2) + '\n'], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `blinkrouter-${model.value}.json`;
    form.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    feedback.textContent = 'Configuration download started.';
  });

  for (const button of root.querySelectorAll('[data-gpu-view]')) {
    button.addEventListener('click', () => {
      const isComputers = button.dataset.gpuView === 'computers';
      root.querySelectorAll('[data-gpu-view]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
      root.querySelector('#gpu-panel-explore').hidden = isComputers;
      root.querySelector('#gpu-panel-computers').hidden = !isComputers;
    });
  }

  for (const button of root.querySelectorAll('[data-preset]')) {
    button.addEventListener('click', () => {
      const isArtcraft = button.dataset.preset === 'artcraft';
      root.querySelectorAll('[data-preset]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
      root.querySelector('#preset-panel-blender').hidden = isArtcraft;
      root.querySelector('#preset-panel-artcraft').hidden = !isArtcraft;
    });
  }

  for (const button of root.querySelectorAll('[data-preview-action]')) {
    button.addEventListener('click', () => {
      const message = {
        claude: 'Claude MCP is shown as a connection preview; no external integration was started.',
        lora: 'Custom LoRA import is shown as a preview; no file was uploaded.',
        computer: 'Computer connections are shown as a preview; no provider was linked.',
      }[button.dataset.previewAction];
      showPreview(message);
    });
  }

  for (const button of root.querySelectorAll('[data-lora]')) {
    button.addEventListener('click', () => {
      model.value = hardware[0].id;
      updateEstimate();
      showPreview(`${button.dataset.lora} selected for a GPU workflow preview.`);
    });
  }

  for (const button of root.querySelectorAll('[data-tutorial], [data-workflow]')) {
    button.addEventListener('click', () => showPreview(`${button.dataset.tutorial ?? button.dataset.workflow} is available as a workflow preview.`));
  }

  updateEstimate();
  drawGpu(root.querySelector('[data-gpu-art]'));
}
