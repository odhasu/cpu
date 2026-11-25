import './docs.css';
import { copyText, icon } from '../ui.js';
import { quickstart, quickstartLanguages as languages, quickstartModelId as initialModelId, requestFor } from '../data/requests.js';

const examplePath = 'https://gateway.example/v1';
const samplePrompts = {
  Text: 'Give me three ways to describe a city at sunrise.',
  Image: 'An editorial photograph of a brutalist observatory at first light.',
  Video: 'A slow dolly shot across an observatory as the sun rises.',
  Audio: 'Welcome to the observatory. Sunrise begins in three minutes.',
};

function copyButton(className = '') {
  return `<button type="button" class="button button--quiet docs-copy ${className}"><span class="copy-idle">${icon('copy')} Copy</span><span class="copy-done">${icon('check')} Copied</span></button>`;
}

function sampleResult(model) {
  if (model.kind === 'Text') {
    return {
      id: 'chatcmpl-preview',
      object: 'chat.completion',
      model: model.id,
      choices: [{
        index: 0,
        message: { role: 'assistant', content: 'This is an example reply from the Blinkrouter playground. Connect a gateway to get a model-generated response.' },
        finish_reason: 'stop',
      }],
    };
  }
  return {
    id: 'gen-preview',
    object: 'generation',
    model: model.id,
    output: model.kind.toLowerCase(),
    status: 'completed',
    data: [{ url: `https://media.example/preview.${{ Image: 'webp', Video: 'mp4', Audio: 'mp3' }[model.kind]}` }],
  };
}

function gatewayEndpoint(value, path) {
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error('Enter a complete gateway URL, including https://.');
  }
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) {
    throw new Error('Use HTTPS for your gateway. HTTP works for localhost development.');
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new Error('Enter a base URL without credentials, query parameters or a fragment.');
  }
  url.pathname = `${url.pathname.replace(/\/+$/, '')}${path}`;
  return url.href;
}

export function render({ urls, modelCatalog }) {
  return `<section class="docs-page shell">
    <div class="docs-heading">
      <p>${icon('terminal')} Developer API</p>
      <h1>Make your first request.</h1>
      <p>Build a request, preview the response and connect your own compatible text gateway.</p>
      <div class="docs-heading-actions">
        <a href="#playground" class="button button--primary">Open playground ${icon('arrow')}</a>
        <a href="${urls.models}" class="button">Browse models</a>
      </div>
    </div>
    <div class="docs-layout">
      <aside><nav class="docs-index" aria-label="On this page">
        <a href="#quickstart">${icon('code')} Quickstart</a>
        <a href="#playground">${icon('terminal')} Playground</a>
        <a href="#connecting">${icon('route')} Connect a gateway</a>
      </nav></aside>
      <div class="docs-content">
        <section id="quickstart" class="docs-section" aria-labelledby="quickstart-title">
          <h2 id="quickstart-title">Quickstart</h2>
          <p>Set <code>GATEWAY_URL</code> to your gateway’s base URL, such as <code>${examplePath}</code>, and <code>GATEWAY_KEY</code> to your gateway key. Use a model ID supported by your gateway.</p>
          <div class="docs-code-block" data-reveal>
            <div class="docs-code-toolbar">
              <div class="docs-languages" aria-label="Code language">${languages.map((language, index) => `<button type="button" aria-pressed="${index === 0}" data-language="${language}">${language}</button>`).join('')}</div>
              ${copyButton('copy-quickstart')}
            </div>
            <pre tabindex="0" aria-label="Quickstart example"><code data-quickstart-code></code></pre>
          </div>
          <p class="docs-copy-message" data-docs-copy-status role="status"></p>
        </section>
        <section id="playground" class="docs-section playground" aria-labelledby="playground-title">
          <h2 id="playground-title">API playground</h2>
          <p>Preview any model request locally. Connected mode sends text requests to a gateway you choose.</p>
          <div class="playground-console">
            <form class="playground-config" data-playground-form>
              <div class="playground-mode">
                <label><input type="radio" name="mode" value="demo" checked><span>Preview</span></label>
                <label><input type="radio" name="mode" value="connected"><span>Connect gateway</span></label>
              </div>
              <label>Model
                <select class="field" name="model" data-playground-model>${modelCatalog.map((model) => `<option value="${model.id}" data-kind="${model.kind}"${model.id === initialModelId ? ' selected' : ''}>${model.name} · ${model.kind}</option>`).join('')}</select>
              </label>
              <div class="gateway-fields" hidden>
                <label>Base URL
                  <input type="url" class="field" name="gateway" placeholder="${examplePath}" autocomplete="off">
                </label>
                <label>Gateway model ID
                  <input type="text" class="field" name="gatewayModel" placeholder="Leave blank to use the selected model" autocomplete="off" spellcheck="false">
                </label>
                <label>API key <span>(if required)</span>
                  <input type="password" class="field" name="gatewayKey" autocomplete="off" spellcheck="false">
                </label>
                <p>Requests go directly to the URL above. Keys are held only in this form.</p>
              </div>
              <label>Prompt
                <textarea class="field" name="prompt" rows="4" maxlength="4000" required></textarea>
              </label>
              <button type="submit" class="button button--primary" data-run-request>Run preview ${icon('arrow')}</button>
              <p class="playground-feedback" data-playground-feedback role="status"></p>
            </form>
            <div class="playground-output">
              <div class="playground-output-bar"><span><b>POST</b> <code data-request-path></code></span>${copyButton('copy-request')}</div>
              <pre tabindex="0" aria-label="Request JSON"><code data-request-body></code></pre>
              <div class="playground-output-bar"><span data-response-label>Response</span></div>
              <pre tabindex="0" aria-label="Response JSON"><code data-response-body>Run a preview to see a response.</code></pre>
            </div>
          </div>
        </section>
        <section id="connecting" class="docs-section docs-connecting" aria-labelledby="connecting-title">
          <h2 id="connecting-title">Connect a gateway</h2>
          <p>A compatible text gateway accepts <code>POST /chat/completions</code> under its base URL. Browser requests require the gateway to allow this site’s origin through CORS. Server-side integrations can use the SDK examples above.</p>
          <p>The media requests in this preview illustrate request shapes. Use your provider’s API documentation for its supported endpoints and parameters.</p>
          <a href="${urls.github}" class="inline-link">${icon('github')} View source on GitHub ${icon('upRight')}</a>
        </section>
      </div>
    </div>
  </section>`;
}

export function mount(root, { modelCatalog }) {
  const quickstartCode = root.querySelector('[data-quickstart-code]');
  const copyStatus = root.querySelector('[data-docs-copy-status]');
  const languageButtons = [...root.querySelectorAll('[data-language]')];
  quickstartCode.textContent = quickstart('cURL');

  function wireCopy(selector, code, status) {
    root.querySelector(selector).addEventListener('click', async (event) => {
      const copied = await copyText(event.currentTarget, code.textContent);
      status.textContent = copied ? 'Copied to clipboard.' : 'Copy unavailable. Select the code to copy it.';
    });
  }

  for (const button of languageButtons) button.addEventListener('click', () => {
    for (const item of languageButtons) item.setAttribute('aria-pressed', String(item === button));
    quickstartCode.textContent = quickstart(button.dataset.language);
    copyStatus.textContent = '';
  });
  wireCopy('.copy-quickstart', quickstartCode, copyStatus);

  const form = root.querySelector('[data-playground-form]');
  const fields = form.elements;
  const modelSelect = fields.namedItem('model');
  const promptField = fields.namedItem('prompt');
  const gateway = fields.namedItem('gateway');
  const gatewayModel = fields.namedItem('gatewayModel');
  const gatewayKey = fields.namedItem('gatewayKey');
  const submit = root.querySelector('[data-run-request]');
  const gatewayFields = root.querySelector('.gateway-fields');
  const requestPath = root.querySelector('[data-request-path]');
  const requestBody = root.querySelector('[data-request-body]');
  const responseLabel = root.querySelector('[data-response-label]');
  const responseBody = root.querySelector('[data-response-body]');
  const feedback = root.querySelector('[data-playground-feedback]');
  const requestedId = new URLSearchParams(location.search).get('model');
  if (modelCatalog.some((model) => model.id === requestedId)) modelSelect.value = requestedId;

  const getModel = () => modelCatalog.find((model) => model.id === modelSelect.value);
  const connected = () => fields.namedItem('mode').value === 'connected';
  let pending = false;
  let initialPrompt = samplePrompts[getModel().kind];
  promptField.value = initialPrompt;

  function updateRequest() {
    const model = getModel();
    const modelId = connected() ? gatewayModel.value.trim() || model.id : model.id;
    const request = requestFor(model, promptField.value, modelId);
    requestPath.textContent = `/v1${request.path}`;
    requestBody.textContent = JSON.stringify(request.body, null, 2);
    return request;
  }

  function updateModel() {
    const defaultPrompt = samplePrompts[getModel().kind];
    if (promptField.value === initialPrompt) promptField.value = defaultPrompt;
    initialPrompt = defaultPrompt;
    updateRequest();
  }

  function updateMode() {
    const live = connected();
    for (const option of modelSelect.options) option.disabled = live && option.dataset.kind !== 'Text';
    if (modelSelect.selectedOptions[0].disabled) modelSelect.value = initialModelId;
    gatewayFields.hidden = !live;
    gateway.required = live;
    if (!live) gatewayKey.value = '';
    submit.innerHTML = `${live ? 'Send request' : 'Run preview'} ${icon('arrow')}`;
    feedback.textContent = '';
    responseLabel.textContent = 'Response';
    responseBody.textContent = live ? 'Send a request to see your gateway’s response.' : 'Run a preview to see a response.';
    updateModel();
  }

  modelSelect.addEventListener('change', updateModel);
  promptField.addEventListener('input', updateRequest);
  gatewayModel.addEventListener('input', updateRequest);
  for (const radio of form.querySelectorAll('input[name="mode"]')) radio.addEventListener('change', updateMode);
  wireCopy('.copy-request', requestBody, feedback);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending) return;
    if (!promptField.value.trim()) {
      feedback.textContent = 'Enter a prompt first.';
      promptField.focus();
      return;
    }

    const { path, body } = updateRequest();
    if (!connected()) {
      responseLabel.textContent = 'Sample response';
      responseBody.textContent = JSON.stringify(sampleResult(getModel()), null, 2);
      feedback.textContent = 'Preview complete. No network request sent.';
      return;
    }

    let endpoint;
    try {
      endpoint = gatewayEndpoint(gateway.value, path);
    } catch (error) {
      feedback.textContent = error.message;
      gateway.focus();
      return;
    }

    const headers = { 'Content-Type': 'application/json' };
    if (gatewayKey.value.trim()) headers.Authorization = `Bearer ${gatewayKey.value.trim()}`;

    pending = true;
    const controls = [...form.querySelectorAll('button, input, select, textarea')];
    for (const control of controls) control.disabled = true;
    feedback.textContent = 'Waiting for the gateway…';
    responseLabel.textContent = 'Response';
    responseBody.textContent = '';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        credentials: 'omit',
        redirect: 'error',
        referrerPolicy: 'no-referrer',
        signal: AbortSignal.timeout(30000),
      });
      responseLabel.textContent = `HTTP ${response.status}`;
      if (!response.ok) {
        feedback.textContent = `Gateway returned HTTP ${response.status}. Check the key, model ID and base URL.`;
        return;
      }
      const data = await response.json();
      responseBody.textContent = JSON.stringify(data, null, 2);
      feedback.textContent = 'Response received.';
    } catch (error) {
      feedback.textContent = error.name === 'TimeoutError'
        ? 'The gateway did not respond within 30 seconds.'
        : error instanceof SyntaxError
          ? 'The gateway returned an invalid JSON response.'
          : 'Could not reach the gateway. Check its URL and browser CORS settings.';
    } finally {
      pending = false;
      for (const control of controls) control.disabled = false;
    }
  });

  updateRequest();
}
