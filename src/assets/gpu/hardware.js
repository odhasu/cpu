// The shroud and fans share this projection. Depth extends down and slightly right.
const plane = { x: 115, y: 227, ux: 1.02, uy: -.28, vx: .43, vy: .86, zx: .18, zy: .96 };
const profile = [[18, 0], [477, 0], [500, 23], [500, 193], [472, 222], [29, 222], [0, 193], [0, 23]];

function project(u, v, depth = 0) {
  return [plane.x + plane.ux * u + plane.vx * v + plane.zx * depth,
    plane.y + plane.uy * u + plane.vy * v + plane.zy * depth];
}

function polygon(ctx, points, color) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function gradient(ctx, x0, y0, x1, y1, stops) {
  const paint = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const [position, color] of stops) paint.addColorStop(position, color);
  return paint;
}

function circle(ctx, x, y, radius, color) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function trace(ctx, points, color, width = 1) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function drawSides(ctx) {
  for (const [index, vertex] of profile.entries()) {
    const next = profile[(index + 1) % profile.length];
    const start = project(...vertex);
    const end = project(...next);
    const outward = (end[1] - start[1]) * plane.zx - (end[0] - start[0]) * plane.zy;
    if (outward <= 0) continue;

    const endBottom = project(...next, 51);
    const startBottom = project(...vertex, 51);
    const paint = gradient(ctx, ...start, ...startBottom, [
      [0, '#555962'], [.13, '#26292e'], [.25, '#0f1014'], [.76, '#16181c'],
      [.86, '#34353b'], [.94, '#17191d'], [1, '#08090c'],
    ]);
    polygon(ctx, [start, end, endBottom, startBottom], paint);
    trace(ctx, [startBottom, endBottom], '#62616b55');
  }

  ctx.save();
  const front = project(0, 222);
  ctx.transform(plane.ux, plane.uy, plane.zx, plane.zy, ...front);
  ctx.fillStyle = '#08090c';
  ctx.fillRect(43, 10, 414, 28);
  for (let x = 45; x < 455; x += 4) {
    ctx.fillStyle = x % 12 === 1 ? '#50515a' : '#303138';
    ctx.fillRect(x, 12, 1.5, 24);
  }
  trace(ctx, [[31, 7], [470, 7]], '#666a756e');
  trace(ctx, [[39, 42], [461, 42]], '#696a773a');

  const accent = gradient(ctx, 291, 18, 448, 18, [
    [0, '#672b21'], [.26, '#df583f'], [.84, '#ff8962'], [1, '#f45136'],
  ]);
  ctx.shadowColor = '#ff593b';
  ctx.shadowBlur = 9;
  trace(ctx, [[291, 38], [439, 38], [447, 32]], accent, 1.7);
  ctx.restore();
}

function drawFan(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);

  circle(ctx, 0, 0, 86, '#14151a');
  circle(ctx, 0, 0, 84, gradient(ctx, -57, -65, 56, 68, [
    [0, '#969aa5'], [.26, '#393d47'], [.54, '#17191e'], [1, '#686c78'],
  ]));
  circle(ctx, 0, 0, 81.5, '#101115');
  circle(ctx, 0, 0, 77.5, '#20232a');
  circle(ctx, 0, 0, 75, '#090a0c');

  for (let blade = 0; blade < 11; blade += 1) {
    ctx.save();
    ctx.rotate(blade * Math.PI * 2 / 11);
    const brightness = 27 + Math.round(20 * (1 + Math.cos(blade * Math.PI * 2 / 11 - .7)));
    const paint = gradient(ctx, 6, -24, 52, -73, [
      [0, '#12141a'], [.52, `rgb(${brightness}, ${brightness + 3}, ${brightness + 9})`],
      [1, '#666a76'],
    ]);
    ctx.beginPath();
    ctx.moveTo(-5, -14);
    ctx.bezierCurveTo(9, -23, 15, -52, -4, -73);
    ctx.bezierCurveTo(11, -75, 24, -71, 37, -64);
    ctx.bezierCurveTo(32, -39, 23, -19, 9, -8);
    ctx.closePath();
    ctx.fillStyle = paint;
    ctx.fill();
    ctx.strokeStyle = '#a0a5b137';
    ctx.lineWidth = .7;
    ctx.stroke();
    ctx.restore();
  }

  circle(ctx, 0, 0, 22, '#0b0c0f');
  circle(ctx, 0, 0, 19, gradient(ctx, -11, -17, 12, 15, [
    [0, '#676a74'], [.45, '#333640'], [1, '#17191f'],
  ]));
  circle(ctx, 0, 0, 14.5, '#22252c');
  ctx.beginPath();
  ctx.arc(0, 0, 12.5, Math.PI * 1.02, Math.PI * 1.8);
  ctx.lineWidth = .8;
  ctx.strokeStyle = '#82858f';
  ctx.stroke();
  ctx.restore();
}

function drawShroud(ctx) {
  ctx.save();
  ctx.transform(plane.ux, plane.uy, plane.vx, plane.vy, plane.x, plane.y);
  const alloy = gradient(ctx, 28, -25, 448, 262, [
    [0, '#393d47'], [.18, '#575b65'], [.39, '#292b32'], [.66, '#3d4049'], [1, '#22242a'],
  ]);
  polygon(ctx, profile, alloy);
  ctx.save();
  ctx.clip();

  // Fine, repeatable surface grain with no external texture.
  ctx.beginPath();
  for (let i = 0; i < 2400; i += 1) {
    const x = (i * 1543 % 5003) / 10;
    const y = (i * 4051 % 2221) / 10;
    ctx.moveTo(x, y);
    ctx.lineTo(x + (i % 8) + 1, y);
  }
  ctx.lineWidth = .55;
  ctx.strokeStyle = '#c5c8d012';
  ctx.stroke();

  const inset = gradient(ctx, 135, 12, 316, 216, [
    [0, '#1c1e24'], [.43, '#2c3038'], [.69, '#24262d'], [1, '#131419'],
  ]);
  polygon(ctx, [[28, 13], [471, 13], [487, 31], [487, 185], [466, 207], [34, 207], [13, 187], [13, 31]], inset);
  trace(ctx, [[13, 31], [28, 13], [471, 13], [487, 31]], '#aeb3c052');
  trace(ctx, [[13, 187], [34, 207], [466, 207], [487, 185]], '#121319', 1.8);

  const bridge = gradient(ctx, 188, 24, 290, 195, [
    [0, '#777985'], [.24, '#41454f'], [.59, '#292c33'], [1, '#555762'],
  ]);
  polygon(ctx, [[171, 14], [327, 14], [282, 85], [282, 136], [327, 206], [171, 206], [216, 136], [216, 85]], bridge);
  polygon(ctx, [[190, 23], [308, 23], [272, 83], [272, 139], [304, 197], [196, 197], [228, 139], [228, 83]], '#1d1f25');
  polygon(ctx, [[206, 28], [294, 28], [264, 83], [264, 139], [292, 191], [208, 191], [236, 138], [236, 86]], '#272a31');
  trace(ctx, [[190, 23], [228, 83], [228, 139], [196, 197]], '#8e929d65');
  trace(ctx, [[308, 23], [272, 83], [272, 139], [304, 197]], '#9398a348');
  for (let y = 93; y <= 126; y += 6) {
    trace(ctx, [[242, y], [257, y]], '#8286916e');
  }

  drawFan(ctx, 122, 110);
  drawFan(ctx, 378, 110);

  for (const [x, y] of [[23, 33], [23, 184], [477, 33], [477, 184], [250, 38], [250, 181]]) {
    circle(ctx, x, y, 4, '#101116');
    circle(ctx, x, y, 2.9, '#737681');
    trace(ctx, [[x - 1.6, y + .5], [x + 1.6, y - .5]], '#25262c', .8);
  }

  trace(ctx, [[18, 1], [478, 1], [499, 23]], '#c9cdd282', 1.3);
  trace(ctx, [[0, 192], [29, 220], [471, 220], [500, 193]], '#9398a782', 1.4);
  ctx.restore();
  ctx.restore();
}

export function drawGpu(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.save();
  ctx.scale(2, 2);
  ctx.save();
  ctx.filter = 'blur(23px)';
  ctx.beginPath();
  ctx.ellipse(432, 343, 278, 82, -.25, 0, Math.PI * 2);
  ctx.fillStyle = '#000b';
  ctx.fill();
  ctx.restore();

  drawSides(ctx);
  drawShroud(ctx);
  ctx.restore();
}
