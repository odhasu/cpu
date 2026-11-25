import {
  AmbientLight, BoxGeometry, DirectionalLight, ExtrudeGeometry, Group, InstancedMesh,
  MathUtils, Matrix4, Mesh, MeshStandardMaterial, OrthographicCamera, PointLight, Scene,
  Shape, WebGLRenderer,
} from 'three';

function makeMark() {
  const upperLeft = new Shape();
  upperLeft.moveTo(-2.13, -.02);
  upperLeft.bezierCurveTo(-.89, .36, -.38, 1.17, 0, 2.12);
  upperLeft.bezierCurveTo(.31, 1.57, .47, .87, .24, .02);
  upperLeft.bezierCurveTo(-.52, -.12, -1.62, -.21, -2.13, -.02);

  const upperRight = new Shape();
  upperRight.moveTo(.67, .97);
  upperRight.bezierCurveTo(.89, .67, 1.22, .46, 1.55, .23);
  upperRight.lineTo(.59, .06);
  upperRight.bezierCurveTo(.66, .38, .68, .7, .67, .97);

  const lowerLeft = new Shape();
  lowerLeft.moveTo(-1.37, -.41);
  lowerLeft.lineTo(.19, -.28);
  lowerLeft.bezierCurveTo(.09, -.79, -.12, -1.19, -.31, -1.57);
  lowerLeft.bezierCurveTo(-.63, -1.04, -.97, -.67, -1.37, -.41);

  const lowerRight = new Shape();
  lowerRight.moveTo(.51, -.27);
  lowerRight.lineTo(1.95, -.03);
  lowerRight.lineTo(2.12, -.11);
  lowerRight.bezierCurveTo(.77, -.59, .36, -1.35, -.02, -2.12);
  lowerRight.lineTo(-.12, -1.9);
  lowerRight.bezierCurveTo(.23, -1.25, .38, -.71, .51, -.27);

  const geometry = new ExtrudeGeometry([upperLeft, upperRight, lowerLeft, lowerRight], {
    depth: .13, bevelEnabled: true, bevelThickness: .035, bevelSize: .025, bevelSegments: 2, curveSegments: 14,
  });
  const material = new MeshStandardMaterial({ color: '#e8edf0', metalness: .57, roughness: .29 });
  const mark = new Mesh(geometry, material);
  mark.scale.setScalar(.83);
  mark.position.z = .46;
  return mark;
}

function makePlate(size, radius, depth, material) {
  const edge = size / 2;
  const corner = edge - radius;
  const outline = new Shape();
  outline.moveTo(-corner, -edge);
  outline.lineTo(corner, -edge);
  outline.quadraticCurveTo(edge, -edge, edge, -corner);
  outline.lineTo(edge, corner);
  outline.quadraticCurveTo(edge, edge, corner, edge);
  outline.lineTo(-corner, edge);
  outline.quadraticCurveTo(-edge, edge, -edge, corner);
  outline.lineTo(-edge, -corner);
  outline.quadraticCurveTo(-edge, -edge, -corner, -edge);
  return new Mesh(new ExtrudeGeometry(outline, {
    depth, bevelEnabled: true, bevelThickness: .06, bevelSize: .06, bevelSegments: 2, curveSegments: 6,
  }), material);
}

function makeChip() {
  const body = makePlate(4.8, .5, .22, new MeshStandardMaterial({
    color: '#475850', metalness: .68, roughness: .36,
  }));
  const face = makePlate(4.48, .46, .08, new MeshStandardMaterial({
    color: '#17231e', metalness: .35, roughness: .48,
  }));
  face.position.z = .24;

  const pinMaterial = new MeshStandardMaterial({
    color: '#758373', metalness: .55, roughness: .33, emissive: '#a7ed52', emissiveIntensity: .04,
  });
  const pins = new InstancedMesh(new BoxGeometry(.34, .115, .1), pinMaterial, 18);
  const matrix = new Matrix4();
  for (let index = 0; index < pins.count; index += 1) {
    const edge = index < 9 ? -2.45 : 2.45;
    pins.setMatrixAt(index, matrix.makeTranslation(edge, (index % 9 - 4) * .36, .06));
  }

  const model = new Group();
  model.add(body, face, pins, makeMark());
  return { model, pinMaterial };
}

export function mountRouterChip(chip, canvas, context, motion) {
  const renderer = new WebGLRenderer({ canvas, context });
  const scene = new Scene();
  const camera = new OrthographicCamera(-2.9, 2.9, 2.9, -2.9, .1, 40);
  camera.position.z = 12;

  const { model, pinMaterial } = makeChip();
  const key = new DirectionalLight('#dce8ff', 3.05);
  key.position.set(-3, 4, 7);
  const bounce = new DirectionalLight('#d9edce', 1.15);
  bounce.position.set(4, -2, 3);
  const signalLight = new PointLight('#cbff79', 0, 10);
  signalLight.position.set(0, -.1, 3);
  scene.add(model, new AmbientLight('#e1eee5', 1.35), key, bounce, signalLight);

  const restingX = .24;
  const restingY = -.24;
  const restingZ = -.095;
  model.rotation.set(restingX, restingY, restingZ);
  let pointerX = 0;
  let pointerY = 0;
  let signal = 0;
  let frame = 0;
  let shaderFailed = false;
  renderer.debug.onShaderError = () => { shaderFailed = true; };
  let visible = true;
  let lastFrame = 0;

  function requestDraw() {
    if (visible && !frame && !shaderFailed && !context.isContextLost()) frame = requestAnimationFrame(draw);
  }

  function draw(now) {
    frame = 0;
    if (!visible || context.isContextLost()) return;
    const reduced = motion.matches;
    const pitch = reduced ? restingX : restingX + pointerY * .33 + signal * .28;
    const yaw = reduced ? restingY : restingY + pointerX * .48;
    const power = reduced ? 0 : signal;
    const delta = lastFrame ? Math.min((now - lastFrame) / 1000, .05) : 1 / 60;
    model.rotation.x = reduced ? pitch : MathUtils.damp(model.rotation.x, pitch, 17, delta);
    model.rotation.y = reduced ? yaw : MathUtils.damp(model.rotation.y, yaw, 17, delta);
    model.position.z = power * .21;
    pinMaterial.emissiveIntensity = .04 + power * .96;
    signalLight.intensity = power * 11;
    renderer.render(scene, camera);
    if (shaderFailed) {
      delete chip.dataset.chipRendered;
      return;
    }
    if (!chip.hasAttribute('data-chip-rendered')) chip.dataset.chipRendered = 'true';

    if (Math.abs(model.rotation.x - pitch) > .002 || Math.abs(model.rotation.y - yaw) > .002) {
      lastFrame = now;
      requestDraw();
    } else {
      lastFrame = 0;
    }
  }

  function resize() {
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(chip.clientWidth, chip.clientHeight, false);
    requestDraw();
  }

  canvas.className = 'routing-chip-scene';
  canvas.setAttribute('aria-hidden', 'true');
  chip.append(canvas);
  canvas.addEventListener('webglcontextlost', () => {
    cancelAnimationFrame(frame);
    frame = 0;
    delete chip.dataset.chipRendered;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    shaderFailed = false;
    resize();
  });
  const sizeObserver = new ResizeObserver(resize);
  sizeObserver.observe(chip);
  resize();

  return {
    dispose() {
      visible = false;
      cancelAnimationFrame(frame);
      sizeObserver.disconnect();
      model.traverse((object) => {
        object.geometry?.dispose();
        object.material?.dispose();
      });
      renderer.dispose();
      canvas.remove();
      delete chip.dataset.chipRendered;
    },
    setPointer(x, y) {
      pointerX = x;
      pointerY = y;
      if (!motion.matches) requestDraw();
    },
    setSignal(power) {
      if (power === signal && !motion.matches) return;
      signal = power;
      requestDraw();
    },
    setVisible(inView) {
      visible = inView;
      if (visible) {
        requestDraw();
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
        lastFrame = 0;
      }
    },
  };
}
