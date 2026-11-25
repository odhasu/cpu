import { requestFor } from '../data/requests.js';

function bezierPoint([start, a, b, end], t) {
  const u = 1 - t;
  return {
    x: u ** 3 * start.x + 3 * u ** 2 * t * a.x + 3 * u * t ** 2 * b.x + t ** 3 * end.x,
    y: u ** 3 * start.y + 3 * u ** 2 * t * a.y + 3 * u * t ** 2 * b.y + t ** 3 * end.y,
  };
}

export function mountVisual(root, { modelCatalog, urls }) {
  const stage = root.querySelector('[data-routing-stage]');
  const source = stage.querySelector('[data-routing-source]');
  const chip = stage.querySelector('.routing-hub-chip');
  const targets = [...stage.querySelectorAll('[data-route-kind]')];
  const replay = root.querySelector('[data-route-replay]');
  const endpoint = root.querySelector('[data-routing-path]');
  const modelName = root.querySelector('[data-routing-model]');
  const playground = root.querySelector('[data-routing-link]');
  const canvas = stage.querySelector(':scope > canvas');
  const drawing = canvas.getContext('2d');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let frame = 0;
  let incoming;
  let outgoing = [];
  let width = 0;
  let height = 0;
  let chipScene;
  let entered = false;
  let visible = false;

  async function loadChip() {
    if (navigator.connection?.saveData) return;
    const surface = document.createElement('canvas');
    try {
      const context = surface.getContext('webgl2', {
        alpha: true, antialias: true, powerPreference: 'low-power',
      });
      if (!context) return;
      const { mountRouterChip } = await import('../visuals/router-chip.js');
      chipScene = mountRouterChip(chip, surface, context, motion);
      chipScene.setVisible(visible);
    } catch {
      surface.remove();
    }
  }

  function stroke([start, a, b, end], color) {
    drawing.beginPath();
    drawing.moveTo(start.x, start.y);
    drawing.bezierCurveTo(a.x, a.y, b.x, b.y, end.x, end.y);
    drawing.strokeStyle = color;
    drawing.stroke();
  }

  function paint(progress) {
    if (!drawing || !incoming) return;
    drawing.clearRect(0, 0, width, height);
    drawing.lineWidth = 1;
    outgoing.forEach((path, index) => {
      if (index !== active) stroke(path, '#424b48');
    });
    stroke(incoming, '#77934c');
    stroke(outgoing[active], '#77934c');

    if (progress == null) return;
    const firstLeg = progress < 0.4;
    const path = firstLeg ? incoming : outgoing[active];
    const localProgress = firstLeg ? progress / 0.4 : (progress - 0.4) / 0.6;
    const point = bezierPoint(path, localProgress);
    const glow = drawing.createRadialGradient(point.x, point.y, 0, point.x, point.y, 12);
    glow.addColorStop(0, '#d4ff5eab');
    glow.addColorStop(1, '#d4ff5e00');
    drawing.fillStyle = glow;
    drawing.fillRect(point.x - 12, point.y - 12, 24, 24);
    drawing.beginPath();
    drawing.arc(point.x, point.y, 2.4, 0, 2 * Math.PI);
    drawing.fillStyle = '#e3ff9a';
    drawing.fill();
  }

  function measure() {
    if (!drawing) return;
    const stageRect = stage.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = stage.clientWidth;
    height = stage.clientHeight;
    const scaleX = stageRect.width / width;
    const scaleY = stageRect.height / height;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    drawing.setTransform(ratio, 0, 0, ratio, 0, 0);

    function port(element, edge) {
      const rect = element.getBoundingClientRect();
      return {
        x: (rect[edge] - stageRect.left) / scaleX,
        y: (rect.top + rect.height / 2 - stageRect.top) / scaleY,
      };
    }

    function cable(start, end) {
      const turn = (start.x + end.x) / 2;
      return [start, { x: turn, y: start.y }, { x: turn, y: end.y }, end];
    }

    incoming = cable(port(source, 'right'), port(chip, 'left'));
    const output = port(chip, 'right');
    outgoing = targets.map((button) => cable(output, port(button, 'left')));
    paint();
  }

  function play() {
    cancelAnimationFrame(frame);
    paint();
    chipScene?.setSignal(0);
    if (!drawing || !incoming || motion.matches) return;

    const start = performance.now();
    function animate(now) {
      const progress = (now - start) / 900;
      if (progress < 1) {
        paint(Math.max(0, progress));
        const pulse = Math.max(0, 1 - Math.abs(progress - .43) / .24);
        chipScene?.setSignal(pulse ** 2);
        frame = requestAnimationFrame(animate);
        return;
      }
      paint();
      chipScene?.setSignal(0);
      targets[active].animate(
        [{ boxShadow: 'inset 0 0 0 1px #d4ff5e70, 0 0 20px #d4ff5e25' }, { boxShadow: 'none' }],
        { duration: 420, easing: 'ease-out' },
      );
    }
    frame = requestAnimationFrame(animate);
  }

  targets.forEach((button, index) => {
    button.addEventListener('click', () => {
      const model = modelCatalog.find((entry) => entry.kind === button.dataset.routeKind);
      active = index;
      targets.forEach((target) => target.setAttribute('aria-pressed', String(target === button)));
      modelName.textContent = model.name;
      endpoint.textContent = `/v1${requestFor(model, '').path}`;
      playground.href = `${urls.docs}?model=${encodeURIComponent(model.id)}#playground`;
      playground.setAttribute('aria-label', `Open ${model.kind} preview in playground`);
      play();
    });
  });

  replay.addEventListener('click', play);
  chip.addEventListener('pointermove', (event) => {
    if (!chipScene || motion.matches || event.pointerType === 'touch') return;
    const box = chip.getBoundingClientRect();
    chipScene.setPointer(
      (event.clientX - box.left) / box.width * 2 - 1,
      (event.clientY - box.top) / box.height * 2 - 1,
    );
  });
  chip.addEventListener('pointerleave', () => chipScene?.setPointer(0, 0));
  motion.addEventListener('change', () => {
    cancelAnimationFrame(frame);
    paint();
    chipScene?.setSignal(0);
  });
  measure();
  const resize = new ResizeObserver(measure);
  resize.observe(stage);
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    chipScene?.setVisible(visible);
    if (!visible || entered || entry.intersectionRatio < .4) return;
    entered = true;
    play();
    loadChip();
  }, { threshold: [0, .4] });
  observer.observe(stage);
}
