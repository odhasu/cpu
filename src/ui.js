const icons = {
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  upRight: '<path d="M7 17 17 7M7 7h10v10"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/>',
  command: '<path d="M9 7V5.5a2.5 2.5 0 1 0-2.5 2.5h11a2.5 2.5 0 1 0-2.5-2.5v13a2.5 2.5 0 1 0 2.5-2.5h-11a2.5 2.5 0 1 0 2.5 2.5z"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  copy: '<rect width="12" height="12" x="8" y="8" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-2-16-4 20"/>',
  terminal: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m6 8 4 4-4 4m7 0h5"/>',
  server: '<rect width="20" height="7" x="2" y="4" rx="2"/><rect width="20" height="7" x="2" y="13" rx="2"/><path d="M6 7.5h.01M6 16.5h.01M10 7.5h.01M10 16.5h.01"/>',
  cpu: '<rect width="14" height="14" x="5" y="5" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 6"/>',
  text: '<path d="M4 6h16M4 12h16M4 18h11"/>',
  video: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3z"/>',
  audio: '<path d="M3 10v4m4-6v8m5-12v16m5-13v10m4-7v4"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5 9-5zm-9 9 9 5 9-5M3 16l9 5 9-5"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  bell: '<path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12a2 2 0 0 0 4 0"/>',
  external: '<path d="M13 4h7v7m0-7-9 9m7 0v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6"/>',
  pin: '<path d="M12 3a7 7 0 0 1 7 7c0 5.2-7 11-7 11s-7-5.8-7-11a7 7 0 0 1 7-7Z"/><circle cx="12" cy="10" r="2"/>',
  route: '<circle cx="5.5" cy="5.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/><path d="M8 5.5h6a3.5 3.5 0 0 1 0 7H8a3 3 0 0 0 0 6h8"/>',
  github: '<path d="M9 19c-4 1.3-4-2-6-2.5M15 22v-3.4a3 3 0 0 0-.8-2.4c2.7-.3 5.6-1.3 5.6-6A4.7 4.7 0 0 0 18.5 7a4.4 4.4 0 0 0-.1-3.3s-1-.3-3.4 1.3a12 12 0 0 0-6 0C6.6 3.4 5.6 3.7 5.6 3.7A4.4 4.4 0 0 0 5.5 7a4.7 4.7 0 0 0-1.3 3.2c0 4.7 2.9 5.7 5.6 6A3 3 0 0 0 9 18.6V22"/>',
};

export function icon(name, className = '') {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] ?? icons.layers}</svg>`;
}

export function mark(className = '') {
  return `<svg class="brand-mark ${className}" viewBox="0 0 72 72" fill="none" aria-hidden="true"><g transform="translate(3 4)"><path fill="currentColor" d="M4 60V17L17 4H38C50.15 4 60 13.85 60 26C60 33.8 56.25 40.7 50.85 44.65L40.55 34.35C43.8 33.3 46 30.05 46 26C46 21.58 42.42 18 38 18H23L18 23V60Z"/><path class="brand-slash" d="M23 34H36L62 60H49Z"/></g></svg>`;
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

export function outputIcon(kind) {
  return icon(kind.toLowerCase());
}

const providers = {
  ByteDance: ['BD', '151 164 255'],
  OpenAI: ['OA', '156 222 205'],
  Google: ['G', '133 177 255'],
  Anthropic: ['A', '247 168 141'],
  'Kling AI': ['K', '139 229 201'],
  Suno: ['S', '240 159 197'],
  Alibaba: ['W', '255 158 124'],
  'Black Forest Labs': ['BF', '198 215 162'],
  ElevenLabs: ['11', '207 201 244'],
  DeepSeek: ['D', '133 163 250'],
  MiniMax: ['M', '205 182 255'],
};

export function providerMark(provider) {
  const [label, color] = providers[provider] ?? [provider.slice(0, 2), '185 185 190'];
  return `<span class="provider-mark" style="--provider-color: ${color}" aria-hidden="true">${escapeHtml(label)}</span>`;
}

export function modelUrl(urls, id) {
  return `${urls.models}?model=${encodeURIComponent(id)}`;
}

export function modelCard(model, { urls, formatRate }) {
  const suffix = model.kind === 'Text' ? 'input' : `/ ${model.unit}`;
  const rate = model.kind === 'Text' ? `${formatRate(model.rate)} / ${model.unit}` : formatRate(model.rate);
  return `<a class="model-card" href="${modelUrl(urls, model.id)}">
    <div class="model-card-top">
      ${providerMark(model.provider)}
      <span class="category-chip" data-kind="${model.kind}">${outputIcon(model.kind)} ${model.kind}</span>
    </div>
    <div class="model-card-text"><h3>${model.name}</h3><span>${model.provider}</span></div>
    <p>${model.description}</p>
    <div class="model-card-bottom"><span><strong>${rate}</strong> ${suffix}</span>${icon('upRight')}</div>
  </a>`;
}

export async function copyText(button, content) {
  try {
    await navigator.clipboard.writeText(content);
    button.dataset.copied = 'true';
    window.setTimeout(() => { delete button.dataset.copied; }, 1500);
    return true;
  } catch {
    return false;
  }
}
