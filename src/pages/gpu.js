import './gpu.css';
import { drawGpu } from '../assets/gpu/hardware.js';

const hardware = [
  { id: 'rtx-4090', name: 'RTX 4090', memory: '24 GB', memoryType: 'GDDR6X', use: 'Image generation and 3D rendering', cents: 89 },
  { id: 'l40s', name: 'L40S', memory: '48 GB', memoryType: 'GDDR6', use: 'Video inference and fine-tuning', cents: 159 },
  { id: 'h100', name: 'H100', memory: '80 GB', memoryType: 'HBM3 (SXM)', use: 'Large-model training and inference', cents: 349 },
  { id: 'h200', name: 'H200', memory: '141 GB', memoryType: 'HBM3e', use: 'Memory-intensive model inference', cents: 499 },
];

const initialHours = 4;

function renderCard(gpu, index, formatRate) {
  return `
    <button class="rp-gpu-card" type="button" data-gpu-model="${gpu.id}" aria-controls="gpu-config" aria-pressed="${index === 0}">
      <span class="rp-gpu-card__name">${gpu.name} <span aria-hidden="true">↓</span></span>
      <span class="rp-gpu-card__memory">${gpu.memory} <small>${gpu.memoryType}</small></span>
      <span class="rp-gpu-card__use">${gpu.use}</span>
      <span class="rp-gpu-card__rate">${formatRate(gpu.cents / 100)} <small>/ GPU-hour</small></span>
    </button>`;
}

export function render({ formatRate }) {
  const defaultRate = hardware[0].cents / 100;

  return `
    <div class="rp-gpu">
      <section class="rp-gpu-hero" aria-labelledby="gpu-title">
        <div class="shell rp-gpu-hero__inner">
          <div class="rp-gpu-hero__copy">
            <h1 id="gpu-title">Dedicated GPU<br> compute.</h1>
            <p>Compare hardware for rendering, training, and inference. Plan your next run with sample hourly rates.</p>
            <div class="rp-gpu-hero__actions">
              <a class="button button--primary" href="#instances">Explore GPUs <span aria-hidden="true">↓</span></a>
              <a class="button rp-gpu-hero__estimate" href="#gpu-config">Estimate cost</a>
            </div>
            <p class="rp-gpu-hero__status">Live rentals are unavailable in this preview.</p>
          </div>
          <div class="rp-gpu-hero__stage" aria-hidden="true">
            <canvas width="1680" height="1020" data-gpu-art></canvas>
          </div>
        </div>
      </section>

      <section class="shell rp-gpu-instances" id="instances" aria-labelledby="gpu-instances-title">
        <div class="rp-gpu-instances__heading">
          <h2 id="gpu-instances-title">Choose a GPU</h2>
          <p>Sample rates in USD</p>
        </div>
        <div class="rp-gpu-instances__grid">
          ${hardware.map((gpu, index) => renderCard(gpu, index, formatRate)).join('')}
        </div>
      </section>

      <section class="shell rp-gpu-config" id="gpu-config" aria-labelledby="gpu-config-title">
        <h2 id="gpu-config-title">Estimate rental cost</h2>
        <form class="rp-gpu-config__layout" data-gpu-form>
          <div class="rp-gpu-config__fields">
            <div class="rp-gpu-config__field">
              <label for="gpu-model">GPU model</label>
              <select id="gpu-model" name="model">
                ${hardware.map((gpu) => `<option value="${gpu.id}">${gpu.name} · ${gpu.memory}</option>`).join('')}
              </select>
            </div>
            <div class="rp-gpu-config__numbers">
              <div class="rp-gpu-config__field">
                <label for="gpu-count">GPU count</label>
                <input id="gpu-count" name="count" type="number" min="1" step="1" value="1" inputmode="numeric" required>
              </div>
              <div class="rp-gpu-config__field">
                <label for="gpu-duration">Duration (hours)</label>
                <input id="gpu-duration" name="hours" type="number" min="1" step="1" value="${initialHours}" inputmode="numeric" required>
              </div>
            </div>
          </div>
          <div class="rp-gpu-config__summary">
            <label class="rp-gpu-config__total-label" for="gpu-estimate">Estimated total <span>USD</span></label>
            <output id="gpu-estimate" for="gpu-model gpu-count gpu-duration">${formatRate(defaultRate * initialHours)}</output>
            <p class="rp-gpu-config__calculation" data-gpu-calculation>${initialHours} GPU-hours × ${formatRate(defaultRate)} sample rate</p>
            <button class="button button--primary rp-gpu-config__download" type="submit">
              Download configuration <span aria-hidden="true">↓</span>
            </button>
            <p class="rp-gpu-config__feedback" data-gpu-feedback role="status"></p>
          </div>
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

  function updateEstimate() {
    const gpu = hardware.find(({ id }) => id === model.value);
    const gpuCount = count.valueAsNumber;
    const durationHours = hours.valueAsNumber;
    const gpuHours = gpuCount * durationHours;
    const totalCents = gpuHours * gpu.cents;
    const quantitiesValid = [count, hours].every((input) => {
      const valid = input.validity.valid && Number.isSafeInteger(input.valueAsNumber);
      input.setAttribute('aria-invalid', String(!valid));
      return valid;
    });

    for (const card of cards) {
      card.setAttribute('aria-pressed', String(card.dataset.gpuModel === gpu.id));
    }

    feedback.textContent = '';
    if (!quantitiesValid || !Number.isSafeInteger(totalCents)) {
      estimate.value = '—';
      calculation.textContent = quantitiesValid
        ? 'Enter a smaller count or duration.'
        : 'Enter a whole number of at least 1 in both fields.';
      download.disabled = true;
      return null;
    }

    const sampleRatePerGpuHourUsd = gpu.cents / 100;
    const estimatedTotalUsd = totalCents / 100;
    const unit = gpuHours === 1 ? 'GPU-hour' : 'GPU-hours';
    estimate.value = formatRate(estimatedTotalUsd);
    calculation.textContent = `${integer.format(gpuHours)} ${unit} × ${formatRate(sampleRatePerGpuHourUsd)} sample rate`;
    download.disabled = false;

    return {
      model: gpu.name,
      gpuCount,
      durationHours,
      gpuHours,
      currency: 'USD',
      sampleRatePerGpuHourUsd,
      estimatedTotalUsd,
      liveRentalAvailable: false,
    };
  }

  for (const card of cards) {
    card.addEventListener('click', () => {
      model.value = card.dataset.gpuModel;
      updateEstimate();
      model.focus({ preventScroll: true });
      config.scrollIntoView({ block: 'start' });
    });
  }

  form.addEventListener('input', updateEstimate);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const configuration = updateEstimate();
    if (!configuration) return;

    const contents = JSON.stringify(configuration, null, 2) + '\n';
    const objectUrl = URL.createObjectURL(new Blob([contents], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = `renderport-${model.value}.json`;
    form.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    feedback.textContent = 'Configuration download started.';
  });

  updateEstimate();
  drawGpu(root.querySelector('[data-gpu-art]'));
}
